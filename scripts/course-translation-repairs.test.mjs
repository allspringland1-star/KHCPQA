import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
function load(file) {
  file=path.resolve(file);
  if(file.endsWith('.json'))return JSON.parse(readFileSync(file,'utf8'));
  const module={exports:{}};
  const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText;
  new Function('require','module','exports',js)(name=>load(path.resolve(path.dirname(file),name.endsWith('.json')?name:`${name}.ts`)),module,module.exports);
  return module.exports;
}
test('translation preserves structural values and rejects unmapped source text',()=>{
 const {translateCourseContent}=load('src/lib/course-translation-repairs.ts');
 const source={title:'교육',schedule_tracks:[{id:'원본-id',times:['10시~13시'],items:[{items:['교육','교육']}]}],content_sections:[{type:'practice',images:[{url:'/한글.jpg',alt:'교육'}]}]};
 const result=translateCourseContent(source,{'교육':'Training','10시~13시':'10:00–13:00'});
 assert.equal(result.schedule_tracks[0].id,'원본-id');
 assert.deepEqual(result.schedule_tracks[0].items[0].items,['Training','Training']);
 assert.equal(result.content_sections[0].images[0].url,'/한글.jpg');
 assert.equal(result.content_sections[0].images[0].alt,'Training');
 assert.throws(()=>translateCourseContent({title:'누락'},{}),/Missing translation/);
});
test('prepared repair refuses stale source and unsupported locale; never self-reviews',()=>{
 const {buildPreparedCourseTranslation,courseTranslationSources}=load('src/lib/course-translation-repairs.ts');
 const row=courseTranslationSources[0];
 const live={...row.content,updated_at:row.updated_at};
 assert.throws(()=>buildPreparedCourseTranslation(row.slug,'ko',live),/Unsupported/);
 assert.throws(()=>buildPreparedCourseTranslation(row.slug,'en',{...live,updated_at:'changed'}),/changed/);
 assert.throws(()=>buildPreparedCourseTranslation(row.slug,'en',{...live,title:'changed'}),/changed/);
});

test('all 54 drafts preserve every source item, identifier, image and array position',()=>{
 const {buildPreparedCourseTranslation,courseTranslationSources,courseTranslationDictionaries}=load('src/lib/course-translation-repairs.ts');
 assert.equal(courseTranslationSources.length,18);
 const opaque=new Set(['id','type','url','image_url','pdf_url']);
 function compare(source,target,key='') {
   if(opaque.has(key)||source===null||typeof source!=='object'&&typeof source!=='string') return assert.deepEqual(target,source,key);
   if(typeof source==='string') {
     if(!/[가-힣]/.test(source))assert.equal(target,source);
     else {assert.ok(target?.trim(),key);assert.doesNotMatch(target,/[가-힣]|上课时段\s*\d/);}
   } else if(Array.isArray(source)) {
     assert.equal(target.length,source.length,key);source.forEach((value,index)=>compare(value,target[index],key));
   } else {assert.deepEqual(Object.keys(target),Object.keys(source));Object.keys(source).forEach(k=>compare(source[k],target[k],k));}
 }
 for(const locale of ['en','es','zh-CN']) {
   assert.equal(Object.keys(courseTranslationDictionaries[locale]).length,428);
   let steps=0,images=0;
   for(const source of courseTranslationSources) {
     const draft=buildPreparedCourseTranslation(source.slug,locale,{...source.content,updated_at:source.updated_at});
     assert.equal(draft.status,'draft');assert.equal(draft.reviewed_by,undefined);assert.equal(draft.reviewed_at,undefined);
     compare(source.content,draft.content);
     steps+=draft.content.schedule_tracks.reduce((count,track)=>count+track.items.length,0);
     images+=draft.content.content_sections.reduce((count,section)=>count+section.images.length,0);
   }
   assert.equal(steps,192);assert.equal(images,5);
 }
});

test('repair loader authenticates without database writes; legacy bulk publisher is retired',()=>{
 const actions=readFileSync('src/app/admin/actions.ts','utf8');
 const loader=actions.split('export async function loadPreparedCourseTranslation')[1].split('export async function saveAdminCourseLocalization')[0];
 assert.match(loader,/getActiveAdminRole/);assert.match(loader,/canManageCourses/);
 assert.doesNotMatch(loader,/\.(?:insert|update|upsert|delete)\(/);
 assert.match(actions,/validatePreparedCourseSave\(input.expectedSourceUpdatedAt, sourceUpdatedAt, payload.status\)/);
 const legacy=readFileSync('scripts/import-course-zh-cn.ts','utf8');
 assert.match(legacy,/throw new Error/);assert.doesNotMatch(legacy,/\.from\(|reviewed_by:/);
});

test('loaded repair requires explicit review save before any publication or persistence',()=>{
 const {validatePreparedCourseSave}=load('src/lib/course-translation-repairs.ts');
 assert.equal(validatePreparedCourseSave('v1','v1','reviewed'),null);
 assert.match(validatePreparedCourseSave('v1','v2','reviewed'),/원문/);
 for(const status of ['draft','translated','published','archived']) assert.match(validatePreparedCourseSave('v1','v1',status),/검수완료/);
 assert.equal(validatePreparedCourseSave(undefined,'v1','draft'),null);
});
