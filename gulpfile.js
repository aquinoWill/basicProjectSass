var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    iconfont = require('gulp-iconfont');
    iconfontCss = require('gulp-iconfont-css'),
    rename = require("gulp-rename"),
    flatten = require('gulp-flatten'),
    argv = process.argv;


gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fontIcon', 'copyFonts', 'copyIonicIcons', 'scripts'],
    function(){
      gulpWatch('assets/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('assets/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});


gulp.task('build', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fontIcon', 'copyFonts', 'copyIonicIcons', 'scripts'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});


gulp.task('copyFonts', function(){
  gulp.src(['assets/**/*.+(woff2|eot|tff|)'])
  .pipe(flatten())
  .pipe(gulp.dest('www/build/fonts'))
});


gulp.task('fontIcon', function(){
  gulp.src(['assets/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: 'iconFonts',
      cssClass: 'icn',
      path: 'assets/theme/elements/icons/template/icons.scss',
      targetPath: '../theme/elements/icons/icons.scss',
      fontPath: '../fonts/icons/'
    }))
    .pipe(iconfont({
      fontName: 'iconFonts',
      formats: ['eot', 'ttf', 'woff2']
     }))
    .pipe(gulp.dest('assets/fonts/'));
});


gulp.task('clean', function(){
  return del('dist/');
});
