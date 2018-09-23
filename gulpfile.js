const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');

const DEBUG = process.env.NODE_ENV === 'debug',
    CI = process.env.CI === 'true';

var mocha = require('gulp-spawn-mocha');
var gutil = require('gulp-util');

var spawn = require('child_process').spawn,
    node;

let config = {
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "outDir": "out",
        "lib": [ "es5","es2015" ],
        "sourceMap": true,
        "rootDir": ".",
        "allowJs": true,
        "typeRoots": ["src/typings"],
        "types": [ "node" ]
    }
}

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
// clean the contents of the distribution directory
gulp.task('clean', function() {
    return del('dist/**/*');
});

// clean the contents of the distribution directory
gulp.task('clean_src', function() {
    return del('src/**/*.js');
});

gulp.task('compile-tests-data', function() {
    gulp.src('./test/data/*.ts', { base: '.' })
        .pipe(typescript(config.compilerOptions))
        .pipe(gulp.dest('.'))
})

//Mocha tests
gulp.task('tests', function() {
    gulp
        .src('src/**/*.ts')
        .pipe(typescript(config.compilerOptions))
        .pipe(gulp.dest('dist/')).on('end', function() {

        del('./test/*.js');

        gulp.src('./test/*.ts')
            .pipe(typescript(config.compilerOptions))
            .pipe(gulp.dest('./test/'))
            .pipe(mocha({
                debugBrk: DEBUG,
                exit: true,
                env: { 'NODE_ENV': 'test' },
                reporter: 'spec'
        })).on('error', handleError).on('end', function() {
            // у нас все закончилось успешно
        }) 
    });
});

// TypeScript compile
gulp.task('compile', function() {
    return gulp
        .src('src/**/*.ts')
        .pipe(typescript(config.compilerOptions))
        .pipe(gulp.dest('src/'));
});

// ADD for fix Mocha path
gulp.task('dist', ['clean', 'clean_src'], function() {
    return gulp
        .src('src/**/*.ts')
        .pipe(typescript(config.compilerOptions))
        .pipe(gulp.dest('dist/'));
});

gulp.task('test', ['compile-tests-data', 'tests']);
gulp.task('build', ['compile']);
gulp.task('default', ['build']);
//gulp.task('compile', ['handlebars']);