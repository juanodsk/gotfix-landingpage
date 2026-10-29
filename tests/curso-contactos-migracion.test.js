import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

test('base nueva incluye contactos de cursos y se puede ejecutar dos veces', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema storage;
      create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);`);
    const sql = await readFile(new URL('../supabase/base_nueva.sql', import.meta.url), 'utf8');
    await db.exec(sql); await db.exec(sql);
    assert.equal((await db.query('select count(*)::int as total from public.curso_contactos')).rows[0].total, 0);
  } finally { await db.close(); }
});

test('contactos de cursos: SQL idempotente, datos persistentes, restricciones y acceso privado', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    const sql = await readFile(new URL('../supabase/migrations/20261029_curso_contactos.sql', import.meta.url), 'utf8');
    await db.exec(sql);
    const id = '10000000-0000-4000-8000-000000000001';
    const insertar = (experiencia = 'android') => db.query(`insert into public.curso_contactos(id,nombre,correo,pais,whatsapp,experiencia)
      values ($1,'Ana','ana@example.test','Colombia','+573101234567',$2) on conflict (id) do nothing`, [id, experiencia]);
    await db.exec('set role service_role');
    await insertar(); await insertar();
    assert.equal((await db.query('select count(*)::int as total from curso_contactos')).rows[0].total, 1);
    await db.exec('reset role');
    await db.exec(sql);
    const registro = (await db.query('select * from curso_contactos')).rows[0];
    assert.equal(registro.nombre, 'Ana'); assert.equal(registro.experiencia, 'android'); assert.ok(registro.creado_en);
    await assert.rejects(db.query("update curso_contactos set experiencia='inventada'"), { code: '23514' });
    await assert.rejects(db.query("update curso_contactos set whatsapp='123'"), { code: '23514' });
    assert.equal((await db.query("select relrowsecurity from pg_class where oid='public.curso_contactos'::regclass")).rows[0].relrowsecurity, true);
    for (const rol of ['anon', 'authenticated']) {
      await db.exec(`set role ${rol}`);
      await assert.rejects(db.query('select * from curso_contactos'), { code: '42501' });
      await assert.rejects(insertar(), { code: '42501' });
      await db.exec('reset role');
    }
  } finally { await db.close(); }
});
