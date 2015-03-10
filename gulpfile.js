var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var runSequence = require('gulp-sequence');


gulp.task('default', ['index', 'images', 'css', 'js']);

gulp.task('index', function(){
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('images', function(){
    gulp.src('./app/images/**/*.svg')
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('css', function(){
    return gulp.src('./app/styles/**/*.less')
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('js', function(callback){
    runSequence('webpack', 'uglify', callback);
});

gulp.task('uglify', function(){
    gulp.src('./dist/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
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
            path: 'dist',
            filename: '[name].bundle.js'
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
        ]
    }, createWebpackResultFn(callback));
});