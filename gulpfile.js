"use strict";
// process.env.DISABLE_NOTIFIER = true;

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    order = require("gulp-order"),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer');

gulp.task('html',function(){
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', ['sprite'] ,function(){
    return gulp.src('./src/img/*.*')
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts',function(){
    return gulp.src('./src/fonts/**/*.{eot,svg,otf,ttf,woff,woff2}')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('./src/img/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        imgPath: '../img/sprite.png',
        cssTemplate: 'sprite-template.handlebars'
    }));
    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
    var cssStream = spriteData.css
        .pipe(gulp.dest('./dist/css'));
    return merge(imgStream, cssStream);
});

gulp.task('sass', function () {
    gulp.src('src/scss/**/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(autoprefixer({
        browsers: ['last 7 versions'],
        cascade: false
      }))

      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest('dist/css/'))
      .pipe(connect.reload())
      .pipe(notify('Done css!'));
});

gulp.task('js', function () {
    gulp.src('src/js/*.js')
      .pipe(plumber())
      .pipe(concat('all.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js/'))
      .pipe(connect.reload())
      .pipe(notify('Done js!'));
});

gulp.task('connect', function () {
  connect.server({
    root: 'dist/',
    port: 8000,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['src/scss/**/*.scss'], ['sass']);
  gulp.watch(['src/js/*.js'], ['js']);
});

gulp.task('build', ['connect', 'html', 'images', 'fonts', 'sass', 'js', 'watch']);
