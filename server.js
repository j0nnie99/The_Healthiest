const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use("/script", express.static(__dirname + "/script"));

var db;
const MongoClient = require("mongodb").MongoClient;
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(
  "mongodb+srv://admin:health1234@cluster0.g6wfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  function (err, client) {
    if (err) {
      return console.log(err);
    }
    db = client.db("The_Healthiest");

    //ejs 설치
    app.set("view engine", "ejs");

    //연결 성공시
    app.listen(8080, function () {
      console.log("listening on 8080");
    });
    app.get("/challenge/stamp", function (req, res) {
      db.collection("challenge")
        .find()
        .toArray(function (err, result) {});
      res.sendFile(__dirname + "/views/challenge/challenge-stamp.html");
    });
  }
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/main/main_before_login.html");
});

app.get("/main", function (req, res) {
  res.sendFile(__dirname + "/views/main/main_after_login.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/views/main/login.html");
});

app.get("/join", function (req, res) {
  res.sendFile(__dirname + "/views/main/join.html");
});

app.get("/info", function (req, res) {
  res.sendFile(__dirname + "/views/main/info_before_login.html");
});

app.get("/health", function (req, res) {
  res.sendFile(__dirname + "/views/main/health_before_login.html");
});

app.get("/community_main", function (req, res) {
  res.sendFile(__dirname + "/views/main/communitymain_before_login.html");
});

app.get("/challenge_main", function (req, res) {
  res.sendFile(__dirname + "/views/main/challengemain_before_login.html");
});

app.get("/hometraining_main", function (req, res) {
  res.sendFile(__dirname + "/views/main/hometraining_before_login.html");
});

app.get("/info2", function (req, res) {
  res.sendFile(__dirname + "/views/main/info_after_login.html");
});

app.get("/health2", function (req, res) {
  res.sendFile(__dirname + "/views/main/health_after_login.html");
});

app.get("/hometraining_main2", function (req, res) {
  res.sendFile(__dirname + "/views/main/hometraining_after_login.html");
});

app.get("/community", function (req, res) {
  res.render("community/comm_list.ejs");
});

app.get("/community/free", function (req, res) {
  res.render("community/comm_free.ejs");
});

app.get("/community/bodytype", function (req, res) {
  res.render("community/comm_body.ejs");
});

app.get("/community/crew", function (req, res) {
  res.render("community/comm_crew.ejs");
});

app.get("/community/tips", function (req, res) {
  res.render("community/comm_tips.ejs");
});

app.get("/community/meal", function (req, res) {
  res.render("community/comm_meal.ejs");
});

app.get("/community/grouporder", function (req, res) {
  res.render("community/comm_go.ejs");
});

app.get("/community/write", function (req, res) {
  res.render("community/comm_write.ejs");
});

app.get("/challenge/introduce", function (req, res) {
  res.sendFile(__dirname + "/views/challenge/challenge-introduce.html");
});

app.get("/challenge/certification", function (req, res) {
  res.sendFile(__dirname + "/views/challenge/challenge-certification.html");
});

app.get("/challenge/payment", function (req, res) {
  res.sendFile(__dirname + "/views/challenge/challenge-payment.html");
});

let multer = require("multer");
const { Db } = require("mongodb");
var date;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploadImage");
  },
  filename: function (req, file, cb) {
    date = new Date().getDate();
    cb(null, date + ".jpg");
  },
});

var upload = multer({ storage: storage });

app.post(
  "/challenge/certification",
  upload.single("imageInput"),
  function (req, res) {
    console.log("upload complete");
    console.log(req.file);
    res.sendFile(__dirname + "/views/challenge/challenge-payment.html");
  }
);

app.get("/challenge/stamp", function (req, res) {
  res.sendFile(__dirname + "/views/challenge/challenge-stamp.html");
});

app.get("/mypage", function (req, res) {
  res.render("mypage/mypage.ejs");
});

app.get("/mypage/ask", function (req, res) {
  res.render("mypage/askTheHealthiest.ejs");
});

app.get("/mypage/bodytype", function (req, res) {
  res.render("mypage/bodytype.ejs");
});

app.get("/mypage/challengeExsisted", function (req, res) {
  res.render("mypage/challengeExsisted.ejs");
});

app.get("/mypage/challengeNone", function (req, res) {
  res.render("mypage/challengeNone.ejs");
});

app.get("/mypage/mail", function (req, res) {
  res.render("mypage/mail.ejs");
});

app.get("/mypage/mailbox", function (req, res) {
  res.render("mypage/mailbox.ejs");
});

app.get("/mypage/mywriting", function (req, res) {
  res.render("mypage/mywriting.ejs");
});

app.get("/mypage/revisingwriting", function (req, res) {
  res.render("mypage/revisingwriting.ejs");
});
app.get("/mypage/settingAccount", function (req, res) {
  res.render("mypage/setting.ejs");
});
app.get("/mypage/settingCommunity", function (req, res) {
  res.render("mypage/setting2.ejs");
});
app.get("/mypage/symptom", function (req, res) {
  res.render("mypage/symptom.ejs");
});

app.post("/add", function (req, res) {
  console.log("전송완료");
  console.log(req.body);
  db.collection("User").insertOne({
    user_id: req.body.id,
    pwd: req.body.pwd,
    name: req.body.name,
    birth: req.body.birthday,
    nickname: req.body.nickname,
    email: req.body.email,
    agree: req.body.check_info,
  });
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("/main");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pwd",
      session: true,
      passReqToCallback: false,
    },
    function (input_id, input_pwd, done) {
      console.log(input_id, input_pwd);
      db.collection("User").findOne(
        { user_id: input_id },
        function (err, result) {
          console.log(result);
          if (err) return done(err);
          if (!result) {
            console.log(5);
            return done(null, false, {
              message: "존재하지 않는 아이디입니다.",
            });
          }
          if (input_pwd == result.pwd) {
            return done(null, result);
          } else {
            return done(null, false, { message: "비밀번호가 틀렸습니다." });
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});

passport.deserializeUser(function (id, done) {
  done(null, {});
});
