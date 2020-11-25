const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const files = {
  scssPath: "src/scss/**/*.scss", // glob pattern
  jsPath: "src/js/**/*.js",
};

// Sass task
function scssTask() {
  return (
    // Locates scss files
    src(files.scssPath)
      // Initializes source maps
      .pipe(sourcemaps.init())
      // Compiles sass into CSS
      .pipe(sass())
      // Adds vender prefix and minify
      .pipe(postcss([autoprefixer(), cssnano()]))
      // Writes source map to same dir
      .pipe(sourcemaps.write("."))
      // Outputs CSS files
      .pipe(dest("dist"))
  );
}

// JS task
function jsTask() {
  return (
    // Locates js files
    src(files.jsPath)
      // Concats all js files
      .pipe(concat("all.js"))
      // Minimize JS file
      .pipe(uglify())
      // Outputs JS file
      .pipe(dest("dist"))
  );
}

// Cachebusting task
const cbStr = new Date().getTime();
function cbTask() {
  return (
    // Chooses file to cachebust
    src(["index.html"])
      // Updates filename
      .pipe(replace(/cb=\d+/g, `cb=${cbStr}`))
      // Outputs to same dir
      .pipe(dest("."))
  );
}
