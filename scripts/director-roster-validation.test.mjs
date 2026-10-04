import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile('src/lib/director-roster.ts','utf8');
const {resolveDirectorRoster} = await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const ko=[{slug:'director-1',title:'유정원',lead:'국제 디렉터 · 몽골',imageUrl:'/current.jpg',updatedAt:'2026-10-04'}];
test('missing translations keep canonical roster and correct portrait',()=>{
 const result=resolveDirectorRoster(ko,[],'en');
 assert.equal(result.length,1); assert.equal(result[0].imageUrl,'/current.jpg'); assert.equal(result[0].name,'유정원');
});
test('translations cannot add people or replace canonical pictures',()=>{
 const translated=[{...ko[0],title:'Yoo Jeong-won',imageUrl:'/wrong.jpg',translatedFromUpdatedAt:'2026-10-04'},{slug:'director-orphan',title:'Old person'}];
 const result=resolveDirectorRoster(ko,translated,'en');
 assert.equal(result.length,1); assert.equal(result[0].name,'Yoo Jeong-won'); assert.equal(result[0].imageUrl,'/current.jpg');
});
test('hidden or deleted sources do not reappear through translations or static defaults',()=>{
 assert.deepEqual(resolveDirectorRoster([],ko,'en'),[]);
});
test('stale translation falls back to current source facts',()=>{
 const result=resolveDirectorRoster(ko,[{...ko[0],lead:'International Director · France',translatedFromUpdatedAt:'2026-09-01'}],'en');
 assert.equal(result[0].role,'국제 디렉터 · 몽골');
});
