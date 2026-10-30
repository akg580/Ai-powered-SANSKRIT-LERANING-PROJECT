import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
const env = await initializeTestEnvironment({projectId:'demo-sanskrit-rules',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firestore.rules','utf8')}});
let passed=0;
async function check(name, operation) { await operation(); passed++; console.log('ok - '+name); }
try {
 await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore();for(const role of ['admin','editor','learner']) await setDoc(doc(db,'users',role),{uid:role,role,email:role+'@example.com'});await setDoc(doc(db,'cms_chapters','1'),{title:'Chapter'});await setDoc(doc(db,'users','learner','progress','main'),{totalXP:0});});
 const db=uid=>uid?env.authenticatedContext(uid).firestore():env.unauthenticatedContext().firestore();
 for(const who of [null,'learner','editor','admin']) {
  const d=db(who),label=who||'anonymous';
  await check(label+' CMS read',()=> (who?assertSucceeds:assertFails)(getDoc(doc(d,'cms_chapters','1'))));
  await check(label+' CMS write',()=> (['admin','editor'].includes(who)?assertSucceeds:assertFails)(setDoc(doc(d,'cms_chapters',label),{title:'Test'})));
  await check(label+' user listing',()=> (who==='admin'?assertSucceeds:assertFails)(getDocs(collection(d,'users'))));
  await check(label+' other progress',()=> (who==='learner'?assertSucceeds:assertFails)(getDoc(doc(d,'users','learner','progress','main'))));
 }
 await check('new learner signup',()=>assertSucceeds(setDoc(doc(db('new'),'users','new'),{uid:'new',role:'learner'})));
 await check('admin signup denied',()=>assertFails(setDoc(doc(db('evil'),'users','evil'),{uid:'evil',role:'admin'})));
 await check('forged identity denied',()=>assertFails(setDoc(doc(db('evil'),'users','evil'),{uid:'learner',role:'learner'})));
 await check('owner profile edit',()=>assertSucceeds(updateDoc(doc(db('learner'),'users','learner'),{displayName:'Scholar'})));
 await check('owner progress write',()=>assertSucceeds(setDoc(doc(db('learner'),'users','learner','progress','main'),{totalXP:60})));
 await check('self promotion denied',()=>assertFails(updateDoc(doc(db('learner'),'users','learner'),{role:'admin'})));
 await check('identity rewrite denied',()=>assertFails(updateDoc(doc(db('learner'),'users','learner'),{uid:'admin'})));
 await check('editor promotion denied',()=>assertFails(updateDoc(doc(db('editor'),'users','learner'),{role:'admin'})));
 await check('invalid role denied',()=>assertFails(updateDoc(doc(db('admin'),'users','learner'),{role:'owner'})));
 await check('admin role assignment',()=>assertSucceeds(updateDoc(doc(db('admin'),'users','learner'),{role:'editor'})));
 await check('admin cannot edit other profile',()=>assertFails(updateDoc(doc(db('admin'),'users','learner'),{displayName:'Rewritten'})));
 await check('editor cannot delete chapter',()=>assertFails(deleteDoc(doc(db('editor'),'cms_chapters','1'))));
 await check('admin can delete chapter',()=>assertSucceeds(deleteDoc(doc(db('admin'),'cms_chapters','1'))));
 await check('unknown path denied',()=>assertFails(setDoc(doc(db('admin'),'other','1'),{value:true})));
 console.log(`${passed} authorization checks passed`);
} finally { await env.cleanup(); }
