const { series, parallel, dest, src, watch } = require('gulp');
const del = require('delete');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const connect = require('gulp-connect');

// files except .js and .css
function copyOthers(cb) {
  return src(["./src/**", '!src/*.js', '!src/*.scss', '!src/*.css'])
    .pipe(dest('./build'))
}

// css
function cssClean(cb) {
  del(['./build/css/*.css'], cb);
}

function cssBuild(cb) {
  return src([ './src/reset.css', './src/*.css','./src/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(src('./'))
    .pipe(concat('style.bundle.css'))
    .pipe(dest('./build/css'));
};

// js
function jsClean(cb) {
  del(['./build/js/*.js'], cb);
}

function jsBuild(cb) {
  return src('./src/*.js')
    // .pipe(uglify())
    .pipe(dest('./build/scripts/'))
    .pipe(connect.reload());

}

// build all the stuffs
const build = series(
  parallel(
    cssClean,
    jsClean
  ),
  parallel(
    copyOthers,
    cssBuild,
    jsBuild
  ),
  htmlReload
);

// connect on and scope 'watch'
function connection() {
  connect.server({
    root: 'build',
    livereload: true,
    port: 8080

  });
  watch("./src/**", function (cb) {
    build();
    setTimeout(cb, 100)
  })
};

// reload html files
function htmlReload(cb) {
  return src('./build/*.html')
    .pipe(connect.reload());
};


exports.build = build
exports.watch = series(build, connection)
exports.default = exports.build;
