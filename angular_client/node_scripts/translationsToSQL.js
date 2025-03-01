'use strict';

const fs = require('fs');
const { Client } = require('pg');

let json_path = 'src/assets/config/translations.json';
const json = fs.readFileSync(json_path);
console.log('translationsToSQL - starting..');
console.log(" - dir:", process.cwd());

const translations = JSON.parse(json);

var access = JSON.parse(fs.readFileSync('C:/!dropbox/Dropbox/!csp-access/csp-db-dev/access.json', 'utf8'));
const config = {
  user: access.db_user,
  host: access.db_server,
  database: access.db_name,
  password: access.db_password,
  port: access.db_port
};

const client = new Client(config);
client.connect();


let sql = "TRUNCATE TABLE tea_dev.translations;\n INSERT INTO tea_dev.translations (variable_name, lv, en, used, html) VAlUES \n";

for(var key in translations){
  let name_lv = translations[key][0];
  let name_en = translations[key][1];
  let used = translations[key][2]||true;
  let html = translations[key][3]||false;

  name_lv = name_lv.replace(/'/g, "&apos;");
  name_en = name_en.replace(/'/g, "&apos;");

  sql+="('"+key+"','"+name_lv+"', '"+name_en+"', '"+used+"', '"+html+"'),\n";
}
sql = sql.slice(0, -2);
sql+=';';

client.query(sql)
  .then(res => {
    console.log('translationsToSQL - SUCCESS');
  })
  .catch(e => {
    console.error('translationsToSQL - ERROR');
    console.error(e.stack);
  });

