var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var concat = require('gulp-concat');
var path = require('path');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var runSequence = require('gulp-sequence');
var deploy = require('gulp-gh-pages');


var indexFile = path.join('app', 'index.html');
var distDir = 'dist';
var srcFiles = path.join('app', 'js', '**', '*.js');
var deployFiles = path.join('dist', '**', '*');

gulp.task('default', function(callback){
    runSequence('test', 'dist', callback);
});

gulp.task('test', ['jscs', 'jshint']);

gulp.task('jshint', function(){
    return gulp.src(srcFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function(){
    return gulp.src(srcFiles)
        .pipe(jscs());
});

gulp.task('dist', ['index', 'images', 'css', 'js']);

gulp.task('index', function(){
    return gulp.src(indexFile)
        .pipe(gulp.dest(distDir));
});

gulp.task('images', function(){
    return gulp.src('./app/images/**/*.svg')
        .pipe(gulp.dest(path.join(distDir, 'images')));
});

gulp.task('css', function(){
    return gulp.src('./app/styles/**/*.less')
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(distDir))
});

gulp.task('js', function(callback){
    runSequence('webpack', 'uglify', callback);
});

gulp.task('uglify', function(){
    return gulp.src('./dist/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(distDir));
});

function createWebpackResultFn(callback) {
    return function(err, stats) {
        if (err || (stats.hasErrors)) {
            var errorMsg = err || stats.compilation.errors.join('\n');
            callback(errorMsg);
        } else {
            callback();
        }
    };
}

gulp.task('webpack', function(callback) {
    webpack({
        entry: {
            'app': './app/js/app.js',
            vendor: ['jquery']
        },
        output: {
            path: distDir,
            filename: '[name].bundle.js'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
        ]
    }, createWebpackResultFn(callback));
});

gulp.task('deploy', function(){
    gulp.src(deployFiles)
        .pipe(deploy());
});
