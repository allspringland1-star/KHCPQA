import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const code=await readFile('src/lib/community-post-groups.ts','utf8');
const {groupCommunityPosts,filterCommunityPostGroups}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64'));
const ko={id:'ko1',slug:'notice-1',locale:'ko',title:'공지',status:'published'};
const en={...ko,id:'en1',locale:'en',title:'Notice',status:'draft'};
const orphan={...en,id:'en2',slug:'notice-2'};
const items=[en,ko,orphan];
test('one row per slug, Korean title preferred, foreign-only posts retained',()=>{
 const groups=groupCommunityPosts(items);
 assert.equal(groups.length,2); assert.deepEqual(groups[0].source,ko); assert.deepEqual(groups[0].translations,[en,ko]); assert.deepEqual(groups[1].source,orphan);
});
test('search and locale/status filters inspect the same translation',()=>{
 const groups=groupCommunityPosts(items);
 assert.equal(filterCommunityPostGroups(groups,'Notice','en','draft').length,2);
 assert.equal(filterCommunityPostGroups(groups,'','en','published').length,0);
 assert.equal(filterCommunityPostGroups(groups,'','zh-CN','').length,0);
});
test('missing slugs do not accidentally merge unrelated posts',()=>{
 assert.equal(groupCommunityPosts([{...ko,slug:undefined},{...en,slug:undefined}]).length,2);
});
