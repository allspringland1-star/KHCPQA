import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function compile(source, dependencies = {}) {
  const module = { exports: {} };
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('module', 'exports', ...Object.keys(dependencies), js)(module, module.exports, ...Object.values(dependencies));
  return module.exports;
}
const model = compile(readFileSync('src/lib/course-model.ts', 'utf8'));
const translation = compile(readFileSync('src/lib/translation-model.ts', 'utf8'));
const actions = readFileSync('src/app/admin/actions.ts', 'utf8');
const actionSource = 'export async function saveAdminCourseLocalization' + actions.split('export async function saveAdminCourseLocalization')[1].split('export async function archiveAdminCourse')[0];
const version = '2026-10-14T00:00:00Z';
function declaration(file, name, kind = ts.ScriptKind.TS) {
  const source = readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  let found;
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node.getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.ok(found, name);
  return found;
}
const { validatePreparedCourseSave } = compile(declaration('src/lib/course-translation-repairs.ts', 'validatePreparedCourseSave'));

async function save({ locale = 'en', status = 'published', existingStatus = 'published', role = 'super_admin', confirmation = version, stale = false, prepared = false, writeError = null } = {}) {
  let stored = null;
  const supabase = { from(table) {
    let fields;
    const query = {
      select(value) { fields = value; return query; }, eq() { return query; },
      async maybeSingle() { return { data: table === 'courses' ? { slug: 'weekend' } : fields === 'updated_at' ? { updated_at: version } : { status: existingStatus, translated_from_updated_at: stale ? '2026-01-01T00:00:00Z' : version } }; },
      async upsert(payload) { if (!writeError) stored = payload; return { error: writeError }; }
    };
    return query;
  } };
  const { saveAdminCourseLocalization } = compile(actionSource, {
    ...model, ...translation,
    hasSupabaseBrowserEnv: () => true,
    getActiveAdminRole: async () => ({ userId: 'reviewer', role, status: 'active', supabase }),
    canManageCourses: () => true,
    validatePreparedCourseSave,
    revalidateCourseCatalog: () => {}
  });
  const result = await saveAdminCourseLocalization({
    courseId: 'weekend', locale, status, title: 'Weekend', summary: 'Summary', overview: 'Overview',
    scheduleTracks: [{ id: 'track-1', label: 'Weekend', duration: '', times: [], items: [{ period: '', label: 'Sunday', title: '', items: ['10:00'] }] }],
    contentSections: [], certificationNote: '', curriculumText: '', duration: '', imageUrl: '', pdfFileName: '', pdfUrl: '', recommendedText: '',
    reviewedSourceUpdatedAt: confirmation, expectedSourceUpdatedAt: prepared ? version : undefined
  });
  return { result, stored };
}

for (const locale of ['en', 'es', 'zh-CN']) {
  test(`${locale}: reviewed edits to an already published course persist deletion without unpublishing`, async () => {
    const { result, stored } = await save({ locale, stale: true });
    assert.equal(result.ok, true, result.message);
    assert.equal(stored.status, 'published');
    assert.deepEqual(stored.schedule_tracks[0].items.map(item => item.label), ['Sunday']);
    assert.equal(stored.translated_from_updated_at, version);
  });
}
test('published foreign edits require explicit review of the current Korean source', async () => {
  for (const confirmation of [undefined, '', '2026-01-01T00:00:00Z']) {
    const { result, stored } = await save({ confirmation: confirmation ?? '' });
    assert.equal(result.ok, false);
    assert.equal(stored, null);
  }
});
test('review confirmation does not grant publishing rights or bypass first publication and prepared-draft review', async () => {
  for (const options of [{ role: 'course_manager' }, { existingStatus: 'draft' }, { existingStatus: 'translated' }, { prepared: true }]) {
    const { result, stored } = await save(options);
    assert.equal(result.ok, false);
    assert.equal(stored, null);
  }
});
test('Korean edits and current reviewed translations retain their publishing path', async () => {
  for (const options of [{ locale: 'ko', confirmation: '' }, { existingStatus: 'reviewed', confirmation: '' }]) {
    assert.equal((await save(options)).result.ok, true);
  }
});
test('database write failure is not reported as a successful save', async () => {
  const { result, stored } = await save({ writeError: { message: 'Connection lost' } });
  assert.equal(result.ok, false);
  assert.equal(stored, null);
});

test('server refresh after a failed save preserves edited content and feedback; switching locale hydrates its own content', () => {
  const source = readFileSync('src/components/AdminCoursesManager.tsx', 'utf8');
  const ast = ts.createSourceFile('editor.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let callback;
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === 'useEffect' && node.arguments[0]?.getText(ast).includes('setEditor(toEditor(activeLocalization))')) callback = node.arguments[0].getText(ast);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.ok(callback);
  let editor = { scheduleTracks: ['Sunday'] }, feedback = { ok: false, message: 'Retry' };
  const retainedEditorKey = { current: 'weekend:en' };
  const dependencies = {
    retainedEditorKey, preparedRequest: { current: 0 }, activeCourse: { id: 'weekend' }, activeLocale: 'en',
    activeLocalization: { scheduleTracks: ['Saturday', 'Sunday'] },
    setEditor: value => { editor = value; }, setResult: value => { feedback = value; }, toEditor: value => value,
    setPreparedSourceUpdatedAt() {}, setReviewedSourceUpdatedAt() {}, setCommonCategory() {}, setCommonSortOrder() {}, setCommonTemplate() {},
    setSelectedImageName() {}, setSelectedImagePreview() {}, setSelectedPdfName() {}, setSectionImagePreviews() {},
    sectionImagePreviewsRef: { current: {} }, sectionImageInputRefs: { current: {} }, imageInputRef: { current: null }, pdfInputRef: { current: null }
  };
  function refresh() { new Function(...Object.keys(dependencies), `return (${callback})();`)(...Object.values(dependencies)); }
  refresh();
  assert.deepEqual(editor.scheduleTracks, ['Sunday']);
  assert.equal(feedback.message, 'Retry');
  dependencies.activeLocale = 'es';
  dependencies.activeLocalization = { scheduleTracks: ['Sábado', 'Domingo'] };
  refresh();
  assert.deepEqual(editor.scheduleTracks, ['Sábado', 'Domingo']);
  assert.equal(feedback, null);
});

for (const fails of [false, true]) {
  test(fails ? 'unexpected save exception releases the busy state and retains the working copy' : 'successful prepared review clears its guard so the next save can publish', async () => {
    let pending, prepared = version, result, busy = false, resets = 0;
    const retainedEditorKey = { current: null }, saveInFlight = { current: false };
    const editor = { status: 'reviewed', imageUrl: '', pdfUrl: '', pdfFileName: '', contentSections: [], scheduleTracks: ['Sunday'] };
    const dependencies = {
      activeCourse: { id: 'weekend' }, activeLocale: 'en', editor, preparedSourceUpdatedAt: version, reviewedSourceUpdatedAt: undefined,
      koreanSourceUpdatedAt: version, needsPublishedReview: false, retainedEditorKey, saveInFlight,
      FormData: class { get() { return null; } }, File: class {}, commonCategory: 'professional', commonSortOrder: 0, commonTemplate: 'hobby',
      setIsSaving: value => { busy = value; }, startTransition: fn => { pending = fn(); }, getCourseTitle: () => 'Weekend',
      saveAdminCourse: async () => ({ ok: true }),
      saveAdminCourseLocalization: async () => { if (fails) throw Error('offline'); return { ok: true }; },
      setResult: value => { result = value; }, setPreparedSourceUpdatedAt: value => { prepared = value; }, setReviewedSourceUpdatedAt() {},
      setEditor: fn => Object.assign(editor, fn(editor)), resetFileInputs: () => { resets++; }, router: { refresh() {} }
    };
    const fnSource = declaration('src/components/AdminCoursesManager.tsx', 'handleLocalizationSave', ts.ScriptKind.TSX);
    const { handleLocalizationSave } = compile(`export ${fnSource}`, dependencies);
    handleLocalizationSave({ preventDefault() {}, currentTarget: {} });
    await pending;
    assert.equal(busy, false);
    assert.equal(saveInFlight.current, false);
    assert.equal(retainedEditorKey.current, 'weekend:en');
    assert.deepEqual(editor.scheduleTracks, ['Sunday']);
    assert.equal(result.ok, !fails);
    assert.equal(resets, fails ? 0 : 1);
    assert.equal(prepared, fails ? version : undefined);
  });
}
