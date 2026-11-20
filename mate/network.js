import {NETWORK_CONFIG} from './config.js';
import {CHARACTERS} from './characters.js';
import {normalizeRules} from './sim.js';
import {RelayHub} from './relay.js';
import {PROTOCOL,validCode,validToken,cleanProfile,inputPacket,isSnapshot} from './protocol.js';
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeCode=()=>Array.from(crypto.getRandomValues(new Uint8Array(6)),n=>alphabet[n%alphabet.length]).join('');
const token=()=>crypto.randomUUID();
const errorText={
 'peer-unavailable':'No encontramos esa sala. Comprueba el código y que el anfitrión siga conectado.',
 'network':'Se ha interrumpido la conexión. Comprueba la red y vuelve a intentarlo.',
 'server-error':'El servicio de conexión no responde. Puedes seguir jugando en entrenamiento.',
 'socket-error':'No podemos contactar con el servicio de salas desde esta red.',
 'socket-closed':'Se ha cerrado la conexión con el servicio de salas.',
 'unavailable-id':'Ese código ya está ocupado. Crea otra sala.',
 'browser-incompatible':'Este navegador no permite la conexión del juego. Prueba Chrome, Edge o Firefox actualizado.',
 'webrtc':'La red no permite conectar estos ordenadores. Prueba otra red o configura el servicio ICE del centro.',
};
export class Room {
 constructor(callbacks={}) {
  this.cb=callbacks;this.peer=null;this.isHost=false;this.members=new Map();this.connections=new Map();this.closed=false;this.started=false;this.seq=0;this.lastStateTick=-1;this.lobbyRevision=0;this.lastLobbyRevision=0;this.timers=[];this.latency=0;this.transport='direct';this.relay=null;this.hostLink=null;this.myId=null;this.code=null;
 }
 status(text){this.cb.onStatus?.(text);}
 publicRoster(){return [...this.members.values()].map(({resumeToken,...m})=>m);}
 schedule(fn,ms){const t=setTimeout(()=>{if(!this.closed)fn()},ms);this.timers.push(t);return t;}
 async openPeer(id) {
  if(!window.Peer)throw new Error('No se ha podido cargar el conector online. Recarga la página.');
  const options={...NETWORK_CONFIG.peerOptions,...(window.MATE_PEER_OPTIONS||{})};
  this.peer=id?new window.Peer(id,options):new window.Peer(options);
  const opened=await new Promise((resolve,reject)=>{
   let settled=false;
   const timeout=this.schedule(()=>{if(!settled){settled=true;reject(new Error('La conexión tarda demasiado. Comprueba internet o prueba entrenamiento.'));}},NETWORK_CONFIG.connectTimeoutMs);
   this.peer.on('open',peerId=>{if(!settled){settled=true;clearTimeout(timeout);resolve(peerId);}});
   this.peer.on('error',error=>{
    const message=errorText[error.type]||'No se ha podido conectar la sala. Vuelve a intentarlo.';
    if(!settled){settled=true;clearTimeout(timeout);const failure=new Error(message);failure.type=error.type;reject(failure);}
    else this.cb.onError?.(message);
   });
   this.peer.on('disconnected',()=>{
    if(this.closed)return;
    this.status('Reconectando el servicio de salas…');
    this.schedule(()=>{if(this.peer&&!this.peer.destroyed&&this.peer.disconnected)this.peer.reconnect()},1500);
   });
  });
  return opened;
 }
 async host(profile,rules) {
  this.isHost=true;this.code=makeCode();this.rules=normalizeRules(rules);this.status('Abriendo la sala…');
  this.myId=NETWORK_CONFIG.roomPrefix+this.code;this.hostId=this.myId;
  const c=cleanProfile(profile).character;
  this.members.set(this.myId,{id:this.myId,team:0,character:c,name:CHARACTERS[c].name,ready:true,connected:true,host:true});
  this.relay=new RelayHub(NETWORK_CONFIG.relay,this.code);
  const results=await Promise.allSettled([
   this.openPeer(this.myId).then(()=>this.peer.on('connection',conn=>this.acceptConnection(conn))),
   this.relay.host(conn=>this.acceptConnection(conn)),
  ]);
  if(this.closed)return;
  if(results[0].status==='rejected'&&results[0].reason?.type==='unavailable-id'){this.relay?.close();throw new Error('El código ya estaba ocupado. Pulsa «Crear sala» de nuevo.');}
  if(results.every(r=>r.status==='rejected'))throw new Error('No se ha podido abrir la sala online. Comprueba la conexión.');
  if(results[1].status==='rejected'){this.relay.close();this.relay=null;}
  this.status('Sala abierta');this.emitLobby();return this.code;
 }
 acceptConnection(conn) {
  if(this.connections.size>=NETWORK_CONFIG.maxHumans+4){conn.close();return;}
  let memberId=null,lastSeq=-1,rate=0,rateStart=Date.now();
  const deadline=this.schedule(()=>{if(!memberId)conn.close()},NETWORK_CONFIG.connectTimeoutMs);
  conn.on('data',data=>{
   if(this.closed||!data||typeof data!=='object')return;
   if(Date.now()-rateStart>1000){rate=0;rateStart=Date.now();}
   if(++rate>100){conn.close();return;}
   if(!memberId){
    if(data.type!=='hello'||data.v!==PROTOCOL||!validToken(data.clientId))return conn.close();
    const candidate='c-'+data.clientId,existing=this.members.get(candidate);
    if(existing){
     if(data.resumeToken!==existing.resumeToken)return this.reject(conn,'No se puede recuperar esa plaza. Vuelve a entrar desde la pantalla inicial.');
     memberId=candidate;existing.connected=true;existing.ready=true;
     const previous=this.connections.get(memberId);if(previous&&previous!==conn)previous.close();
    } else {
     if(this.started)return this.reject(conn,'La partida ya ha empezado. Espera a que termine para entrar.');
     const humans=this.publicRoster().filter(m=>m.connected),counts=[0,1].map(t=>humans.filter(m=>m.team===t).length);
     if(humans.length>=Math.min(NETWORK_CONFIG.maxHumans,this.rules.teamSize*2))return this.reject(conn,'La sala está llena. El anfitrión puede ampliar los equipos antes de empezar.');
     const team=counts[0]<=counts[1]?0:1,c=cleanProfile(data.profile).character;
     memberId=candidate;
     this.members.set(memberId,{id:memberId,team,character:c,name:CHARACTERS[c].name,ready:false,connected:true,host:false,resumeToken:token()});
    }
    clearTimeout(deadline);this.connections.set(memberId,conn);
    this.send(conn,{type:'welcome',v:PROTOCOL,id:memberId,hostId:this.myId,code:this.code,started:this.started,matchId:this.matchId||null,rules:this.rules,resumeToken:this.members.get(memberId).resumeToken});
    this.cb.onParticipant?.(memberId,true);this.emitLobby();
    if(this.started)this.send(conn,{type:'start',rules:this.rules,matchId:this.matchId,reconnecting:true});
    return;
   }
   if(this.connections.get(memberId)!==conn)return;
   if(data.type==='hello'){this.send(conn,{type:'welcome',v:PROTOCOL,id:memberId,hostId:this.myId,code:this.code,started:this.started,matchId:this.matchId||null,rules:this.rules,resumeToken:this.members.get(memberId).resumeToken});this.emitLobby();if(this.started)this.send(conn,{type:'start',rules:this.rules,matchId:this.matchId,reconnecting:true});return;}
   if(data.type==='input'&&this.started){const packet=inputPacket(data,lastSeq);if(packet){lastSeq=packet.seq;this.cb.onInput?.(memberId,packet.input);}return;}
   if(data.type==='ping') {if(typeof data.at==='number'&&Number.isFinite(data.at))this.send(conn,{type:'pong',at:data.at});if(data.lobbyRevision!==this.lobbyRevision)this.send(conn,{...this.lobbyPacket(),resend:true});return;}
   if(this.started)return;
   const m=this.members.get(memberId);
   if(data.type==='ready'&&typeof data.ready==='boolean'){m.ready=data.ready;this.emitLobby();}
   if(data.type==='profile'){m.character=cleanProfile(data.profile).character;m.name=CHARACTERS[m.character].name;this.emitLobby();}
   if(data.type==='team'&&(data.team===0||data.team===1))this.changeTeam(memberId,data.team);
  });
  conn.on('close',()=>{
   clearTimeout(deadline);
   if(memberId&&this.connections.get(memberId)===conn){this.connections.delete(memberId);const m=this.members.get(memberId);if(m)m.connected=false;if(!this.started)this.members.delete(memberId);this.cb.onParticipant?.(memberId,false);this.emitLobby();}
  });
  conn.on('error',()=>conn.close());
 }
 reject(conn,message){this.send(conn,{type:'rejected',message});this.schedule(()=>conn.close(),300);}
 send(conn,data){try{if(conn?.open&&(!conn.dataChannel||conn.dataChannel.bufferedAmount<131072||data.type!=='state'))conn.send(data);}catch{ /* Disconnect is handled by the connection event. */ }}
 lobbyPacket(){return {type:'lobby',v:PROTOCOL,revision:this.lobbyRevision,members:this.publicRoster(),rules:this.rules,code:this.code,started:this.started,matchId:this.matchId||null};}
 emitLobby(){this.lobbyRevision++;const data=this.lobbyPacket();for(const c of this.connections.values())this.send(c,data);this.cb.onLobby?.(data);}
 async join(code,profile,resume={}) {
  if(!validCode(code))throw new Error('El código de sala tiene seis letras o números.');
  this.isHost=false;this.code=code;this.status('Buscando la sala…');
  this.clientId=validToken(resume.clientId)?resume.clientId:token();
  let conn;
  if(window.MATE_FORCE_RELAY){
   this.relay=new RelayHub(NETWORK_CONFIG.relay,code);conn=await this.relay.guest();this.transport='relay';
  }else{
   try{
    await this.openPeer();if(this.closed)return;
    const direct=this.peer.connect(NETWORK_CONFIG.roomPrefix+code,{reliable:true,serialization:'json',metadata:{v:PROTOCOL}});
    const opened=await new Promise(resolve=>{let done=false;const timer=setTimeout(()=>{if(!done){done=true;resolve(false)}},NETWORK_CONFIG.directWaitMs);direct.on('open',()=>{if(!done){done=true;clearTimeout(timer);resolve(true)}});direct.on('error',()=>{if(!done){done=true;clearTimeout(timer);resolve(false)}});});
    if(opened){conn=direct;this.transport='direct';}
    else{direct.close();throw new Error('Direct connection unavailable');}
   }catch{
    if(this.closed)return;
    this.status('Conectando por relevo…');this.relay=new RelayHub(NETWORK_CONFIG.relay,code);conn=await this.relay.guest();this.transport='relay';
   }
  }
  this.hostLink=conn;
  return new Promise((resolve,reject)=>{
   let welcomed=false,helloRetry=null;
   const timeout=this.schedule(()=>{if(!welcomed){clearInterval(helloRetry);conn.close();reject(new Error('No se ha podido abrir la partida entre estos ordenadores. Comprueba el código o prueba otra red.'));}},NETWORK_CONFIG.connectTimeoutMs);
   const hello=()=>this.send(conn,{type:'hello',v:PROTOCOL,clientId:this.clientId,resumeToken:resume.resumeToken||'',profile:cleanProfile(profile)});
   conn.on('open',hello);
   helloRetry=setInterval(()=>{if(welcomed||this.closed)clearInterval(helloRetry);else hello();},1000);
   if(conn.transport!=='relay'&&conn.open)queueMicrotask(hello);
   conn.on('data',data=>{
    if(!data||typeof data!=='object')return;
    if(data.type==='welcome'&&data.v===PROTOCOL){welcomed=true;clearInterval(helloRetry);clearTimeout(timeout);this.myId=data.id;this.hostId=data.hostId;this.cb.onWelcome?.({...data,clientId:this.clientId});if(data.started)this.beginRemote(data);this.status(this.transport==='relay'?'Conectado por relevo WSS':'Conectado al anfitrión');resolve(this.code);}
    if(data.type==='rejected'){clearTimeout(timeout);reject(new Error(String(data.message).slice(0,200)));this.cb.onError?.(String(data.message).slice(0,200));}
    if(!welcomed)return;
    if(data.type==='lobby'&&Number.isSafeInteger(data.revision)&&data.revision>this.lastLobbyRevision&&Array.isArray(data.members)&&data.members.length<=26){this.lastLobbyRevision=data.revision;this.rules=normalizeRules(data.rules);if(!data.started)this.started=false;this.cb.onLobby?.(data);if(data.started)this.beginRemote(data);}
    if(data.type==='start')this.beginRemote(data);
    if(data.type==='state'&&!this.ended&&this.started&&data.matchId===this.matchId&&isSnapshot(data.state)&&data.state.tick>this.lastStateTick){this.lastStateTick=data.state.tick;this.cb.onState?.(data.state);}
    if(data.type==='pong'){this.latency=Math.max(0,Math.round((performance.now()-data.at)/2));this.cb.onLatency?.(this.latency);}
    if(data.type==='ended'){this.ended=true;this.cb.onDisconnect?.('El anfitrión ha cerrado la sala.');}
   });
   conn.on('close',()=>{clearInterval(helloRetry);clearTimeout(timeout);if(!welcomed)reject(new Error('La sala se ha cerrado antes de conectar.'));else if(!this.closed)this.cb.onDisconnect?.('Se ha perdido la conexión con el anfitrión. Puedes intentar recuperar tu plaza.');});
   conn.on('error',()=>{if(!welcomed){clearTimeout(timeout);reject(new Error('No se ha podido conectar con esa sala.'));}});
   const ping=setInterval(()=>{if(this.closed)return clearInterval(ping);if(conn.open)this.send(conn,{type:'ping',at:performance.now(),lobbyRevision:this.lastLobbyRevision});},2000);this.pingTimer=ping;
  });
 }
 beginRemote(data){if(typeof data.matchId!=='string'||data.matchId===this.matchId)return;this.matchId=data.matchId;this.started=true;this.lastStateTick=-1;this.cb.onStart?.(data);}
 choose(profile){if(this.isHost){const m=this.members.get(this.myId);m.character=cleanProfile(profile).character;m.name=CHARACTERS[m.character].name;this.emitLobby();}else this.send(this.hostLink,{type:'profile',profile:cleanProfile(profile)});}
 ready(value){if(this.isHost)return;this.send(this.hostLink,{type:'ready',ready:value});}
 changeTeam(id,team) {
  if(!this.isHost){this.send(this.hostLink,{type:'team',team});return;}
  if(this.started||!this.members.has(id)||![0,1].includes(team))return;
  if(this.publicRoster().filter(m=>m.team===team&&m.id!==id&&m.connected).length>=this.rules.teamSize){this.cb.onError?.('Ese equipo está completo.');return;}
  this.members.get(id).team=team;this.emitLobby();
 }
 configure(rules){if(!this.isHost||this.started)return false;const r=normalizeRules(rules);if([0,1].some(t=>this.publicRoster().filter(m=>m.team===t&&m.connected).length>r.teamSize)){this.cb.onError?.('Ese tamaño no permite a todos los compañeros conectados.');return false;}this.rules=r;this.emitLobby();return true;}
 start(){
  if(!this.isHost||this.started)return false;
  if(this.publicRoster().some(m=>m.connected&&!m.ready)){this.cb.onError?.('Espera a que todos los compañeros marquen «Listo».');return false;}
  this.started=true;this.matchId=crypto.randomUUID();const data={type:'start',v:PROTOCOL,matchId:this.matchId,rules:this.rules,members:this.publicRoster().filter(m=>m.connected)};
  for(const c of this.connections.values())this.send(c,data);this.emitLobby();this.cb.onStart?.(data);return true;
 }
 broadcastState(state){if(!this.isHost)return;for(const c of this.connections.values())this.send(c,{type:'state',matchId:this.matchId,state});}
 input(input){if(this.isHost)this.cb.onInput?.(this.myId,input);else this.send(this.hostLink,{type:'input',seq:++this.seq,input});}
 returnToLobby(){if(!this.isHost)return;this.started=false;for(const [id,m] of this.members){if(!m.connected)this.members.delete(id);else m.ready=m.host;}this.emitLobby();}
 close(){if(this.closed)return;if(this.isHost)for(const c of this.connections.values())this.send(c,{type:'ended'});this.closed=true;for(const t of this.timers)clearTimeout(t);clearInterval(this.pingTimer);this.peer?.destroy();this.relay?.close();this.connections.clear();}
}
