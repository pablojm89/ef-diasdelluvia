export const CHARACTERS=[
 {name:'Vega',tag:'La capitana',skin:'#e8ae7e',hair:'#3a2431',style:'pony',accent:'#ffdc79'},
 {name:'Kai',tag:'El explorador',skin:'#b8734d',hair:'#172c39',style:'curl',accent:'#b2f5d5'},
 {name:'Lúa',tag:'La estratega',skin:'#f0c9a0',hair:'#7749b5',style:'bob',accent:'#e0baff'},
 {name:'Neo',tag:'El relámpago',skin:'#d99b68',hair:'#242c48',style:'cap',accent:'#ffb984'},
 {name:'Ada',tag:'La inventora',skin:'#905b46',hair:'#251e33',style:'puffs',accent:'#ff9ed0'},
 {name:'Max',tag:'El guardián',skin:'#edbb93',hair:'#b16b32',style:'spike',accent:'#91d8ff'},
 {name:'Nora',tag:'La cometa',skin:'#c68b62',hair:'#1b2637',style:'braid',accent:'#cfeb7d'},
 {name:'Leo',tag:'El soñador',skin:'#f3c8a0',hair:'#b9974a',style:'band',accent:'#f9d18b'},
];
export const TEAM_COLORS=[{main:'#39cdbb',light:'#9cffee',dark:'#197c86',name:'COMETAS'},{main:'#f78561',light:'#ffd295',dark:'#a6454a',name:'RAYOS'}];
export function paintCharacter(ctx,p,{scale=1,face=p.face||1,pose='idle',time=0,selected=false}={}) {
 const c=CHARACTERS[p.character%8]||CHARACTERS[0],team=TEAM_COLORS[p.team]||TEAM_COLORS[0];
 const run=Math.hypot(p.vx||0,p.vy||0)>10,gait=run?Math.sin(time*18):0;
 ctx.save();ctx.scale(face*scale,scale);ctx.translate(-16,-39);
 const r=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
 // A pixel silhouette is drawn directly: no copyrighted sprites or asset CDN.
 r(8,20,16,15,'#102337');r(6,22,20,10,'#102337');
 const catching=pose==='catch'||p.catchTime>0,throwing=pose==='throw'||p.throwFlash>0;
 if(catching){r(2,15,5,12,'#102337');r(26,15,5,12,'#102337');r(3,14,4,7,c.skin);r(26,14,4,7,c.skin);r(3,21,4,6,team.main);r(25,21,4,6,team.main);}
 else if(throwing){r(26,19,10,5,'#102337');r(26,19,8,4,c.skin);r(3,24,5,11,'#102337');r(3,24,4,8,team.dark);r(3,31,4,4,c.skin);}
 else {r(3,24+gait,5,10,'#102337');r(25,24-gait,5,10,'#102337');r(4,24+gait,4,6,team.dark);r(25,24-gait,4,6,team.main);r(4,30+gait,4,4,c.skin);r(25,30-gait,4,4,c.skin);}
 r(8,21,17,12,team.main);r(8,21,4,11,team.dark);r(13,21,9,2,team.light);r(14,26,4,5,'#f2f3d8');r(15,27,2,3,team.main);r(9,33,15,5,'#243955');r(15,33,2,5,'#101e34');
 r(9,37+gait*2,5,5,c.skin);r(19,37-gait*2,5,5,c.skin);r(7,40+gait*2,8,4,'#122539');r(18,40-gait*2,8,4,'#122539');r(8,40+gait*2,6,2,'#eaf1dc');r(19,40-gait*2,6,2,'#eaf1dc');
 r(8,4,17,16,'#102337');r(10,6,14,14,c.skin);r(7,10,3,6,c.skin);r(23,10,3,6,c.skin);r(10,16,3,3,'#b46f56');r(15,17,7,2,'#b4785b');
 r(15,11,2,3,'#18273a');r(21,11,2,3,'#18273a');r(15,11,1,1,'#fff4d9');r(21,11,1,1,'#fff4d9');r(18,15,3,1,'#633b3a');
 r(9,3,16,5,c.hair);r(8,6,4,5,c.hair);
 if(c.style==='pony'){r(5,5,5,13,c.hair);r(3,13,5,9,c.hair);r(5,7,4,3,c.accent);r(10,7,4,3,c.hair);}
 if(c.style==='curl'){r(8,1,17,7,c.hair);r(5,4,5,8,c.hair);r(24,4,4,7,c.hair);r(11,0,5,3,c.hair);r(19,0,4,3,c.hair);}
 if(c.style==='bob'){r(7,5,4,16,c.hair);r(23,5,4,16,c.hair);r(10,6,8,3,c.hair);r(11,4,12,2,'#a77dd4');}
 if(c.style==='cap'){r(7,1,18,6,'#e9bf63');r(22,5,9,3,'#ffd78c');r(10,0,11,2,'#ffe5a2');}
 if(c.style==='puffs'){r(3,2,8,9,c.hair);r(24,2,8,9,c.hair);r(5,3,3,2,'#56405c');r(26,3,3,2,'#56405c');r(8,8,3,2,c.accent);r(24,8,3,2,c.accent);}
 if(c.style==='spike'){r(10,0,4,6,c.hair);r(16,-2,4,8,c.hair);r(22,0,3,6,c.hair);r(13,3,9,2,'#d29654');}
 if(c.style==='braid'){r(6,4,4,20,c.hair);r(4,18,5,8,c.hair);r(5,23,3,3,c.accent);r(10,6,10,2,c.hair);}
 if(c.style==='band'){r(9,5,16,3,c.accent);r(6,6,3,3,c.accent);r(6,8,3,7,c.accent);r(16,1,6,3,'#dbb965');}
 if(selected){r(13,-6,9,2,'#fff0a7');r(16,-4,3,3,'#fff0a7');}
 ctx.restore();
}
export function portrait(character,team=0) {
 // Canvas-independent SVG portrait, generated from the same pixel drawing code.
 const rectangles=[];
 const fake={fillStyle:'',save(){},restore(){},scale(){},translate(){},fillRect(x,y,w,h){rectangles.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.fillStyle}"/>`);}};
 paintCharacter(fake,{character,team},{scale:1});
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -7 36 54" shape-rendering="crispEdges">${rectangles.join('')}</svg>`);
}
