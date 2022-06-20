const express = require("express");
const port = process.env.PORT || 4546;
const app = express();
const multer = require("multer");
const path = require("path");

const uploadPath = path.join(__dirname, "/uploads");
console.log(uploadPath);

app.use(express.json());
app.use("/assets", express.static("assets"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: fileStorageEngine,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext == ".pdf") {
      return cb("You can't Upload Other File!", false);
    }
    cb(null, true);
  },
}).single("file1");

app.get("/", (req, res) => {
  res.render("Home", { name: "Amit" });
});
const fileUploading = async (req, res, next) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        req.uploadError = err.message;
      }
      next();
    });
  } catch (err) {
    console.log("%%%%%%%%%%%%%ERROR&&&&&&&&&&&&");
    console.log(err);
  }
};

app.post("/stream", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    res.render("Home");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
app.post("/multer", fileUploading, async (req, res) => {
  try {
    if (req.uploadError) {
      console.log("Here!");
      return res.render("Home", { error: req.uploadError });
    }
    res.render("Home", { masg: "File Uploaded  using multer!" });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});






app.listen(port, () => {
  console.log(`App is Running On http://localhost:${port}`);
});
