"use strict";

const gulp = require("gulp");
const cleanCss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

gulp.task("sync", done => {
    browserSync.init({server:"./"});
    return done();
});

gulp.task("img", done => {
    gulp.src("./src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dest/imgs"));
    return done();
});

gulp.task("styles", done =>{
    gulp.src("./src/**/*.css")
    .pipe(cleanCss())
    .pipe(autoprefixer({
        browsers:["last 2 versions"]
    }))
    .pipe(gulp.dest("./dest/css"))
    .pipe(browserSync.stream());
   return done();
});
gulp.task("html", done => {
    gulp.src("./src/**/*.html")
    .pipe(gulp.dest("./dest"))
    .pipe(browserSync.stream());
    return done();
})
gulp.task("js", done => {
    gulp.src(["./src/**/resources.js","./src/**/engine.js", "./src/**/app.js"])
    .pipe(babel({
        presets:["@babel/env"]
    }))
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./dest/js"))
    .pipe(uglify())
    .pipe(browserSync.stream());
    return done();
});

gulp.task("watch", done => {
    gulp.watch("./src/**/*.scss", gulp.series(gulp.parallel("styles")));
    gulp.watch("./src/**/*.js", gulp.series(gulp.parallel("js")));
    gulp.watch("./src/**/*.html", gulp.series(gulp.parallel("html")));
    return done();
})

gulp.task("all", gulp.series(gulp.parallel("watch","styles","js","img","html")), done => {
    return done();
})
gulp.task("default", gulp.series("all"),done => {
    gulp.series("all");
    return done();
})