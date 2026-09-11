import './espace.js';
import {chapters} from './chapitres.js';
import {put,results} from './suivi.js';
import {diagram} from './schemas.js';
const $=id=>document.getElementById(id), chapter=chapters[document.body.dataset.chapter], params=new URLSearchParams(location.search);
let deck=[...chapter.cards];
if(params.get('review')==='1'){const errors=results().errors;deck=deck.filter(c=>errors.has(c.id));}
const selected=params.get('card');if(selected){const i=deck.findIndex(c=>c.id===selected);if(i>0)deck.unshift(...deck.splice(i,1));}
let position=0,good=0,bad=0,stage='question',session=null,seconds=0,since=document.visibilityState==='visible'?performance.now():null;
function saveTime(){if(since!==null){seconds+=(performance.now()-since)/1000;since=performance.now();}if(session)put({...session,seconds:Math.round(seconds)});}
function show(){
 $('progress').max=Math.max(deck.length,1);$('progress').value=good+bad;
 $('score').textContent=`Bon : ${good} · Faux : ${bad}`;
 if(position>=deck.length){stage='finished';saveTime();since=null;$('questionArea').hidden=true;$('summary').hidden=false;$('position').textContent=`${deck.length} fiche${deck.length>1?'s':''}`;$('summaryText').textContent=deck.length?`${good} bon, ${bad} faux. Tes réponses sont enregistrées dans Mon espace.`:'Aucune notion à retravailler dans ce chapitre.';return;}
 const card=deck[position];stage='question';$('questionArea').hidden=false;$('summary').hidden=true;$('position').textContent=`Fiche ${position+1} sur ${deck.length}`;$('kind').textContent=card.kind;$('question').textContent=card.question;
 $('answer').hidden=true;$('answer').innerHTML='';$('rating').hidden=true;$('next').hidden=true;$('verify').hidden=false;$('hint').hidden=false;$('saveMessage').textContent='';
}
function verify(){
 if(stage!=='question')return;stage='revealed';const c=deck[position];
 $('answer').innerHTML=c.answer+(c.diagram?'<div class="diagram-wrap">'+diagram(c.diagram)+'</div>':'')+`<div class="source">${c.extra?'Complément ou précision pédagogique · ':''}Source : ${c.source}</div>`;
 $('answer').hidden=false;$('verify').hidden=true;$('hint').hidden=true;$('rating').hidden=false;$('good').focus();
}
function rate(value){
 if(stage!=='revealed')return false;stage='rated';
 if(!session){session={id:crypto.randomUUID(),type:'session',chapter:chapter.id,at:Date.now(),seconds:0};saveTime();}
 put({id:session.id+'-'+position,type:'answer',session:session.id,chapter:chapter.id,card:deck[position].id,good:value,at:Date.now()});
 if(value)good++;else bad++;
 $('score').textContent=`Bon : ${good} · Faux : ${bad}`;$('progress').value=good+bad;$('rating').hidden=true;$('next').hidden=false;$('next').textContent=position===deck.length-1?'Voir mon bilan →':'Question suivante →';$('saveMessage').textContent=value?'Noté : Bon.':'Noté : Faux. Cette notion est dans « À retravailler ».';$('next').focus();return true;
}
$('verify').onclick=verify;$('good').onclick=()=>rate(true);$('bad').onclick=()=>rate(false);
$('next').onclick=()=>{if(stage!=='rated')return;position++;show();if(stage!=='finished')$('question').focus();};
$('restart').onclick=()=>{saveTime();position=0;good=0;bad=0;session=null;seconds=0;since=document.visibilityState==='visible'?performance.now():null;show();};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){saveTime();since=null;}else if(stage!=='finished')since=performance.now();});
window.addEventListener('pagehide',saveTime);setInterval(()=>{if(session&&since!==null)saveTime();},15000);
show();
if(document.modelContext?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(document.modelContext.registerTool({name:'reveal_revision_answer',description:'Afficher la solution de la fiche de révision courante, sans attribuer de score.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(input&&Object.keys(input).length)throw new Error('Aucun paramètre attendu');if(stage!=='question')throw new Error('Aucune question à révéler');verify();return {question:deck[position].question,answer:$('answer').textContent};}},{signal:lifecycle.signal})).catch(console.warn);}catch(e){console.warn(e);}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}
