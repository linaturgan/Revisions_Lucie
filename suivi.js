import { firebaseConfig } from './firebase-config.js';
const key = 'revisionsLucie.v1';
const empty = () => ({events:{},pending:{}});
let data; try { data = JSON.parse(localStorage.getItem(key)) || empty(); } catch { data = empty(); }
if(!data.events || !data.pending) data=empty();
let status = firebaseConfig ? 'Connexion à ton suivi…' : 'Résultats enregistrés sur cet appareil. La synchronisation sera disponible après la configuration de Firebase.';
let cloud=null, flushing=false, listeners=new Set();
const notify=()=>listeners.forEach(fn=>fn());
function persist(){try{localStorage.setItem(key,JSON.stringify(data));return true;}catch{status='Sauvegarde locale impossible : garde cette page ouverte. Autorise le stockage du navigateur pour conserver tes résultats.';notify();return false;}}
export const subscribe=fn=>{listeners.add(fn);fn();return ()=>listeners.delete(fn);};
export const getStatus=()=>status;
export const getEvents=()=>Object.values(data.events).sort((a,b)=>a.at-b.at || a.id.localeCompare(b.id));
export function put(value){
 const item={...value,id:value.id||crypto.randomUUID(),updated:Date.now()};
 // Merge changes from other tabs before writing the local journal.
 try{const other=JSON.parse(localStorage.getItem(key));if(other)merge(other);}catch{}
 if(!data.events[item.id])item.at=Object.values(data.events).reduce((last,e)=>Math.max(last,e.at+1),item.at||Date.now());
 data.events[item.id]=item;data.pending[item.id]=true;persist();notify();void flush();return item;
}
function merge(other){for(const [id,e] of Object.entries(other.events||{}))if(!data.events[id]||e.updated>data.events[id].updated)data.events[id]=e;Object.assign(data.pending,other.pending||{});}
window.addEventListener('storage',e=>{if(e.key===key&&e.newValue){try{merge(JSON.parse(e.newValue));notify();void flush();}catch{}}});
export function profile(){return getEvents().filter(e=>e.type==='profile').at(-1)||{name:'Lucie',avatar:''};}
export function results(){
 const list=getEvents(), answers=list.filter(e=>e.type==='answer'), errors=new Map();
 for(const e of list){
  if(e.type==='reset'){if(e.card)errors.delete(e.card);else errors.clear();}
  if(e.type==='answer'){if(e.good)errors.delete(e.card);else errors.set(e.card,(errors.get(e.card)||0)+1);}
 }
 return {answers,errors,sessions:list.filter(e=>e.type==='session')};
}
async function flush(){
 if(!cloud||flushing)return;flushing=true;
 try{
  while(Object.keys(data.pending).length){
   const ids=Object.keys(data.pending).slice(0,100), batch=cloud.api.writeBatch(cloud.db), sent={};
   for(const id of ids){sent[id]=data.events[id].updated;batch.set(cloud.api.doc(cloud.db,'users',cloud.uid,'events',id),data.events[id]);}
   await batch.commit();
   for(const id of ids)if(data.events[id]?.updated===sent[id])delete data.pending[id];
   persist();
  }
  status="Vas-y Dany est là pour t'aider et te soutenir!!!";
 }catch(err){console.warn('Synchronisation',err.code);status='Résultats conservés sur cet appareil. Synchronisation en attente : vérifie la connexion et la configuration Firebase.';}
 finally{flushing=false;notify();}
}
async function connect(){
 if(!firebaseConfig)return;
 try{
  if(firebaseConfig.projectId==='revisions-leo')throw new Error('Projet de Léo interdit pour ce site');
  const [app,auth,api]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')]);
  const instance=app.initializeApp(firebaseConfig), a=auth.getAuth(instance);
  await auth.setPersistence(a,auth.browserLocalPersistence);await a.authStateReady();
  const user=a.currentUser||(await auth.signInAnonymously(a)).user;
  cloud={uid:user.uid,db:api.getFirestore(instance),api};
  // A recreated anonymous identity receives its own copy of this device's journal.
  if(data.uid!==user.uid){data.uid=user.uid;for(const id of Object.keys(data.events))data.pending[id]=true;persist();}
  api.onSnapshot(api.collection(cloud.db,'users',user.uid,'events'),snap=>{
   for(const d of snap.docs){const e=d.data();if(!data.events[d.id]||e.updated>data.events[d.id].updated)data.events[d.id]=e;}
   persist();notify();
  },err=>{console.warn(err.code);status='Lecture du suivi impossible. Tes résultats restent sur cet appareil ; vérifie les règles Firebase.';notify();});
  await flush();
 }catch(err){console.warn('Firebase',err.code||err.message);status='Firebase n’est pas disponible. Tes résultats restent enregistrés sur cet appareil.';notify();}
}
window.addEventListener('online',()=>cloud?flush():connect());
setInterval(()=>{if(cloud&&Object.keys(data.pending).length)void flush();},30000);
void connect();
