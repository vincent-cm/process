var TestArray = [];
const pathToOutput = "output";
const fs = require("fs");

var result = TestArray.filter((el) =>
  TestArray.find((item) => el !== item && el.includes(item))
).map((e) => e + "");
const logPath = __dirname + "/" + pathToOutput + "/" + "result.log";
fs.appendFileSync(logPath, result.toString());
console.log(result);

var removeArr = [];

var oldPath = "XXXX/";
var newPath = "XXXX/bak/";
removeArr.forEach((item) => {
  fs.rename(oldPath + item + ".zip", newPath + item + ".zip", function (err) {
    if (err) throw err;
    console.log("Successfully renamed");
  });
});
