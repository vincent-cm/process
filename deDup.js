const fs = require("fs");
var removeArr = [];

var oldPath = "/Volumes/Files/Chinese\ works\ of\ art/output/";
var newPath = "/Volumes/Files/Chinese\ works\ of\ art/output/bak/";
removeArr.forEach((item) => {
  fs.rename(oldPath + item + ".zip", newPath + item + ".zip", function (err) {
    if (err) throw err;
    console.log("Successfully renamed");
  });
});
