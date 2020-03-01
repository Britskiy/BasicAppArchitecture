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

// let config = {
//     "compilerOptions": {
//         "module": "commonjs",
//         "target": "es6",
//         "outDir": "out",
//         "lib": [ "es5","es2015", "es6",
//         "dom"],
//         "sourceMap": true,
//         "rootDir": ".",
//         "allowJs": true,
//         "typeRoots": [
//             "node_modules/@types"
//         ],
//         "types": [
//             "node",
//             "mocha"
//         ]
//     }
// }

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
    return gulp.src('test/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('./test/'))
})

//Mocha tests
gulp.task('tests', function() {
    
    del('./test/*.js');

    return gulp.src('./test/**/*.ts')
        .pipe(typescript())
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

// TypeScript compile
gulp.task('compile', function() {
    return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .js.pipe(gulp.dest('./dist'));
});

// ADD for fix Mocha path
gulp.task('dist', gulp.series('clean', 'clean_src'), function() {
    return gulp.src('src/**/*.ts').pipe(tsProject()).pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.series('clean_src','clean','compile'));
gulp.task('test', gulp.series('build', 'compile-tests-data', 'tests'));
gulp.task('default', gulp.series('build'));
//gulp.task('compile', ['handlebars']);