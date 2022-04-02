"use strict";
const fs = require("fs");
const path = require("path");
const walk = require("walk");
const unzipper = require("unzipper");
const pathToFiles = "/Volumes/Files/Chinese works of art/output/";
// const pathToFiles = "files";
const pathToOutput = "output";
const iconv = require("iconv-lite");
const detect = require("charset-detector");
const JSZip = require("jszip");
const Jimp = require("jimp");
var watermark = require("./watermark");

const colors = [
  "ffffff",
  "000000",
  "5c2223",
  "eea2a4",
  "5a191b",
  "f07c82",
  "5a1216",
  "ed5a65",
  "c04851",
  "ee3f4d",
  "c02c38",
  "a7535a",
  "e3b4b8",
  "f0a1a8",
  "f1939c",
  "a61b29",
  "894e54",
  "c45a65",
  "d11a2d",
  "c21f30",
  "de1c31",
  "7c1823",
  "541e24",
  "4c1f24",
  "82202b",
  "82111f",
  "ef475d",
  "4d1018",
  "ed556a",
  "7a7374",
  "f03752",
  "e6d2d5",
  "f0c9cf",
  "ee2746",
  "2b1216",
  "ee4863",
  "e77c8e",
  "500a16",
  "c27c88",
  "73575c",
  "ee4866",
  "621624",
  "ce5777",
  "cc163a",
  "f1c4cd",
  "eeb8c3",
  "856d72",
  "2d0c13",
  "36282b",
  "bf3553",
  "ec9bad",
  "63071c",
  "30161c",
  "eea6b7",
  "e9ccd3",
  "eba0b3",
  "4f383e",
  "ed9db2",
  "ec8aa4",
  "ec7696",
  "ea7293",
  "ef82a0",
  "ec2c64",
  "eb507e",
  "eb3c70",
  "ea517f",
  "de7897",
  "b598a1",
  "ed2f6a",
  "c5708b",
  "33141e",
  "621d34",
  "ef3473",
  "382129",
  "310f1b",
  "381924",
  "e16c96",
  "951c48",
  "62102e",
  "e0c8d1",
  "d13c74",
  "4b1e2f",
  "ec4e8a",
  "de3f7c",
  "a8456b",
  "ce5e8a",
  "461629",
  "ee2c79",
  "ef498b",
  "ede3e7",
  "ec2d7a",
  "482936",
  "440e25",
  "d2568c",
  "e9d7df",
  "d2357d",
  "36292f",
  "d276a3",
  "c06f98",
  "cc5595",
  "c35691",
  "ba2f7b",
  "9b1e64",
  "5d3f51",
  "4e2a40",
  "bc84a8",
  "c08eaf",
  "411c35",
  "ad6598",
  "a35c8f",
  "681752",
  "894276",
  "7e2065",
  "8b2671",
  "983680",
  "c8adc4",
  "1c0d1a",
  "7e1671",
  "1e131d",
  "813c85",
  "d1c2d3",
  "3e3841",
  "815c94",
  "806d9e",
  "e2e1e4",
  "322f3b",
  "8076a3",
  "35333c",
  "22202e",
  "131124",
  "302f4b",
  "525288",
  "2f2f35",
  "ccccd6",
  "74759b",
  "1f2040",
  "2e317c",
  "a7a8bd",
  "61649f",
  "2d2e36",
  "5e616d",
  "47484c",
  "0f1423",
  "131824",
  "475164",
  "2b333e",
  "1c2938",
  "101f30",
  "142334",
  "15559a",
  "0f59a4",
  "1661ab",
  "3170a7",
  "346c9c",
  "2775b6",
  "2b73af",
  "2474b5",
  "4e7ca1",
  "2376b7",
  "144a74",
  "93b5cf",
  "2177b8",
  "126bae",
  "1772b4",
  "baccd9",
  "619ac3",
  "495c69",
  "8fb2c9",
  "5698c3",
  "11659a",
  "2983bb",
  "1677b3",
  "c4cbcf",
  "1177b0",
  "2486b9",
  "5e7987",
  "74787a",
  "cdd1d3",
  "1781b5",
  "66a9c9",
  "d0dfe6",
  "2f90b9",
  "8abcd1",
  "c3d7df",
  "158bb8",
  "d8e3e7",
  "b2bbbe",
  "1a94bc",
  "5cb3cc",
  "134857",
  "132c33",
  "21373d",
  "b0d5df",
  "22a2c3",
  "474b4c",
  "63bbd0",
  "126e82",
  "0f95b0",
  "1491a8",
  "c7d2d4",
  "1e9eb3",
  "3b818c",
  "0eb0c9",
  "29b7cb",
  "51c4d3",
  "7cabb1",
  "10aec2",
  "648e93",
  "93d5dc",
  "617172",
  "c6e6e8",
  "869d9d",
  "57c3c2",
  "c4d7d6",
  "12aa9c",
  "737c7b",
  "12a182",
  "1ba784",
  "428675",
  "c0c4c3",
  "248067",
  "1a3b32",
  "314a43",
  "2c9678",
  "223e36",
  "497568",
  "141e1b",
  "69a794",
  "2bae85",
  "9abeaf",
  "45b787",
  "92b3a5",
  "1f2623",
  "83cbac",
  "70887d",
  "55bb8a",
  "20a162",
  "40a070",
  "1a6840",
  "61ac85",
  "68b88e",
  "a4cab6",
  "3c9566",
  "5dbe8a",
  "207f4c",
  "eef7f2",
  "579572",
  "b9dec9",
  "229453",
  "20894d",
  "15231b",
  "66c18c",
  "a4aca7",
  "8a988e",
  "9eccab",
  "83a78d",
  "485b4d",
  "5d655f",
  "6e8b74",
  "2b312c",
  "c6dfc8",
  "41b349",
  "43b244",
  "253d24",
  "41ae3c",
  "add5a2",
  "5e665b",
  "8cc269",
  "5bae23",
  "dfecd5",
  "cad3c3",
  "9fa39a",
  "b2cf87",
  "96c24e",
  "f0f5e5",
  "b7d07a",
  "d0deaa",
  "373834",
  "bacf65",
  "e2e7bf",
  "bec936",
  "d2d97a",
  "e2d849",
  "fffef8",
  "5e5314",
  "fffef9",
  "ad9e5f",
  "fed71a",
  "f9f4dc",
  "e4bf11",
  "d2b116",
  "fbda41",
  "eed045",
  "f1ca17",
  "d2b42c",
  "f2ce2b",
  "e2c027",
  "645822",
  "fcd217",
  "f8df70",
  "dfc243",
  "f8df72",
  "ffd111",
  "ddc871",
  "fffefa",
  "867018",
  "887322",
  "fcd337",
  "8e804b",
  "fecc11",
  "fccb16",
  "ffc90c",
  "b7ae8f",
  "f8d86a",
  "fbcd31",
  "fcc307",
  "e9ddb6",
  "fcc515",
  "f7e8aa",
  "e8b004",
  "f9c116",
  "f9d770",
  "fbc82f",
  "f1f0ed",
  "5b4913",
  "f6c430",
  "b78d12",
  "f9bd10",
  "f9d367",
  "d9a40e",
  "ebb10d",
  "584717",
  "f7de98",
  "f9f1db",
  "f4ce69",
  "feba07",
  "8a6913",
  "876818",
  "b6a476",
  "fcb70a",
  "f0d695",
  "87723e",
  "f8e8c1",
  "d6a01d",
  "f7da94",
  "eaad1a",
  "fbb612",
  "b5aa90",
  "f7f4ed",
  "f8bc31",
  "b78b26",
  "e5d3aa",
  "695e45",
  "e5b751",
  "f3bf4c",
  "685e48",
  "fbb929",
  "f9d27d",
  "e2c17c",
  "b4a992",
  "f6dead",
  "f2e6ce",
  "f8e0b0",
  "393733",
  "835e1d",
  "f8f4ed",
  "fca104",
  "815f25",
  "fca106",
  "ffa60f",
  "806332",
  "fbf2e3",
  "fba414",
  "e4dfd7",
  "826b48",
  "dad4cb",
  "bbb5ac",
  "bbb5ac",
  "ff9900",
  "fbb957",
  "dc9123",
  "c09351",
  "f4a83a",
  "f7c173",
  "e7a23f",
  "533c1b",
  "f9e8d0",
  "de9e44",
  "f9cb8b",
  "f9a633",
  "daa45a",
  "553b18",
  "513c20",
  "986524",
  "97846c",
  "e3bd8d",
  "4d4030",
  "fb8b05",
  "f8c387",
  "f28e16",
  "503e2a",
  "4a4035",
  "cfccc9",
  "c1b2a3",
  "867e76",
  "847c74",
  "fc8c23",
  "fbecde",
  "4f4032",
  "fbeee2",
  "81776e",
  "9a8878",
  "5d3d21",
  "66462a",
  "918072",
  "d99156",
  "c1651a",
  "d4c4b7",
  "be7e4a",
  "5c3719",
  "de7622",
  "db8540",
  "80766e",
  "f09c5a",
  "f97d1c",
  "f26b1f",
  "f8b37f",
  "fa7e23",
  "f9e9cd",
  "b7a091",
  "945833",
  "f0945d",
  "964d22",
  "954416",
  "e16723",
  "fc7930",
  "cf7543",
  "f86b1d",
  "cd6227",
  "f6dcce",
  "d85916",
  "f7cfba",
  "f27635",
  "e46828",
  "fc6315",
  "b7511d",
  "ea8958",
  "e8b49a",
  "fb9968",
  "edc3ae",
  "363433",
  "8b614d",
  "aa6a4c",
  "a6522c",
  "fa5d19",
  "71361d",
  "b89485",
  "f68c60",
  "f6ad8f",
  "732e12",
  "f7cdbc",
  "ef632b",
  "8c4b31",
  "64483d",
  "f9723d",
  "cf4813",
  "ee8055",
  "f8ebe6",
  "753117",
  "603d30",
  "883a1e",
  "b14b28",
  "873d24",
  "f6cec1",
  "5b423a",
  "624941",
  "673424",
  "f43e06",
  "ef6f48",
  "f4c7ba",
  "ed5126",
  "f34718",
  "f2481b",
  "652b1c",
  "eea08c",
  "f04b22",
  "692a1b",
  "f1441d",
  "773d31",
  "eeaa9c",
  "f0ada0",
  "863020",
  "f2e7e5",
  "862617",
  "f5391c",
  "f03f24",
  "f33b1f",
  "f23e23",
  "f13c22",
  "f05a46",
  "f17666",
  "f15642",
  "f25a47",
  "f2b9b2",
  "592620",
  "de2a18",
  "ed3321",
  "f04a3a",
  "482522",
  "5c1e19",
  "d42517",
  "f19790",
  "ab372f",
  "5a1f1b",
  "ed3b2f",
  "bdaead",
  "eb261a",
  "ac1f18",
  "483332",
  "481e1c",
  "f1908c",
  "ec2b24",
  "efafad",
  "f2cac9",
  "4b2e2b",
  "ed4845",
  "ed3333",
  "5d3131",
];
const options = {
  followLinks: false,
};
const errorLogPath = __dirname + "/" + pathToOutput + "/" + "error.log";
const logPath = __dirname + "/" + pathToOutput + "/" + "message.log";
const parsedPath = __dirname + "/" + pathToOutput + "/" + "parsed.log";
const descPath = __dirname + "/" + pathToOutput + "/" + "desc.json";
const picPath = __dirname + "/" + pathToOutput + "/pic/";
const writeToLog = (fileName, msg, isError) => {
  const logMsg = isError
    ? "Error while parsing: " + fileName + "\n" + msg + "\n"
    : msg + "\n";
  fs.appendFileSync(isError ? errorLogPath : logPath, logMsg);
};
const writeToParsed = (msg) => {
  const log = msg + "\n";
  fs.appendFileSync(parsedPath, log);
};
var processingArr = [];
const descsArr = JSON.parse(fs.readFileSync(descPath, "utf8").toString());
// clear logs at start
fs.truncateSync(errorLogPath, 0);
fs.truncateSync(logPath, 0);

const walker = walk.walk(pathToFiles, options);

walker.on("directories", (root, dirStatsArray, next) => {
  writeToLog(
    "",
    `Entering dir: "${root}" contains "${dirStatsArray
      .map((stat) => `${stat.type}: ${stat.name}`)
      .join("; ")}"`,
    false
  );
  next();
});

walker.on("file", (root, fileStat, next) => {
  writeToLog("", `Under dir: "${root}"`, false);

  // skip file names starting with '.'
  if (fileStat.name.substr(0, 1) === ".") {
    writeToLog("", `Skipped: "${fileStat.name}"`, false);
    next();
    return;
  }
  // skip file non-zip
  if (fileStat.name.split(".").pop() !== "zip") {
    writeToLog("", `Skipped ${fileStat.name}`, false);
    next();
    return;
  }

  const parsedItems = fs
    .readFileSync(parsedPath, "utf8")
    .toString()
    .split(String.fromCharCode(10));

  if (parsedItems.find((el) => el === fileStat.name)) {
    writeToLog("", `Skipped ${fileStat.name}`, false);
    next();
    return;
  }

  writeToLog("", `Inspecting "${fileStat.name}"`, false);

  fs.readFile(path.join(root, fileStat.name), async (err, buffer) => {
    // read a file 'fileStat' and take file name
    processingArr.length = 0;
    try {
      const result = await getZipWithAutoDetectedCharset(buffer);
      console.log(result);
      // read unzipped content 'zipSource'
      const zipSource = fs
        .createReadStream(path.join(root, fileStat.name))
        .pipe(unzipper.Parse({ forceStream: true }));

      for await (const entry of zipSource) {
        // if some legacy zip tool follow ZIP spec then this flag will be set
        const isUnicode = entry.props.flags.isUnicode;
        // decode "non-unicode" filename from OEM Cyrillic character set
        const fileNameWithPath = isUnicode
          ? entry.path
          : iconv.decode(
              entry.props.pathBuffer,
              result && result.charset ? result.charset : "UTF-8"
            );
        const fileName = fileNameWithPath.includes("/")
          ? fileNameWithPath.split("/")[fileNameWithPath.split("/").length - 1]
          : fileNameWithPath;
        const type = entry.type; // 'Directory' or 'File'
        const size = entry.vars.uncompressedSize; // There is also compressedSize;
        var fileNameOnly = fileName.split(".")[0];
        var itemIdx = processingArr.findIndex(
          (el) =>
            (el.nameId && el.nameId.includes(fileNameOnly)) ||
            fileNameOnly.includes(el.nameId)
        );

        if (
          path.extname(fileName) === ".txt" ||
          path.extname(fileName) === ".json"
        ) {
          const parseMsg = "Got info: " + fileName;
          writeToLog(fileStat.name, parseMsg, false);
          const text = await entry.buffer();
          const charset = detect(text);
          const curInfoTxt = iconv.decode(
            text,
            Array.isArray(charset) && charset[0] && charset[0].charsetName
              ? charset[0].charsetName
              : "UTF-8"
          );
          let curInfoTxtExtracted = "";
          if (path.extname(fileName) === ".txt") {
            const arr = curInfoTxt.split("\r\n");
            var inxName = arr.findIndex((el) => el.includes("朝代"));
            if (inxName !== -1) {
              var name = arr[inxName + 1];
              curInfoTxtExtracted = name?.replace(/\"|\,|\:/g, "")?.trim();
            }
            var inxDate = arr.findIndex((el) => el.includes("作者"));
            if (inxDate !== -1) {
              var date = arr[inxDate + 1];
              curInfoTxtExtracted =
                curInfoTxtExtracted +
                (curInfoTxtExtracted ? " " : "") +
                date?.replace(/\"|\,|\:/g, "")?.trim();
            }
            var inxAuthor = arr.findIndex((el) => el.includes("品名"));
            if (inxAuthor !== -1) {
              var author = arr[inxAuthor + 1];
              curInfoTxtExtracted =
                curInfoTxtExtracted +
                (curInfoTxtExtracted ? " " : "") +
                author?.replace(/\"|\,|\:/g, "")?.trim();
            }
          } else if (path.extname(fileName) === ".json") {
            let jsonText = "";
            try {
              jsonText = JSON.parse(curInfoTxt);
              curInfoTxtExtracted = jsonText["朝代"] ? jsonText["朝代"] : "";
              curInfoTxtExtracted =
                curInfoTxtExtracted +
                (jsonText["作者"]
                  ? (curInfoTxtExtracted ? " " : "") + jsonText["作者"]
                  : "");

              curInfoTxtExtracted =
                curInfoTxtExtracted +
                (jsonText["品名"]
                  ? (curInfoTxtExtracted ? " " : "") + jsonText["品名"]
                  : "");
            } catch (e) {
              jsonText = curInfoTxt?.replace(/.+?(?=:)/g, "")?.trim();
              jsonText = jsonText?.replace(/[{}:"]/g, "")?.trim();
              jsonText = jsonText?.replace(/\s\s+/g, " ")?.trim();
              curInfoTxtExtracted = jsonText;
            }
          }
          if (itemIdx !== -1) {
            processingArr[itemIdx]["curInfoTxt"] = curInfoTxtExtracted
              ? curInfoTxtExtracted
              : curInfoTxtExtracted;
          } else {
            processingArr.push({
              nameId: fileNameOnly,
              curInfoTxt: curInfoTxtExtracted
                ? curInfoTxtExtracted
                : curInfoTxtExtracted,
            });
          }
        } else if (
          path.extname(fileName).toLowerCase() === ".tiff" ||
          path.extname(fileName).toLowerCase() === ".tif" ||
          path.extname(fileName).toLowerCase() === ".jpeg" ||
          path.extname(fileName).toLowerCase() === ".jpg" ||
          path.extname(fileName).toLowerCase() === ".png" ||
          path.extname(fileName).toLowerCase() === ".gif"
        ) {
          const parseMsg = "Got image: " + fileName;
          writeToLog(fileStat.name, parseMsg, false);
          const curBlob = await entry.buffer();
          const curPicName = fileName;
          if (itemIdx !== -1) {
            processingArr[itemIdx]["curPicName"] = curPicName;
            processingArr[itemIdx]["curBlob"] = curBlob;
          } else {
            processingArr.push({
              nameId: fileNameOnly,
              curPicName,
              curBlob,
            });
          }
          // console.log(curBlob);
        } else {
          const parseMsg = "Got unknown file: " + fileName;
          writeToLog(fileStat.name, parseMsg, false);
          entry.autodrain();
        }
      }

      // Resolving image and text name does not match
      const removingItemIndex = processingArr.findIndex(
        (el) => el.curInfoTxt && !(el.curBlob || el.curPicName)
      );
      const mergingItem = processingArr.find(
        (el) => !el.curInfoTxt && el.curBlob && el.curPicName
      );

      if (
        processingArr.length === 2 &&
        removingItemIndex !== -1 &&
        mergingItem
      ) {
        mergingItem["curInfoTxt"] = processingArr[removingItemIndex].curInfoTxt;
        processingArr.splice(removingItemIndex, 1);
      }

      processingArr.forEach(async (processItem) => {
        var text = processItem.curInfoTxt?.replace(/[|&;$%@"<>()+,]/g, "");
        text = text?.trim();
        text = text?.replace(/\s\s+/g, " ")?.trim();
        if (processItem.curBlob) {
          const parseMsg =
            "Writing text: " +
            (text ? text : "NO TEXT") +
            " to " +
            processItem.curPicName;
          writeToLog(fileStat.name, parseMsg, false);
          await processImg(
            processItem.curBlob,
            text,
            processItem.curPicName,
            fileStat.name
          );
        } else {
          const parseMsg = "Warn: No image found for " + processItem.nameId;
          writeToLog(fileStat.name, parseMsg, true);
          writeToParsed(fileStat.name);
        }
      });
      next();
    } catch (error) {
      writeToLog(fileStat.name, error, true);
      next();
    }
  });
});

walker.on("errors", (root, nodeStatsArray, next) => {
  writeToLog(
    "Unknown",
    `Error occurred: "In ${root}": ERROR "${
      Array.isArray(nodeStatsArray)
        ? nodeStatsArray.map((stat) => `${stat.error}`).join("; ")
        : nodeStatsArray.error
    }"`,
    true
  );
  next();
});

walker.on("end", () => {
  writeToLog("", "All Done!", false);
});
const processImg = async (buffer, text, filePath, zipName) => {
  const readPromise = await Jimp.read(buffer);
  const imageW = readPromise.bitmap.width;
  const imageH = readPromise.bitmap.height;
  const numberName = zipName.split(".")[0];
  // const descText = descsArr.find((desc) => {
  //   const re = /(sNo=)(.*)(\&Key=)/i;
  //   urlName = desc.url.match(re);
  //   return !!(urlName.includes(numberName) || numberName.includes(urlName));
  // })?.desc;

  try {
    const fileName = picPath + (text ? text : "") + " " + filePath;
    await readPromise.writeAsync(fileName); // save
    writeToLog(
      "",
      `Success: "creation of plain image ${filePath} in ${zipName}"`,
      false
    );
    // await new Promise((r) => setTimeout(r, 2000));
    let invertedColor = text
      ? invertColor(getAverageColor(imageW, readPromise))
      : "ffffff";
    const textColor = pickColor(invertedColor, colors);
    const textOffSetX = Math.ceil((72 * imageW) / 1920);
    const textOffSetY = Math.ceil((60 * imageW) / 1920);
    const offset = "+" + textOffSetX + "+" + textOffSetY;
    watermark.embedWatermarkWithCb(
      fileName,
      {
        text: text ? text : "",
        "override-image": true,
        font: "FZZhaoJSJSJF.TTF",
        align: "ltr",
        position: "NorthWest",
        pointsize: Math.ceil((imageW * 60) / 1920),
        color: "#" + textColor,
        offset: offset,
        weight: "Bold",
      },
      function (err) {
        if (!err) {
          if (!text) {
            const parseMsg = "Warn: No text found for " + filePath;
            writeToLog(zipName, parseMsg, false);
          }
          writeToLog(
            "",
            `Success: "creation of watermarked image ${filePath} in ${zipName}"`,
            false
          );
          writeToParsed(zipName);
        } else {
          writeToLog(
            "",
            `Error occurred: "creation watermark of ${filePath} in ${zipName}": ERROR "${err}"`,
            true
          );
        }
      }
    );
    return;
  } catch (e) {
    writeToLog(
      "",
      `Error occurred: "creation of plain image ${filePath} in ${zipName}": ERROR "${e}"`,
      true
    );
    return;
  }
};

function getAverageColor(imageW, jimpObj) {
  let R = 0;
  let G = 0;
  let B = 0;
  let A = 0;
  const sampleStartX = Math.ceil((72 * imageW) / 1920);
  const sampleStartY = Math.ceil((60 * imageW) / 1920);
  const sampleEndX = imageW - Math.ceil((72 * imageW) / 1920);
  const sampleEndY = Math.ceil((imageW * 60) / 1920) + sampleStartY;
  let counter = 0;
  for (let i = sampleStartX; i < sampleEndX; i += 4) {
    for (let j = sampleStartY; j < sampleEndY; j += 4) {
      const cRGBA = Jimp.intToRGBA(jimpObj.getPixelColor(i, j));
      counter++;
      R += cRGBA.r;
      G += cRGBA.g;
      B += cRGBA.b;
      A += cRGBA.a;
    }
  }
  R = (R / counter) | 0;
  G = (G / counter) | 0;
  B = (B / counter) | 0;
  A = (A / counter) | 0;
  return padZero(
    Jimp.rgbaToInt(R, G, B, A).toString(16).slice(0, -2) || "000000",
    6
  );
}

async function getZipEncodingCharsets(data, isContent) {
  let allBytes = [];
  if (isContent) {
    return detect(data);
  }
  await JSZip.loadAsync(data, {
    // @ts-ignore
    decodeFileName(bytes) {
      allBytes = allBytes.concat(bytes);
      return bytes.toString();
    },
  });
  return detect(allBytes);
}

/**
 * Return all decoded chars
 * @param data
 */
async function getZipEncodingCharsetNames(data, isContent) {
  let charsets = await getZipEncodingCharsets(data, isContent);
  if (charsets.length === 0) {
    return [];
  }
  const ignoreCharsetArr = [];
  charsets = charsets.filter((c) => !ignoreCharsetArr.includes(c.charsetName));
  const zhCharset = charsets.find((c) => c.lang === "zh");
  let charsetNames = [];
  if (zhCharset) {
    charsetNames.push(zhCharset.charsetName);
  }
  charsetNames.push("UTF-8");
  charsetNames.push("GB18030");
  charsetNames.push("Big5");
  charsetNames = charsetNames.concat(charsets.map((c) => c.charsetName));
  charsetNames = charsetNames.filter(
    (item, index, array) => array.indexOf(item) === index
  );
  return charsetNames;
}

function checknum(value) {
  const Regx = /^[A-Za-z0-9]*$/;
  return Regx.test(value);
}

function isMessyCode(strName) {
  const temp = strName?.replace(/\p{L}|\p{N}|_|-|\.|\/|\s|\（|\）/g, "");
  const ch = temp.split("");
  const chLen = ch ? ch.length : 0;
  for (let i = 0; i < chLen; i += 1) {
    const c = ch[i];
    if (!checknum(c)) {
      const str = ch[i];
      const patt1 = new RegExp(/[\u4e00-\u9fa5]+/);
      if (!patt1.test(str)) {
        return true;
      }
    }
  }
  return false;
}

async function getTheRightZip(data, charsets, isContent) {
  if (!charsets || charsets.length === 0) {
    return;
  }
  const charset = charsets.shift();
  if (!charset) {
    return;
  }
  let zip;

  if (isContent) {
    zip = iconv.decode(data, charset);
  } else {
    zip = await JSZip.loadAsync(data, {
      decodeFileName(bytes) {
        try {
          return iconv.decode(bytes, charset);
        } catch (e) {
          console.error(e);
        }
      },
    });
  }

  let str = "";
  if (isContent) {
    str = zip;
  } else {
    zip.forEach((rp) => {
      str += rp;
    });
  }

  const isHasMessyCode = isMessyCode(str);
  if (!isHasMessyCode) {
    return {
      zip,
      charset,
    };
  }
  return await getTheRightZip(data, charsets, isContent);
}

/**
 * Return decoded zip
 * No zip will be returned if failure
 * @param data
 */
async function getZipWithAutoDetectedCharset(data, isContent) {
  const charsets = await getZipEncodingCharsetNames(data, isContent);
  const result = await getTheRightZip(data, charsets, isContent).catch((e) =>
    console.error(e)
  );
  let zip;
  let charset = "";
  if (result) {
    zip = result.zip;
    charset = result.charset;
  }
  if (!zip) {
    charset = "utf-8";
    if (isContent) {
      zip = Buffer.from(data, "utf-8");
    } else {
      zip = await JSZip.loadAsync(data, {
        decodeFileName(bytes) {
          try {
            return Buffer.from(bytes, "utf-8");
          } catch (e) {
            console.error(e);
          }
        },
      });
    }
  }
  return {
    zip,
    charset,
  };
}

function invertColor(hex, bw) {
  hex = hex.toString();

  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "000000" : "FFFFFF";
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function luminanceDistance(color_a, color_b) {
  function luminance_f(red, green, blue) {
    // Source: https://en.wikipedia.org/wiki/Relative_luminance
    const luminance = Math.ceil(0.2126 * red + 0.7152 * green + 0.0722 * blue);
    return luminance;
  }

  const color_a_rgba = Jimp.intToRGBA(parseInt(color_a, 16));
  const color_b_rgba = Jimp.intToRGBA(parseInt(color_b, 16));

  return Math.abs(
    luminance_f(color_a_rgba["r"], color_a_rgba["g"], color_a_rgba["b"]) -
      luminance_f(color_b_rgba["r"], color_b_rgba["g"], color_b_rgba["b"])
  );
}

function pickColor(baseColor, colorArray) {
  let nearest_distance = null;
  let nearest_color = null;
  for (let test_color of colorArray) {
    let test_distance = luminanceDistance(test_color, baseColor);
    if (nearest_distance) {
      if (nearest_distance > test_distance) {
        // found a closer color
        nearest_distance = test_distance;
        nearest_color = test_color;
      }
    } else {
      nearest_color = test_color;
      nearest_distance = test_distance;
    }
  }
  return nearest_color;
}

function strLen(str) {
  var count = 0;
  for (var i = 0, len = str.length; i < len; i++) {
    count += str.charCodeAt(i) < 256 ? 1 : 2;
  }
  return count;
}
