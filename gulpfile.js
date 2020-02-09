const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tsProject = typescript.createProject('tsconfig.json');

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
        "lib": [ "es5","es2015", "es6",
        "dom"],
        "sourceMap": true,
        "rootDir": ".",
        "allowJs": true,
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
    return tsProject.src()
        .pipe(typescript(config.compilerOptions))
        .pipe(gulp.dest('.'))
})

//Mocha tests
gulp.task('tests', function() {
    return tsProject
        .src()
        .pipe(typescript(config.compilerOptions))
        .pipe(gulp.dest('dist')).on('end', function() {

        del('./test/*.js');

        tsProject.src()
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
    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
});

// ADD for fix Mocha path
gulp.task('dist', gulp.series('clean', 'clean_src'), function() {
    return tsProject.src().pipe(typescript(config.compilerOptions)).pipe(gulp.dest('dist'));
});

gulp.task('test', gulp.series('compile-tests-data', 'tests'));
gulp.task('build', gulp.series('compile'));
gulp.task('default', gulp.series('build'));
//gulp.task('compile', ['handlebars']);