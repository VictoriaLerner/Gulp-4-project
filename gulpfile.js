const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
var sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
const fileinclude = require('gulp-file-include');



// Task for assembling HTML and templates
gulp.task('html', function (callback) {
    return gulp.src('./src/html/*.html')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'HTML include',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(fileinclude({prefix: '@@'}))
        .pipe(gulp.dest('./build'))
    callback();
});

// Task for compiling SCSS to CSS
gulp.task('scss', function (callback) {
    return gulp.src('./src/scss/main.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    sound: true,
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
    callback();
});

// Copy Images in to build folder
gulp.task('copy:img', function (callback) {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('./build/images/'))
    callback();
});
// Copy upload in to build folder
gulp.task('copy:upload', function (callback) {
    return gulp.src('./src/upload/**/*.*')
        .pipe(gulp.dest('./build/upload/'))
    callback();
});

// Copy js in to build folder
gulp.task('copy:js', function (callback) {
    return gulp.src('./src/js/**/*.*')
        .pipe(gulp.dest('./build/js/'))
    callback();
});



// watch HTML and CSS and refreshing the browser
gulp.task('watch', function () {
    // Слежение за HTML и CSS и обновление браузера
    watch(['./build/*.html', './build/css/**/*.css'], gulp.parallel(browserSync.reload));




   // Start  watch and compiling SCSS with a delay, for hard drives HDD

    watch('./src/scss/**/*.scss', function () {
        setTimeout(gulp.parallel('scss'), 10)
    })



// watch and copy static files and scripts
    watch('./src/html/**/*.html', gulp.parallel('html'))
    watch('./src/images/**/*.*', gulp.parallel('copy:img'))
    watch('./src/upload/**/*.*', gulp.parallel('copy:upload'))
    watch('./src/js/**/*.*', gulp.parallel('copy:js'))

});

// Task for starting the server from the src folder
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    })
});

// Default task

gulp.task(
    'default',
        gulp.series(gulp.parallel('scss', 'html' , 'copy:img' ,'copy:upload' ,'copy:js'),
        gulp.parallel('server', 'watch')));

