// Small MQTT 3.1.1 / WSS transport. QoS 0, clean sessions, no retained game data.
// The public endpoint is for pilot sessions; config.js accepts a school-owned broker.
const encoder=new TextEncoder(),decoder=new TextDecoder();
const concatenate=(...arrays)=>{const out=new Uint8Array(arrays.reduce((n,a)=>n+a.length,0));let at=0;for(const a of arrays){out.set(a,at);at+=a.length;}return out;};
const utf=s=>{const bytes=encoder.encode(s);return concatenate(new Uint8Array([bytes.length>>8,bytes.length&255]),bytes);};
export function mqttPacket(type,payload=new Uint8Array()) {let length=payload.length,remaining=[];do{let d=length%128;length=Math.floor(length/128);if(length)d|=128;remaining.push(d);}while(length);return concatenate(new Uint8Array([type,...remaining]),payload);}
export function parseMqtt(buffer) {
 const packets=[];let at=0;
 while(at<buffer.length){const begin=at;if(buffer.length-at<2)break;const type=buffer[at++];let multiplier=1,length=0,digit,count=0;
  do{if(at>=buffer.length)return {packets,rest:buffer.slice(begin)};digit=buffer[at++];length+=(digit&127)*multiplier;multiplier*=128;if(++count>4||length>262144)throw new Error('Trama demasiado grande');}while(digit&128);
  if(buffer.length-at<length)return {packets,rest:buffer.slice(begin)};
  packets.push({type,payload:buffer.slice(at,at+length)});at+=length;
 }
 return {packets,rest:buffer.slice(at)};
}
class MqttSocket {
 constructor(url,will=null,credentials={}){this.url=url;this.will=will;this.credentials=credentials;this.ws=null;this.buffer=new Uint8Array();this.pending=new Map();this.packetId=0;this.onMessage=()=>{};this.onClose=()=>{};this.closed=false;this.lastRx=Date.now();}
 connect(){return new Promise((resolve,reject)=>{
  const ws=new WebSocket(this.url,['mqtt']);this.ws=ws;ws.binaryType='arraybuffer';let ready=false;
  const timeout=setTimeout(()=>{if(!ready){reject(new Error('El servicio de relevo no responde.'));ws.close();}},9000);
  ws.onopen=()=>{
   let flags=2;if(this.will)flags|=4;if(this.credentials.username)flags|=128;if(this.credentials.password)flags|=64;
   let payload=concatenate(utf('MQTT'),new Uint8Array([4,flags,0,20]),utf('mate-'+crypto.randomUUID()));
   if(this.will)payload=concatenate(payload,utf(this.will.topic),utf(this.will.payload));
   if(this.credentials.username)payload=concatenate(payload,utf(this.credentials.username));if(this.credentials.password)payload=concatenate(payload,utf(this.credentials.password));
   ws.send(mqttPacket(0x10,payload));
  };
  ws.onmessage=event=>{
   if(!(event.data instanceof ArrayBuffer))return;
   this.lastRx=Date.now();
   try{const parsed=parseMqtt(concatenate(this.buffer,new Uint8Array(event.data)));this.buffer=parsed.rest;
    for(const packet of parsed.packets){const kind=packet.type>>4,b=packet.payload;
     if(kind===2){if(b[1]!==0){clearTimeout(timeout);reject(new Error('El servicio de relevo ha rechazado la conexión.'));ws.close();return;}ready=true;clearTimeout(timeout);resolve(this);}
     if(kind===9){const id=b[0]*256+b[1];this.pending.get(id)?.();this.pending.delete(id);}
     if(kind===3&&b.length>2){const length=b[0]*256+b[1];if(length>b.length-2)continue;const topic=decoder.decode(b.slice(2,2+length)),qos=(packet.type>>1)&3,offset=2+length+(qos?2:0);if(qos===1)ws.send(mqttPacket(0x40,b.slice(2+length,4+length)));if(b.length-offset>100000)continue;let decoded;try{decoded=JSON.parse(decoder.decode(b.slice(offset)));}catch{continue;}try{this.onMessage(topic,decoded);}catch(error){queueMicrotask(()=>{throw error;});}}
    }
   }catch{ws.close();}
  };
  ws.onerror=()=>{if(!ready){clearTimeout(timeout);reject(new Error('No se puede abrir el relevo online desde esta red.'));}};
  ws.onclose=()=>{clearTimeout(timeout);clearInterval(this.ping);if(!ready)reject(new Error('Se ha cerrado el servicio de relevo.'));if(!this.closed)this.onClose();};
  this.ping=setInterval(()=>{if(ws.readyState===WebSocket.OPEN)ws.send(mqttPacket(0xc0));if(Date.now()-this.lastRx>45000)ws.close();},15000);
 });}
 subscribe(topics){return new Promise((resolve,reject)=>{
  const id=++this.packetId;const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error('No se ha podido preparar el canal de sala.'));},6000);
  this.pending.set(id,()=>{clearTimeout(timer);resolve();});this.ws.send(mqttPacket(0x82,concatenate(new Uint8Array([id>>8,id&255]),...topics.map(t=>concatenate(utf(t),new Uint8Array([0]))))));
 });}
 publish(topic,data){if(this.ws?.readyState!==WebSocket.OPEN)return;if(data?.type==='state'&&this.ws.bufferedAmount>131072)return;this.ws.send(mqttPacket(0x30,concatenate(utf(topic),encoder.encode(JSON.stringify(data)))));}
 close(){this.closed=true;clearInterval(this.ping);if(this.ws?.readyState===WebSocket.OPEN)this.ws.send(mqttPacket(0xe0));this.ws?.close();}
}
class RelayConnection {
 constructor(hub,id,host){this.hub=hub;this.id=id;this.host=host;this.open=true;this.transport='relay';this.handlers=new Map();this.lastSeen=Date.now();}
 on(name,fn){if(!this.handlers.has(name))this.handlers.set(name,[]);this.handlers.get(name).push(fn);return this;}
 emit(name,value){for(const fn of this.handlers.get(name)||[])fn(value);}
 send(data){if(!this.open)return;
  if(this.host&&data.type==='lobby'&&!data.resend){
   if(this.hub.lastLobby===data.revision)return;this.hub.lastLobby=data.revision;this.hub.socket.publish(this.hub.root+'/broadcast',data);
  }else if(this.host&&data.type==='start'&&!data.reconnecting){
   if(this.hub.lastStart===data.matchId)return;this.hub.lastStart=data.matchId;this.hub.socket.publish(this.hub.root+'/broadcast',data);
  }else if(this.host&&data.type==='state'){
   if(this.hub.lastTick===data.state.tick)return;this.hub.lastTick=data.state.tick;this.hub.socket.publish(this.hub.root+'/broadcast',data);
  }else this.hub.socket.publish(this.host?this.hub.root+'/to/'+this.id:this.hub.root+'/in',{cid:this.id,kind:'data',data});
 }
 close(){if(!this.open)return;this.open=false;this.hub.socket.publish(this.host?this.hub.root+'/to/'+this.id:this.hub.root+'/in',{cid:this.id,kind:'close'});this.emit('close');this.hub.connections.delete(this.id);}
}
export class RelayHub {
 constructor(config,code){this.config=config;this.root='patiointerior/mate/v1/'+code;this.connections=new Map();this.lastTick=-1;this.closed=false;}
 async host(onConnection){
  this.socket=new MqttSocket(this.config.url,{topic:this.root+'/broadcast',payload:JSON.stringify({type:'ended'})},this.config);
  this.socket.onMessage=(topic,msg)=>{
   if(topic!==this.root+'/in'||typeof msg?.cid!=='string'||!/^[a-f0-9-]{36}$/.test(msg.cid))return;
   let conn=this.connections.get(msg.cid);
   if(!conn){if(msg.kind!=='data'||msg.data?.type!=='hello'||this.connections.size>=16)return;conn=new RelayConnection(this,msg.cid,true);this.connections.set(msg.cid,conn);onConnection(conn);}
   conn.lastSeen=Date.now();if(msg.kind==='close')conn.close();else if(msg.kind==='data')conn.emit('data',msg.data);
  };
  this.socket.onClose=()=>{for(const c of this.connections.values()){c.open=false;c.emit('close');}this.connections.clear();};
  await this.socket.connect();await this.socket.subscribe([this.root+'/in']);
  this.watch=setInterval(()=>{for(const c of this.connections.values())if(Date.now()-c.lastSeen>6000)c.close();},1500);
 }
 async guest(){
  const id=crypto.randomUUID();this.socket=new MqttSocket(this.config.url,null,this.config);const conn=new RelayConnection(this,id,false);this.connections.set(id,conn);
  this.socket.onMessage=(topic,msg)=>{if(topic===this.root+'/broadcast'){conn.lastSeen=Date.now();conn.emit('data',msg);}else if(topic===this.root+'/to/'+id&&msg?.cid===id){conn.lastSeen=Date.now();if(msg.kind==='close'){conn.open=false;conn.emit('close');}else if(msg.kind==='data')conn.emit('data',msg.data);}};
  this.socket.onClose=()=>{conn.open=false;conn.emit('close');};
  await this.socket.connect();await this.socket.subscribe([this.root+'/to/'+id,this.root+'/broadcast']);
  setTimeout(()=>{if(!this.closed)conn.emit('open');},0);return conn;
 }
 close(){this.closed=true;clearInterval(this.watch);for(const c of this.connections.values())c.close();this.socket?.close();}
}
