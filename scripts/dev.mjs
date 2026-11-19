import {spawn} from 'node:child_process';
const args=process.argv.slice(2);
const option=(key,fallback)=>{const index=args.indexOf(key);return index>=0?args[index+1]:fallback;};
const port=option('--port','3000');
const host=option('--host','0.0.0.0');
if(!/^\d+$/.test(port))throw new Error('Puerto no válido');
const server=spawn('python',['-m','http.server',port,'--bind',host],{stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.kill(signal));
server.on('exit',code=>process.exit(code??0));
