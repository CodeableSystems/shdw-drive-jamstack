const gulp = require("gulp");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const using = require("./using");
const templateData = require("./src/data");
const gulpIgnore = require("gulp-ignore");
const flatten = require("gulp-flatten");
const shell = require("gulp-shell");
const axios = require("axios");
const Fs = require("@supercharge/filesystem");
const through = require("through2");

const dotenv = require("dotenv");
dotenv.config();

async function getListObjects(account) {
  try {
    const resp = await axios.post(
      `https://shadow-storage.genesysgo.net/list-objects-and-sizes`,
      {
        storageAccount: account,
      }
    );
    if (resp.status === 200) {
      return await resp.data;
    } else {
      return { files: [] };
    }
  } catch (e) {
    return { files: [] };
  }
}

gulp.task("watch", function () {
  gulp.watch("./assets/**/*", { cwd: "./" }, gulp.series("assets"));
  gulp.watch("./src/data.js", { cwd: "./" }, gulp.series("handlebars"));
  gulp.watch("./src/**/*.hbs", { cwd: "./" }, gulp.series("handlebars"));
  gulp.watch("./src/styles/**/*.css", { cwd: "./" }, gulp.series("styles"));
});

gulp.task("upload-new", function () {
  return new Promise(function (resolve) {
    gulp
      .src(["build"], { read: false })
      .pipe(using())
      .pipe(
        shell(
          [
            `BROWSER="" shdw-drive upload-multiple-files -kp ${process.env.WALLETFILE} -s ${process.env.DRIVE} -d <%= file.path %>`,
          ],
          { ignoreErrors: true }
        )
      );
    resolve();
  });
});

gulp.task("upload-changed", async function () {
  let remoteFiles = await getListObjects(process.env.DRIVE);
  return new Promise(function (resolve) {
    gulp
      .src(["build/**/*"], { read: false })
      .pipe(using())
      .pipe(
        through.obj(async (chunk, enc, cb) => {
          const stats = await Fs.stat(chunk.path);
          let uploadedFile = remoteFiles.files.filter(
            (f) => f.file_name === chunk.relative
          );
          if (uploadedFile && uploadedFile[0].size != stats.size) {
            cb(null, chunk);
          } else {
            cb(null, null);
          }
        })
      )
      .pipe(
        shell(
          [
            `BROWSER="" shdw-drive edit-file -kp ${process.env.WALLETFILE} -f build/<%= file.relative %> -u https://shdw-drive.genesysgo.net/${process.env.DRIVE}/<%= file.relative %>`,
          ],
          { ignoreErrors: true }
        )
      );
    resolve();
  });
});
gulp.task("styles", function () {
  return new Promise(function (resolve) {
    gulp.src(["./src/styles/**/*.css"]).pipe(using()).pipe(gulp.dest("build"));
    resolve();
  });
});
gulp.task("assets", function () {
  return new Promise(function (resolve) {
    gulp.src(["./assets/**/*"]).pipe(using()).pipe(gulp.dest("build"));
    resolve();
  });
});

gulp.task("handlebars", function () {
  return new Promise(function (resolve) {
    gulp
      .src(["./src/**/*.hbs"])
      .pipe(gulpIgnore.exclude("partials/**"))
      .pipe(using())
      .pipe(
        handlebars(templateData, {
          batch: ["./src/partials"],
          helpers: {
            caps: function (str) {
              if (!str) return void 0;
              return str.toUpperCase();
            },
          },
        })
      )
      .pipe(rename({ extname: ".html" }))
      .pipe(flatten())
      .pipe(gulp.dest("build", { flatten: true }));
    resolve();
  });
});
gulp.task(
  "build",
  gulp.parallel(["handlebars", "styles", "assets"]),
  function (done) {
    done();
  }
);

gulp.task(
  "upload",
  gulp.series(["upload-new", "upload-changed"]),
  function (done) {
    done();
  }
);

gulp.task(
  "default",
  gulp.parallel(["handlebars", "styles", "assets", "watch"]),
  function (done) {
    done();
  }
);
