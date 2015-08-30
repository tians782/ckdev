// 定义依赖项和插件
var gulp=require('gulp'),
    gutil=require('gulp-util'),
    uglify=require('gulp-uglify'),//压缩js
    minifyCSS=require('gulp-minify-css'),//压缩js
    concat=require('gulp-concat'),//合并
    watchPath=require('gulp-watch-path'),//监听
    minifyHTML=require('gulp-minify-html'),//压缩html
    jshint = require("gulp-jshint"),//js代码检查
    template = require("gulp-template"),//模板替换
    clean = require('gulp-clean'),//清空内容
    rename = require('gulp-rename'),//重命名
    imagemin = require('gulp-imagemin'),//图片压缩
    contentIncluder = require('gulp-content-includer'),
    less = require('gulp-less'),
    revCollector = require('gulp-rev-collector'),
    browserSync = require('browser-sync'),//监听页面刷新
    rev = require('gulp-rev');

    path = {
        html : "cube-slide/*.html",
        less : "cube-slide/css/*.less",
        css : "cube-slide/css/*.css",
        js : "cube-slide/js/*.js",
        images : "cube-slide/images/*.*",
        cssfile:"cube-slide/css"
    };

//监听页面刷新
//等同于browser-sync start --server --files "**"
gulp.task('browser',function() {
    //browserSync({
    //    files: "**",
    //    server: {
    //        baseDir: "./"
    //    }
    //});
    browserSync.init({
        server : "./"
    });
    gulp.watch(path.less, ["less"]);
    gulp.watch(path.js, ["js-watch"]);
    gulp.watch(path.html, ["html-watch"]);
    gulp.watch(path.html).on("change", function() {
        browserSync.reload;
    });
});

//引入html模块
//gulp.task('include', function() {
//    gulp.src(path.html)
//        .pipe(contentIncluder({
//            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
//        }))
//        //.pipe(rename(''))
//        .pipe(gulp.dest('public'))
//})

//执行less任务
gulp.task('less',function() {
    gulp.src(path.less)
        .pipe(less({ compress: true }))
        .on('error', function(e){console.log(e);})
        //.pipe(minifyCSS())
        .pipe(gulp.dest(path.cssfile))
        .pipe(browserSync.stream());
})
//刷新html
gulp.task("html-watch", function() {
    gulp.src(path.html)
        .pipe(browserSync.stream());
})
//刷新js
gulp.task("js-watch", function() {
    gulp.src(path.js)
        .pipe(browserSync.stream());
})

//替换html引入的路径
gulp.task('rev',['css','js'],function () {
    return gulp.src(['rev/**/*.json', path.html])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'css',
                'js': 'js',
                'cdn/': function(manifest_value) {
                    return 'cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                }
            }
        }))
        //.pipe(minifyHTML({empty:true, spare:true}))//压缩html
        .pipe(gulp.dest('public/'));
});

// 定义名为 "clean" 的任务
gulp.task('clean', function(){
    return gulp.src('public',{read:false})
        .pipe(clean())//清空public本地文件
});

// 定义名为 "js" 的任务
gulp.task('js',function(){
    gulp.src('cube/js/*.js')
        .pipe(uglify().on('error', gutil.log))//压缩js
        .pipe(concat('app.min.js'))//合并为all.js
        .pipe(rev())
        .pipe(gulp.dest('public/js'))
        .pipe(rev.manifest())
        .pipe( gulp.dest( 'rev/js' ) );
});

//检查js代码
gulp.task('checkjs', function () {
    gulp.src(path.js)
        .pipe(jshint())
        .pipe(jshint.reporter()); // 输出检查结果
});

// 定义名为 "css" 的任务
gulp.task('css',['less'],function () {
    return gulp.src('cube/css/app.css')
        //.pipe(minifyCSS())//压缩css
        //.pipe(rename('style.min.css'))//合并为style.min.css
        .pipe(rev())
        .pipe(gulp.dest('public/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
});

// 压缩图片任务
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src(path.images)
        // 2. 压缩图片
        .pipe(imagemin({
            progressive: true
        }))
        // 3. 另存图片
        .pipe(gulp.dest('public/images'))
});

// 压缩html任务
gulp.task('minhtml', function () {
    gulp.src(path.html) // 要压缩的html文件
        .pipe(minifyHTML({empty:true, spare:true}))//压缩html
        .pipe(gulp.dest('public'));
});


//监听事件1
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 任务
    //利用 event 给到的信息，检测到某个 js 文件被修改时，只编写当前修改的 js 文件。
    gulp.watch('cube/js/*.js', function (event) {
        var paths = watchPath(event, 'cube/js/', 'public')
        /*
         paths
         { srcPath: 'src/js/log.js',
         srcDir: 'src/js/',
         distPath: 'dist/js/log.js',
         distDir: 'dist/js/',
         srcFilename: 'log.js',
         distFilename: 'log.js' }
         */
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('public ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(uglify())
            .pipe(concat('app.min.js'))//合并为all.js
            .pipe(gulp.dest('public/js'));//生成到public/js下
        //.pipe(gulp.dest(paths.distDir))
    })

    gulp.watch('cube/css/*.css', function (event) {
        var paths = watchPath(event, 'cube/css/', 'public/')
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('public ' + paths.distPath)
        gulp.src(paths.srcPath)
            .pipe(minifyCSS())
            .pipe(concat('style.min.css'))//合并为style.min.css
            .pipe(gulp.dest('public/css'));//生成到public/css下
    })
    //
    //gulp.watch('js/*.js', ['js']);
    //gulp.watch('css/*.css', ['css']);
    //gulp.watch('images/*.*', ['images']);
})
//监听事件2
gulp.task('auto1', function () {
    // 监听文件修改，当文件被修改则执行 任务
    //gulp.watch('cube/js/*.js', ['js']);
    //gulp.watch('cube/css/*.css', ['css']);
    gulp.watch(path.less, ['less']);
    //gulp.watch('cube/images/*.*', ['images']);
    //gulp.watch('cube', ['rev']);
})

// 定义默认任务
//gulp.task('default', ['css','js','images','auto']);
//gulp.task('default', ['css','js','images']);
gulp.task('default', ['browser']);


