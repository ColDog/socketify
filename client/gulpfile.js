var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var babelify = require("babelify");

var opts = {
  mainJsInput: './app/app.js',
  mainJsOutput: 'app.js',
  buildFolder: './build/',
  indexHtml: './app/index.html',
  watchedFiles: [
    './app/**/*'
  ]
};

gulp.task('index', function() {
  gulp.src(opts.indexHtml)
    .pipe(gulp.dest(opts.buildFolder));
});

gulp.task('compile', function() {
  var b = browserify('./app/app.js', {
    paths: ['./node_modules','./app/Components', './app/Core', './app/Views']
  });
  b.transform(babelify);
  b.add(opts.mainJsInput);
  return b.bundle()
    .pipe(source(opts.mainJsInput))
    .pipe(rename(opts.mainJsOutput))
    .pipe(gulp.dest(opts.buildFolder));
});

gulp.task('default', ['compile', 'index'], function() {
  gulp.watch(opts.watchedFiles, ['compile', 'index']);
});
