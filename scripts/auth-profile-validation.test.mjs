import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

async function importTsModule(path) {
  const source = await readFile(path, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const encoded = Buffer.from(output).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${pathToFileURL(path).href}`);
}

const {
  resolvePostLoginPath
} = await importTsModule("src/lib/auth-redirect.ts");

test("signup collects structured profile metadata with country select", async () => {
  const source = await readFile("src/components/SignupForm.tsx", "utf8");

  assert.match(source, /name="phone"/);
  assert.match(source, /name="country"/);
  assert.match(source, /countryOptions\.map/);
  assert.ok(source.indexOf('name="country"') < source.indexOf('name="phone"'));
  assert.match(source, /phone-input-group/);
  assert.match(source, /getCountryDialCode\(form\.country\)/);
  assert.match(source, /name="interestedCourse"/);
  assert.match(source, /name="marketingOptIn"/);
  assert.match(source, /interested_course: form\.interestedCourse/);
  assert.match(source, /marketing_opt_in: form\.marketingOptIn/);
  assert.match(source, /phone: normalizePhoneNumber\(form\.phone, form\.country\)/);
});

test("profile edit persists the same structured fields", async () => {
  const source = await readFile("src/components/ProfileEditForm.tsx", "utf8");

  assert.match(source, /name="phone"/);
  assert.match(source, /name="country"/);
  assert.match(source, /countryOptions\.map/);
  assert.ok(source.indexOf('name="country"') < source.indexOf('name="phone"'));
  assert.match(source, /phone-input-group/);
  assert.match(source, /getCountryDialCode\(form\.country\)/);
  assert.match(source, /name="interestedCourse"/);
  assert.match(source, /name="marketingOptIn"/);
  assert.match(source, /interested_course: form\.interestedCourse\.trim\(\) \|\| null/);
  assert.match(source, /marketing_opt_in: form\.marketingOptIn/);
  assert.match(source, /phone: normalizePhoneNumber\(form\.phone, form\.country\)/);
});

test("profile migration stores signup metadata in public profiles", async () => {
  const migration = await readFile("supabase/migrations/202608080001_extend_profile_registration_fields.sql", "utf8");

  assert.match(migration, /add column if not exists phone text/);
  assert.match(migration, /add column if not exists interested_course text/);
  assert.match(migration, /add column if not exists marketing_opt_in boolean not null default false/);
  assert.match(migration, /new\.raw_user_meta_data ->> 'phone'/);
  assert.match(migration, /new\.raw_user_meta_data ->> 'interested_course'/);
  assert.match(migration, /new\.raw_user_meta_data ->> 'marketing_opt_in'/);
});

test("active admin profiles land on admin after login", () => {
  assert.equal(resolvePostLoginPath("ko", "/ko/account", { role: "super_admin", status: "active" }), "/admin");
  assert.equal(resolvePostLoginPath("ko", "/ko/account", { role: "certification_manager", status: "active" }), "/admin");
  assert.equal(resolvePostLoginPath("ko", "/ko/account", { role: "user", status: "active" }), "/ko/account");
  assert.equal(resolvePostLoginPath("ko", "/admin/certifications", { role: "user", status: "active" }), "/admin/certifications");
  assert.equal(resolvePostLoginPath("ko", "/ko/account", { role: "super_admin", status: "suspended" }), "/ko/account");
});
