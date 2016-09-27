var gulp = require('gulp'),
   watch = require('gulp-watch'),
   prefixer = require('gulp-autoprefixer'),
   uglify = require('gulp-uglify'),
   sass = require('gulp-sass'),
   rigger = require('gulp-rigger'),
   sourcemaps = require('gulp-sourcemaps'),
   cssmin = require('gulp-cssnano'),
   imagemin = require('gulp-imagemin'),
   pngquant = require('imagemin-pngquant'),
   rimraf = require('rimraf'),
   browserSync = require("browser-sync"),
   notify = require("gulp-notify"),
   concat = require('gulp-concat'),
   stripDebug = require('gulp-strip-debug'),
   spritesmith = require('gulp.spritesmith'),
   reload = browserSync.reload;



var path = {
   build: {
      html: 'dist/',
      js: 'dist/js/',
      css: 'dist/css/',
      img: 'dist/img/',
      fonts: 'dist/fonts/',
      sprite: 'dist/img/sprite/',
      spriteScss: 'src/style/'
   },
   src: {
      html: 'src/html/*.html',
      js: [
         'src/bower_components/jquery/dist/jquery.js',
         'src/bower_components/bootstrap-css/js/bootstrap.js',
         'src/js/main.js'
      ],
      style: 'src/style/styles.scss',
      img: 'src/img/**/*.*',
      fonts: [
         'src/fonts/**/*.*',
         'src/bower_components/components-font-awesome/fonts/*.*',
         'src/bower_components/Ionicons/fonts/*.*'
      ],
      sprite: 'src/sprite/*.*'
   },
   watch: {
      html: 'src/html/**/*.html',
      js: 'src/js/**/*.js',
      style: 'src/style/**/*.scss',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*',
      sprite: 'src/sprite/*.*'
   },
   clean: './dist/'
};

var config = {
   server: {
      baseDir: "./dist"
   },
   tunnel: true,
   host: 'gulp_zero',
   port: 8000,
   logPrefix: "Good luck in coding"
};

// tasks
gulp.task('sprites', function () {
   var spriteData =
      gulp.src(path.src.sprite)
         .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.scss',
         }));
   spriteData.css.pipe(gulp.dest(path.build.spriteScss));
   spriteData.img.pipe(gulp.dest(path.build.sprite))
});



// task html
gulp.task('html:build', function () {
   gulp.src(path.src.html)
      .pipe(rigger()) // i am rigger off
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({
         stream: true
      }));

});

gulp.task('js:build', function () {
   gulp.src(path.src.js)
      .pipe(concat('main.js'))
      .pipe(stripDebug())
      .pipe(uglify())
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({
         stream: true
      }));
});

gulp.task('style:build', function () {
   gulp.src(path.src.style)
      //.pipe(sourcemaps.init())
      .pipe(concat('styles.css'))
      .pipe(sass().on('error', sass.logError))
      .pipe(prefixer('last 40 versions', '> 5%', 'ie 8', 'ie 7', 'Firefox ESR'))
      .pipe(cssmin())
      //.pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({
         stream: true
      }));
});

gulp.task('image:build', function () {
   gulp.src(path.src.img)
      .pipe(imagemin({
         progressive: true,
         svgoPlugins: [{
            removeViewBox: false
         }],
         use: [pngquant()],
         interlaced: true
      }))
      .pipe(gulp.dest(path.build.img))
      .pipe(reload({
         stream: true
      }));
});

gulp.task('fonts:build', function () {
   return gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
   'html:build',
   'js:build',
   'style:build',
   'fonts:build',
   'image:build'
]);


gulp.task('watch', function () {
   watch([path.watch.html], function (event, cb) {
      gulp.start('html:build');
   });
   watch([path.watch.style], function (event, cb) {
      gulp.start('style:build');
   });
   watch([path.watch.js], function (event, cb) {
      gulp.start('js:build');
   });
   watch([path.watch.img], function (event, cb) {
      gulp.start('image:build');
   });
   watch([path.watch.fonts], function (event, cb) {
      gulp.start('fonts:build');
   });
});

gulp.task('webserver', function () {
   browserSync(config);
});

gulp.task('clean', function (cb) {
   rimraf(path.clean, cb);
});

gulp.task('default', [
   'build',
   'webserver',
   'watch'
]);
