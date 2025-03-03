#!/bin/bash

# Pārtrauc izpildi kļūdas gadījumā.
set -e

# Norāda PostgreSQL lietotāju un paroli.
user=
export PGPASSWORD=

cd $HOME
rm -rf tea
mkdir tea
cd tea
wget -q https://data.gov.lv/dati/dataset/f5c692d7-d21f-405c-9c0a-c67306ab154c/resource/2f1793bd-099f-4da4-b54d-71766d0906e0/download/data.csv
psql -U $user -d spatial -w -c "TRUNCATE TABLE tea.data RESTART IDENTITY;"
psql -U $user -d spatial -w -c "\COPY tea.data (year, level_h, code_h, level_w, code_w, brdwn, brdwn_code, value_code, value_ind) FROM data.csv WITH (FORMAT CSV, HEADER)"
cd ..
rm -r tea
