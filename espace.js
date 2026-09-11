import { chapters } from './chapitres.js';
import { subscribe,results,profile,put,getStatus } from './suivi.js';
const root=new URL('./',import.meta.url), all=Object.values(chapters).flatMap(c=>c.cards), cards=new Map(all.map(c=>[c.id,c]));
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.body.insertAdjacentHTML('beforeend',`<dialog class="space-dialog" id="spaceDialog" aria-labelledby="spaceTitle"><div class="space-panel"><div class="space-head"><h2 id="spaceTitle">🌟 Mon espace</h2><button class="space-close" id="closeSpace" aria-label="Fermer">×</button></div><section class="space-card"><div class="profile-avatar-wrap"><img class="profile-avatar" id="avatar" alt="Photo de profil" hidden><div class="profile-avatar-placeholder" id="avatarFallback">L</div><h3 id="name">Lucie</h3></div><form id="nameForm" class="profile-edit"><input id="nameInput" aria-label="Prénom ou pseudo" maxlength="30" required><button class="btn" type="submit">Renommer</button></form><div class="avatar-actions"><button class="avatar-label" id="chooseAvatar" type="button">Choisir une photo</button><input id="avatarFile" type="file" accept="image/*" hidden><button id="removeAvatar" hidden>Retirer la photo</button></div></section><div class="space-stats"><div class="space-stat"><strong id="totalGood">0</strong><span>BON</span></div><div class="space-stat"><strong id="totalBad">0</strong><span>FAUX</span></div><div class="space-stat"><strong id="totalRate">—</strong><span>RÉUSSITE</span></div><div class="space-stat"><strong id="totalSessions">0</strong><span>SÉANCES</span></div></div><p class="muted" id="totalTime"></p><section class="space-card"><h3>Mes résultats par chapitre</h3><div id="chapterResults"></div></section><section class="space-card"><h3>Mes dernières réponses</h3><div id="recent"></div></section><section class="space-card"><div class="review-head"><h3>À retravailler</h3><button class="btn" id="clearErrors">Supprimer</button></div><p class="space-mini">Une réponse « Bon » retire la notion de cette liste. « Supprimer » vide la liste en conservant tes scores.</p><div id="errors"></div></section><p class="status" id="spaceStatus" role="status"></p><p class="space-mini">Le suivi est lié à ce navigateur. Un autre appareil possède son propre profil ; saisir le même prénom ne les associe pas.</p></div></dialog>`);
const dialog=$('spaceDialog');
$('openSpaceBtn')?.addEventListener('click',()=>dialog.showModal());
$('closeSpace').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog&&e.clientX<dialog.getBoundingClientRect().left)dialog.close();});
function render(){
 const p=profile(),{answers,errors,sessions}=results(), good=answers.filter(a=>a.good).length;
 $('name').textContent=p.name;$('nameInput').placeholder=p.name;
 $('avatar').hidden=!p.avatar;$('avatarFallback').hidden=!!p.avatar;$('removeAvatar').hidden=!p.avatar;
 if(p.avatar)$('avatar').src=p.avatar;else $('avatar').removeAttribute('src');
 $('totalGood').textContent=good;$('totalBad').textContent=answers.length-good;
 $('totalRate').textContent=answers.length?Math.round(100*good/answers.length)+' %':'—';$('totalSessions').textContent=sessions.length;
 $('totalTime').textContent='Temps de révision : '+Math.round(sessions.reduce((s,e)=>s+(e.seconds||0),0)/60)+' min';
 $('chapterResults').innerHTML=Object.values(chapters).map(ch=>{const a=answers.filter(a=>a.chapter===ch.id);return `<div class="space-row"><b>${ch.id}</b><span>${a.filter(a=>a.good).length} bon · ${a.filter(a=>!a.good).length} faux</span></div>`;}).join('');
 $('recent').innerHTML=answers.slice(-6).reverse().map(a=>`<div class="space-row"><div>${esc(cards.get(a.card)?.question||a.card)}<div class="space-mini">${a.chapter} · ${new Date(a.at).toLocaleDateString('fr-FR')}</div></div><b>${a.good?'Bon':'Faux'}</b></div>`).join('')||'<p class="muted">Tes réponses apparaîtront ici.</p>';
 $('errors').innerHTML=[...errors].map(([id,n])=>{const c=cards.get(id);if(!c)return '';const ch=id.split('-')[0];return `<div class="error-row"><a href="${new URL('Physique_Chimie/'+ch+'.html?review=1&card='+encodeURIComponent(id),root)}">${esc(c.question)} <span class="space-mini">(${n} faux)</span></a><button class="btn" data-remove="${id}" aria-label="Supprimer : ${esc(c.question)}">Supprimer</button></div>`;}).join('')||'<p class="muted">Aucune notion à retravailler pour le moment.</p>';
 $('clearErrors').disabled=!errors.size;
 $('spaceStatus').textContent=getStatus();if($('syncStatus'))$('syncStatus').textContent=getStatus();
}
subscribe(render);
$('clearErrors').onclick=()=>{if(confirm('Vider toutes les notions à retravailler ? Tes scores seront conservés.'))put({type:'reset',at:Date.now(),card:''});};
$('errors').onclick=e=>{const b=e.target.closest('[data-remove]');if(b)put({type:'reset',at:Date.now(),card:b.dataset.remove});};
$('nameForm').onsubmit=e=>{e.preventDefault();const name=$('nameInput').value.trim().replace(/\s+/g,' ').slice(0,30);if(name){put({...profile(),id:undefined,type:'profile',at:Date.now(),name});$('nameInput').value='';}};
$('removeAvatar').onclick=()=>put({...profile(),id:undefined,type:'profile',at:Date.now(),avatar:''});
$('chooseAvatar').onclick=()=>$('avatarFile').click();
$('avatarFile').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{
  if(file.size>12*1024*1024)throw new Error('Choisis une photo de moins de 12 Mo.');
  const url=URL.createObjectURL(file),img=new Image();
  try{img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=180;canvas.height=180;const size=Math.min(img.width,img.height);canvas.getContext('2d').drawImage(img,(img.width-size)/2,(img.height-size)/2,size,size,0,0,180,180);put({...profile(),id:undefined,type:'profile',at:Date.now(),avatar:canvas.toDataURL('image/jpeg',.75)});}finally{URL.revokeObjectURL(url);}
 }catch(err){alert(err.message||'Cette image ne peut pas être lue. Essaie un fichier JPEG ou PNG.');}finally{e.target.value='';}
};
