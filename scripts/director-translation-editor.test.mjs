import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const code=await readFile('src/lib/admin-content-locales.ts','utf8');
const {resolveTranslationEditor}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const source=Object.freeze({id:'ko-id',slug:'director-1',locale:'ko',status:'published',title:'김성권'});
test('missing English shortcut creates English draft without source identity',()=>{
 const target=resolveTranslationEditor(source,'en',[source]);
 assert.equal(target.isNew,true);assert.equal(target.item.locale,'en');assert.equal(target.item.id,undefined);assert.equal(target.item.status,'draft');
 target.item.title='Kim Seong-gwon';
 assert.equal(source.title,'김성권');assert.equal(source.locale,'ko');assert.equal(source.status,'published');
});
test('existing English shortcut selects only English row',()=>{
 const english={...source,id:'en-id',locale:'en',title:'Kim Seong-gwon',status:'reviewed'};
 const target=resolveTranslationEditor(source,'en',[source,english]);
 assert.equal(target.isNew,false);assert.equal(target.item.id,'en-id');assert.equal(target.item.locale,'en');
});
test('other translation shortcuts also keep distinct identities',()=>{
 for(const locale of ['es','zh-CN']) {const target=resolveTranslationEditor(source,locale,[source]);assert.equal(target.item.locale,locale);assert.equal(target.item.id,undefined);}
 assert.equal(resolveTranslationEditor(source,'ko',[source]),null);
 assert.equal(resolveTranslationEditor(source,'invalid',[source]),null);
});
