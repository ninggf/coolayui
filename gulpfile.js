const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

const sourcemap = require('gulp-sourcemaps')
const identityMap = require('@gulp-sourcemaps/identity-map')
const babel = require('gulp-babel')
const less = require('gulp-less')
const postcss = require('gulp-postcss')
const autoprefix = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const connect = require('gulp-connect')
const minimist = require('minimist')
const preprocess = require("gulp-preprocess")
const rename = require('gulp-rename')
const cleancss = require('gulp-clean-css')
const clean = require('gulp-rimraf')
const uglify = require('gulp-uglify')
const validate = require('gulp-jsvalidate')
const notify = require('gulp-notify')
const open = require('gulp-open')

const knownOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'dev'
    }
};

const options = minimist(process.argv.slice(2), knownOptions);

const cleanTask = (cb) => {

    src(['js/**/*.js', 'css/**/*.css', 'demo/**/*.html'], {
        read: false
    }).pipe(clean())

    cb()
}

const buildCss = (cb) => {
    let gp = src(['src/less/*.less'])

    if (options.env != 'pro') {
        gp = gp.pipe(sourcemap.init()).pipe(identityMap()).pipe(rename({
            suffix: '.dev'
        }))
    }

    gp = gp.pipe(less()).on('error', e => {
            console.error(e.message)
        })
        .pipe(postcss([pxtorem({
            rootValue: 16
        }), autoprefix()]))
        .on('error', e => {
            console.error(e.message)
        })

    // write sourcemap
    if (options.env != 'pro')
        gp = gp.pipe(sourcemap.write())

    if (options.env == 'pro')
        gp = gp.pipe(cleancss())

    gp = gp.pipe(dest('css'))

    if (options.watch)
        gp = gp.pipe(connect.reload());

    cb();
}

const buildJs = (cb) => {
    let gp = src(['src/js/*.js'])

    if (options.env != 'pro') {
        gp = gp.pipe(sourcemap.init()).pipe(identityMap()).pipe(rename({
            suffix: '.dev'
        }))
    }

    gp = gp.pipe(babel()).on('error', (e) => {
        console.error(e.message)
        notify.onError(e.message)
    }).pipe(validate()).on('error', (e) => {
        notify.onError(e.message)
        console.error(e.message)
    })

    if (options.env != 'pro')
        gp = gp.pipe(sourcemap.write())

    if (options.env == 'pro')
        gp = gp.pipe(uglify()).on('error', (e) => {
            notify.onError(e.message)
            console.error(e.message)
        })

    gp = gp.pipe(dest('js'))

    if (options.watch)
        gp.pipe(connect.reload());

    cb();
};

const buildHtml = (cb) => {
    let gp = src(['src/html/*.html', 'src/html/**/*.html']).pipe(preprocess({
        context: options
    })).on('error', e => {
        console.error(e.message)
    }).pipe(dest('demo'))

    if (options.watch)
        gp.pipe(connect.reload());

    cb()
};

const watching = (cb) => {
    // start dev server
    connect.server({
        root: './',
        livereload: true,
        port: 9090,
    })

    src(['.babelrc'], {
        allowEmpty: true
    }).pipe(open({
        uri: 'http://127.0.0.1:9090/demo/'
    }))

    options.watch = true

    watch(['src/html/**/*.html'], buildHtml)
    watch(['src/js/**/*.js'], buildJs)
    watch(['src/less/**/*.less'], buildCss)

    cb()
}

exports.clean = cleanTask

exports.build = parallel(buildCss, buildJs, buildHtml);

exports.default = series(cb => {
    options.env = 'pro'
    cb()
}, exports.build, cb => {
    src(['js/**/**.dev.js', 'css/**/*.dev.css'], {
        read: false
    }).pipe(clean())

    cb()
});

exports.watch = series(exports.build, watching)
