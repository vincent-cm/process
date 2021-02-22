"use strict";
const fs = require("fs");
const path = require("path");
const walk = require("walk");
const unzipper = require("unzipper");
const pathToFiles = "files";
const pathToOutput = "output";
const iconv = require("iconv-lite");
const options = {
  followLinks: false,
};
const errorLogPath = __dirname + "/" + pathToOutput + "/" + "error.log";
const logPath = __dirname + "/" + pathToOutput + "/" + "message.log";
var currentContent;
var currentText;
var currentFileName;
fs.truncateSync(errorLogPath, 0);
fs.truncateSync(logPath, 0);

const walker = walk.walk(pathToFiles, options);

walker.on("names", (root, nodeNamesArray) => {});

walker.on("directories", (root, dirStatsArray, next) => {
  next();
});

walker.on("file", (root, fileStats, next) => {
  // skip file names starting wi th '.'
  if (fileStats.name.substr(0, 1) === ".") {
    next();
    return;
  }
  // skip file donotread.md
  if (fileStats.name.split(".").pop() !== "zip") {
    next();
    return;
  }

  fs.readFile(path.join(root, fileStats.name), async () => {
    currentContent = null;
    currentText = null;
    currentFileName = null;
    try {
      const zipSource = fs
        .createReadStream(path.join(root, fileStats.name))
        .pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of zipSource) {
        // if some legacy zip tool follow ZIP spec then this flag will be set
        const isUnicode = entry.props.flags.isUnicode;
        // decode "non-unicode" filename from OEM Cyrillic character set
        const fileName = isUnicode
          ? entry.path
          : iconv.decode(entry.props.pathBuffer, "cp866");
        console.log(fileName);
        const type = entry.type; // 'Directory' or 'File'
        const size = entry.vars.uncompressedSize; // There is also compressedSize;
        if (
          path.extname(fileName) === ".txt" ||
          path.extname(fileName) === ".json"
        ) {
          const parseMsg =
            "Got info: " + __dirname + "/" + pathToOutput + "/" + fileName;
          writeToLog(fileStats.name, parseMsg, false);
          const text = await entry.buffer();
          currentText = text.toString("utf8");
          // console.log(currentText);
        } else if (
          path.extname(fileName) === ".tiff" ||
          path.extname(fileName) === ".tif" ||
          path.extname(fileName) === ".jpeg" ||
          path.extname(fileName) === ".jpg" ||
          path.extname(fileName) === ".png" ||
          path.extname(fileName) === ".gif"
        ) {
          const parseMsg =
            "Got image: " + __dirname + "/" + pathToOutput + "/" + fileName;
          writeToLog(fileStats.name, parseMsg, false);
          currentContent = await entry.buffer();
          currentFileName = fileName;
          // console.log(currentContent);
        } else {
          entry.autodrain();
        }
      }
      if (currentText && currentContent) {
        await processImg(currentContent, currentText, currentFileName);
      }
      next();
    } catch (error) {
      writeToLog(fileStats.name, error, true);
      next();
    }
  });
});

walker.on("end", () => {
  writeToLog("", "All Done!", false);
});

const writeToLog = (fileName, msg, isError) => {
  const logMsg = isError
    ? "Error while parsing: " + fileName + "\n" + msg + "\n"
    : msg + "\n";
  fs.appendFileSync(isError ? errorLogPath : logPath, logMsg);
};

const processImg = async () => {};
