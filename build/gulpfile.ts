import gulp = require('gulp')
import del = require('del')
import shell = require('gulp-shell')

function clean() {
    return del([
        'dist/**/*'
    ])
}

function copySource() {
    return gulp.src('src/**/*.ts')
        .pipe(gulp.dest('dist/build/src/'))
}

function copyBuildFile() {
    return gulp.src('build/as/tsconfig.json')
        .pipe(gulp.dest('dist/build/'))
}

function copyRawTs() {
    return gulp.src('build/as/Raw.ts')
        .pipe(gulp.dest('dist/build/src/'))
}

const build = shell.task(
    'cd dist/build && ..\\..\\node_modules\\.bin\\asc src/index.ts -b ../production.wasm --validate', {
    verbose: true
})

exports.build = build
exports.default = gulp.series(clean, copySource, copyBuildFile, copyRawTs, build)