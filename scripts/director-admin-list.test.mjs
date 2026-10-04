import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const code=await readFile('src/lib/director-admin-list.ts','utf8');
const {filterDirectorGroups}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const ko={slug:'director-1',locale:'ko',title:'김성권',status:'published'};
const items=[{...ko,locale:'en',title:'Kim Seong-gwon',status:'draft'},ko,{...ko,locale:'es',title:'Kim',status:'reviewed'},{...ko,slug:'director-2',title:'유정원'}];
test('translations do not add rows to the person list',()=>assert.deepEqual(filterDirectorGroups(items,'','','').map(r=>r.title),['김성권','유정원']));
test('translated names find the canonical person',()=>assert.deepEqual(filterDirectorGroups(items,'Seong-gwon','',''),[ko]));
test('locale and status filters match the same translation',()=>{
 assert.deepEqual(filterDirectorGroups(items,'','en','draft'),[ko]);
 assert.deepEqual(filterDirectorGroups(items,'','en','reviewed'),[]);
 assert.deepEqual(filterDirectorGroups(items,'','zh-CN',''),[]);
 assert.deepEqual(filterDirectorGroups(items,'','es','reviewed'),[ko]);
});
