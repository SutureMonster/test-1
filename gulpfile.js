/* 
gulp 构建自动化项目  所需插件
gulp-uglify gulp-rename gulp-sass gulp-clean-css gulp-htmlmin gulp-webserver gulp-load-plugins gulp-babel@7.0.1 babel-core babel-preset-es2015 gulp-clean gulp-imagemin -D
 */

const {
    src,
    dest,
    watch,
    series,
    parallel
} = require('gulp');
const _ = require('gulp-load-plugins')();


//清空目标文件夹
function cleanDir(cb) {
    src('dist', {
            allowEmpty: true,
        })
        .pipe(_.clean())
    cb();
}

//处理html
function htmlHandler(cb) {
    src('src/*.html')
        .pipe(_.fileInclude({
            prefix: '@@',
            basepath: './src/components'
        }))
        .pipe(_.htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('./dist'))
    cb();
}


//处理css
function cssHandler(cb) {
    src('src/sass/*.scss')
        .pipe(_.sass())
        .pipe(_.autoprefixer())
        .pipe(_.cleanCss())
        .pipe(_.rename({
            suffix: ".min"
        }))
        .pipe(dest('./dist/css'))
    cb();
}


//处理js
function jsHandler(cb) {
    src('src/js/*.js')
        .pipe(_.babel({
            presets: ['es2015']
        }))
        .pipe(_.uglify())
        .pipe(_.rename({
            suffix: ".min"
        }))
        .pipe(dest('./dist/js'))
    cb();
}

// 处理图片的任务
function imgHandler(cb) {
    src('src/images/*.*')
        .pipe(_.imagemin({
            optimizationLevel: 0, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(dest('./dist/images'))
    cb()
}

//创建服务器
function server(cb) {
    setTimeout(function () {
        src('./dist', {
                allowEmpty: true
            })
            .pipe(_.webserver({
                open: true,
                livereload: true,
                port: 8888,
                host: "localhost",
                fallback: "index.html"
            }))
    }, 1000)
    cb();
}

//任务监听
function listener(cb) {
    watch('./src/*.html', {
        ignoreInitial: false
    }, htmlHandler)
    watch('./src/sass/*.scss', {
        ignoreInitial: false
    }, cssHandler)
    watch('./src/js/*.js', {
        ignoreInitial: false
    }, jsHandler)
    watch('./src/images/*.*', {
        ignoreInitial: false
    }, imgHandler)
    cb()
}

//导出任务

exports.default = series(cleanDir, parallel(htmlHandler, cssHandler, jsHandler, imgHandler), listener, server)