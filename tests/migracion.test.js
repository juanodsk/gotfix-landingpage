import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

test('PostgreSQL: migración de registros existentes, enum, historial atómico y permisos', async () => {
  const db = new PGlite();
  const schema = await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
  const migracion = await readFile(new URL('../supabase/migrations/20261010_admin_pqrs.sql', import.meta.url), 'utf8');
  const id = '10000000-0000-4000-8000-000000000001';
  try {
    // Infraestructura que Supabase proporciona fuera de nuestro schema.sql.
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema storage;
      create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);`);
    await db.exec(schema);
    await db.query(`insert into public.pqrs(id,radicado,nombre,documento,correo,whatsapp,descripcion,estado,creado_en)
      values ($1,'PQRS-2026-0001','Ana','123','ana@test.co','3001234567','Garantía del equipo','en_tramite','2026-10-01T10:00:00Z')`, [id]);
    await db.exec(migracion);
    await db.exec(migracion); // Idempotencia: no duplica historial ni altera registros.
    await db.exec(schema); // El esquema anterior también se puede volver a ejecutar.
    const columnas = await db.query(`select udt_name from information_schema.columns where table_name='pqrs' and column_name='estado'`);
    assert.equal(columnas.rows[0].udt_name, 'estado_pqr');
    const previa = (await db.query('select estado,actualizado_en=creado_en as conservado from pqrs where id=$1', [id])).rows[0];
    assert.deepEqual(previa, { estado: 'en_tramite', conservado: true });
    await assert.rejects(db.query('update pqrs set estado=$1 where id=$2', ['inventado', id]), { code: '22P02' });
    const cambiar = (actual, nuevo, nota = '') => db.query(`select public.actualizar_estado_pqrs($1,$2,$3,$4,$5,$6)`, [id, nuevo, actual, nota, id, 'admin@gotfix.test']);
    await cambiar('en_tramite', 'respondido', 'Se contactó al cliente');
    assert.equal((await db.query('select estado from pqrs where id=$1', [id])).rows[0].estado, 'respondido');
    let historial = (await db.query('select estado_anterior,estado_nuevo,nota from pqrs_seguimiento')).rows;
    assert.deepEqual(historial, [{ estado_anterior: 'en_tramite', estado_nuevo: 'respondido', nota: 'Se contactó al cliente' }]);
    await assert.rejects(cambiar('en_tramite', 'cerrado', 'Estado desactualizado'), { code: '40001' });
    await assert.rejects(cambiar('respondido', 'cerrado', 'a'.repeat(2001)), { code: '23514' });
    assert.equal((await db.query('select estado from pqrs where id=$1', [id])).rows[0].estado, 'respondido');
    assert.equal((await db.query('select count(*)::int as total from pqrs_seguimiento')).rows[0].total, 1);
    await cambiar('respondido', 'respondido', 'Cliente confirma la recepción');
    await cambiar('respondido', 'cerrado');
    historial = (await db.query('select * from pqrs_seguimiento')).rows;
    assert.equal(historial.length, 3);
    await assert.rejects(cambiar('cerrado', 'cerrado', '  '), { code: '22023' });
    await assert.rejects(db.query(`select actualizar_estado_pqrs('20000000-0000-4000-8000-000000000002','cerrado','radicado','','${id}','admin@test.co')`), { code: 'P0002' });
    for (const rol of ['anon', 'authenticated']) {
      await db.exec(`set role ${rol}`);
      await assert.rejects(db.query('select * from pqrs'), { code: '42501' });
      await assert.rejects(db.query('select * from aceptaciones_terminos'), { code: '42501' });
      await assert.rejects(db.query('select * from pqrs_seguimiento'), { code: '42501' });
      await assert.rejects(cambiar('cerrado', 'radicado'), { code: '42501' });
      await db.exec('reset role');
    }
    await db.exec('set role service_role');
    await cambiar('cerrado', 'en_tramite', 'Reabrir para una revisión adicional');
    assert.equal((await db.query('select count(*)::int as total from pqrs_seguimiento')).rows[0].total, 4);
    await db.exec('reset role');
    assert.equal((await db.query('select estado from pqrs where id=$1', [id])).rows[0].estado, 'en_tramite');
  } finally { await db.close(); }
});
