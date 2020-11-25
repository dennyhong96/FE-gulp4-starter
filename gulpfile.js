const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();

// Compile scss into css
function style() {
  return (
    gulp
      // Locates scss files
      .src("./src/scss/**/*.scss")
      // Passes scss files through compiler
      .pipe(sass())
      // Saves compiled CSS
      .pipe(gulp.dest("./css"))
  );
}

exports.style = style;
