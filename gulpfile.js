const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();

// Compiles scss into css
function style() {
  return (
    gulp
      // Locates scss files
      .src("./src/scss/**/*.scss")
      // Passes scss files through compiler
      .pipe(sass())
      // Saves compiled CSS
      .pipe(gulp.dest("./css"))
      // Streams changes to all browsers (w/o refresh)
      .pipe(browserSync.stream())
  );
}

// Watches for file changes
function watch() {
  // Creates a dev server
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  // Re-compile scss upon changes
  gulp.watch("./src/scss/**/*.scss", style);

  // Refresh browser when HTML changes
  gulp.watch("./**/*.html").on("change", browserSync.reload);

  // Refresh browser when JavaScript changes
  gulp.watch("./src/js/**/*.js").on("change", browserSync.reload);
}

module.exports = {
  style,
  watch,
};
