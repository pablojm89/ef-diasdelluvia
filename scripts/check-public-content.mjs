// Guardrail for a public educational repository. It cannot identify real names
// or inspect the content of photographs; human review remains necessary.
import {execFileSync} from 'node:child_process';

const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const privatePath=/(?:^|\/)(?:private|privado|alumnado|alumnos|datos-alumnos|student-data|exports|recordings)(?:\/|$)|(?:^|\/)\.env(?:\.|$)|\.(?:csv|tsv|xlsx?|ods|sqlite3?|db|jsonl|ndjson|parquet)$/i;
const credential=/(?:github_pat_[A-Za-z0-9_]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[A-Z0-9]{16})/;
const email=/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const permittedEmail=value=>value==='team@peerjs.com'||/@(?:[a-z0-9-]+\.)*(?:example\.(?:com|org|net)|test|invalid)$/i.test(value);
const problems=[];
for(const file of files){
 if(privatePath.test(file))problems.push(`${file}: formato o ruta reservados a datos privados`);
 let bytes;
 try{bytes=execFileSync('git',['show',`:${file}`]);}catch{continue;}
 if(bytes.includes(0))continue;
 const text=bytes.toString('utf8');
 if(credential.test(text))problems.push(`${file}: posible credencial`);
 if([...text.matchAll(email)].some(m=>!permittedEmail(m[0])))problems.push(`${file}: correo no autorizado para publicación`);
}
if(problems.length){
 // Print paths only, never the suspected private content itself.
 console.error('Publicación bloqueada. Revisar manualmente:');
 console.error(problems.join('\n'));
 process.exit(1);
}
console.log(`Contenido público revisado: ${files.length} archivos; sin formatos privados, correos personales ni patrones de credenciales detectados.`);
