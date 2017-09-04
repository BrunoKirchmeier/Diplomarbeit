var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var connect = require('gulp-connect-php');




// Directories
// -----------------
const settings = {
    publicDir: '.',
    sassDir: 'assets/sass',
    cssDir: 'assets/css',
    htmlDir: '.',
    phpDir: '.'
};






// Development Tasks
// -----------------

gulp.task('serve', function() {
    connect.server({
        base: '.'
    }, function (){
        browserSync({
            // injectChanges: true,
            proxy: '127.0.0.1:8000' // 127.0.0.1:8000
        });
    });

    gulp.start('sass');
    gulp.start('watch');

});


gulp.task('sass', function() {
    return gulp.src(settings.sassDir + "/**/*.scss") // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass()) // Passes it through a gulp-sass
        .pipe(gulp.dest(settings.cssDir)) // Outputs it in the css folder
        .pipe(browserSync.stream({match: settings.cssDir}));
});

gulp.task('css', function() {
    return gulp.src(settings.cssDir + '/**/*.css')
        .pipe(browserSync.stream({match: settings.cssDir + '/**/*.css'}));
});

// Watchers
gulp.task('watch', function() {
    gulp.watch(settings.sassDir + "/**/*.scss", ['sass']);
    gulp.watch(settings.cssDir + '/**/*.css', ['css']);
    gulp.watch('/*.html', browserSync.reload);
    gulp.watch('/*.php', browserSync.reload);
    gulp.watch('/*.js', browserSync.reload);
});




// Build Sequences
// ---------------

/*
 gulp.task('default', function(callback) {
 runSequence(['sass', 'browserSync', 'watch'],
 callback
 )
 });
 */



/* URL mit CODE :     https://gist.github.com/martincarlin87/2abdad2efa48bb8b45bf */