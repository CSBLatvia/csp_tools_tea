--Loma lietotājiem ar rediģēšanas tiesībām.
DROP ROLE IF EXISTS editor;

CREATE ROLE editor
  WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

GRANT pg_signal_backend TO editor;

--Loma lietotājiem tikai ar lasīšanas tiesībām, kā arī tiesībām veidot jaunus objektus datubāzē.
DROP ROLE IF EXISTS basic_user;

CREATE ROLE basic_user
  WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

--Lietotājs ar rediģēšanas tiesībām tekstuālajai informācijai.
DROP USER IF EXISTS editor_texts;

CREATE USER editor_texts
  WITH PASSWORD 'password' LOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

--Lietotājs ar rediģēšanas tiesībām tekstuālajai informācijai un tiesībām pievienot un dzēst laukus.
DROP USER IF EXISTS admin_texts;

CREATE USER admin_texts
  WITH PASSWORD 'password' LOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

--Loma izstrādātājiem.
CREATE ROLE tea_dev
  WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

GRANT basic_user TO tea_dev;

--Lietotājs, ar ko tīmekļa aplikācija pieslēdzas PostgreSQL.
DROP USER IF EXISTS vdvv_web;

CREATE USER vdvv_web
  WITH PASSWORD 'password' LOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;

--Piešķir tiesības savienoties ar datubāzi.
GRANT CONNECT
  ON DATABASE spatial
  TO tea_dev
    ,vdvv_web;

--Piešķir lietošanas tiesības web shēmai.
GRANT USAGE
  ON SCHEMA web
  TO tea_dev
    ,vdvv_web;