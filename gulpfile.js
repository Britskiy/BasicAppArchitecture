const gulp = require('gulp');
const { deleteSync } = require('del');
const { spawn } = require('child_process');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

function clean() {
    return new Promise((resolve) => {
        deleteSync(['dist/**/*']);
        resolve();
    });
}

function compileTS() {
    return gulp.src('src/**/*.ts') // ✅ Компилируем только `src/`, а не весь проект
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
}

function runTests(done) {
    const mochaProcess = spawn('npx', ['mocha', '-r', 'ts-node/register', './test/**/*.ts', '--reporter', 'spec', '--exit'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'test' }
    });

    mochaProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Mocha tests failed with exit code ${code}`);
            done(new Error(`Test failed with exit code ${code}`));
        } else {
            done();
        }
    });
}

gulp.task('clean', clean);
gulp.task('build', gulp.series('clean', compileTS));
gulp.task('test', gulp.series(runTests));
gulp.task('default', gulp.series('build'));