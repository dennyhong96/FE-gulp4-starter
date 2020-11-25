const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();

const files = {
  scssPath: "src/scss/**/*.scss", // glob pattern
  jsPath: "src/js/**/*.js",
  htmlPath: "./**/*.html",
};

// Sass task
function scssTask() {
  return (
    // Locates scss files
    src(files.scssPath)
      // Initializes source maps
      .pipe(sourcemaps.init())
      // Compiles sass into CSS
      .pipe(sass().on("error", sass.logError))
      // Adds vender prefix and minify
      .pipe(postcss([autoprefixer(), cssnano()]))
      // Writes source map to dist
      .pipe(sourcemaps.write("."))
      // Outputs CSS files to dist
      .pipe(dest("dist"))
      // Streams changes to all browsers (without refresh)
      .pipe(browserSync.stream())
  );
}

// JS task
function jsTask() {
  return (
    // Locates js files
    src(files.jsPath, { sourcemaps: true })
      // Concats all js files
      .pipe(concat("all.js"))
      // Minimize JS file
      .pipe(uglify())
      // Outputs JS file and sourcesmaps into dist
      .pipe(dest("dist", { sourcemaps: "." }))
  );
}

// Cachebusting task
const cbStr = new Date().getTime();
function cbTask() {
  return (
    // Chooses file to cachebust
    src(["index.html"])
      // Updates filename query string
      .pipe(replace(/cb=\d+/g, `cb=${cbStr}`))
      // Outputs to same dir
      .pipe(dest("."))
  );
}

// Watch task
function watchTask() {
  // Setup dev server
  browserSync.init({
    server: {
      baseDir: ".",
    },
  });

  // Re-compiles and streams scss changes
  watch(files.scssPath, scssTask);

  // Re-compiles and refreshes browser when JavaScript changes
  watch(files.jsPath).on("change", parallel(jsTask, browserSync.reload));

  // Refreshes browser when HTML changes
  watch(files.htmlPath).on("change", browserSync.reload);
}

// Default task - Called when typing `gulp` in cmd line
exports.default = series(parallel(scssTask, jsTask), cbTask, watchTask); // series run tasks one by one
