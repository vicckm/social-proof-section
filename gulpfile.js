const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const compress = require('compression');

const paths = {
  styles: {
    src: './src/assets/styles/*.scss',
    dest: './dist/'
  },
  html: {
    src: './src/*.html',
    dest: './dist/'
  },
  images: {
    src: './src/assets/images/*',
    dest: './dist/images'
  }
}

function styles() {
  return src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(concat('main.min.css'))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function html() {
  return src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function img() {
  return src(paths.images.src)
    .pipe(dest(paths.images.dest));
}

function clean() {
  return del(['dist'])
}

const build = series(clean, parallel(html, styles, img));

const reload = browserSync.reload;
function server() {
  browserSync.init({
    server: {
      baseDir: './dist/',
      index: 'index.html',
      middleware: [compress()]
    }
  });

  parallel(html, styles)
  watch('*.html').on('change', reload);
  watch(paths.styles.src, styles).on('change', reload);
}

exports.styles = styles;
exports.html = html;
exports.clean = clean;
exports.build = build;
exports.server = server;

exports.default = build; 