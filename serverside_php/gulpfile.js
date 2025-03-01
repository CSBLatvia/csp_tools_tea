const { series,src, dest } = require('gulp');
const replace = require('gulp-replace');
const fs = require('fs');
const clean = require('gulp-clean');


function clear(cb) {
    return src('dist', {read: false,allowEmpty: true}).pipe(clean());
}

function replaceCredentials(cb) {
    const json = JSON.parse(fs.readFileSync('C:/!dropbox/Dropbox/!csp-access/csp-tools-tea/access.json', 'utf8'));
    console.log(json);
    return src('php_service/**')
        .pipe(replace('[db_server]', json.db_server))
        .pipe(replace('[db_name]', json.db_name))
        .pipe(replace('[db_user]', json.db_user))
        .pipe(replace('[db_password]', json.db_password))
        .pipe(replace('[db_port]', json.db_port))
        .pipe(replace('[admin_user]', json.admin_user))
        .pipe(replace('[admin_password]', json.admin_password))
        .pipe(replace('[editor_user]', json.editor_user))
        .pipe(replace('[editor_password]', json.editor_password))
        .pipe(dest('dist/php/'));
}

//exports.build = build;
//exports.clear = clear;
exports.build = series(clear, replaceCredentials);