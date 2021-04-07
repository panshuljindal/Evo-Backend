const User = require("../../models/user");
const Login = require("../../models/logins");
const Reset = require("../../models/reset");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const { error } = require("console");
const app = express();
var getIP = require("ipware")().get_ip;
const mailgun = require("mailgun-js");

async function signupFunction(req, res, next) {
  //firstly salt the hashing for the password
  //genSalt is math.pow(2, value)
  const salt = await bcrypt.genSalt(10);
  //hash the password
  hashedpassword = await bcrypt.hash(req.body.password, salt);
  everify = await bcrypt.hash(req.body.email + Date.now(), salt);

  const emailAlreadyExists = await User.findOne({ email: req.body.email });

  var flag = 0;
  if (emailAlreadyExists && req.body.email !== undefined) {
    res.status(400).json({
      success: false,
      message: "This Email Already exists!",
    });
    flag++;
  }

  async function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
  }

  const userData = {
    ...req.body,
    password: hashedpassword,
    name: await titleCase(req.body.name),
    everify: everify,
  };

  {
    var user = new User({
      ...userData,
    });
  }

  try {
    if (flag == 0) {
      const userSignup = await user.save();
      const payload = {
        _id: userSignup._id,
      };

      //creating jwt token
      jwt.sign(
        payload,
        process.env.JWT_KEY,
        { expiresIn: 600 },
        (err, token) => {
          if (err) {
            console.log(err);
          } else {
            console.log(token);
          }
        }
      );

      //MAILGUN PACKAGE

      var api_key = process.env.MAILGUN_API_KEY;
      var domain = process.env.MAILGUN_DOMAIN;
      console.log(domain);
      const mg = mailgun({ apiKey: api_key, domain: domain });

      var data = {
        from: "GlobalCert <me@samples.mailgun.org>",
        to: req.body.email,
        subject: "Email Verification",
        html: `Click on the link to verify your account <a href='http://localhost:5500/user/verify/${userSignup.everify}'>Click Here</a>`,
      };

      mg.messages().send(data, function (error, body) {
        if (error) {
          console.log(error);
          res.status(400).send({
            message: "Error in sending Email!",
          });
        } else {
          console.log("Email successfully sent!");
          res.status(200).send({
            message: "Email has been sent",
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: err.message,
    });
  }
}

//login

async function loginFunction(req, res, next) {
  try {
    //check whether email exists
    const user = await User.findOne({ email: req.body.email });
    const checkpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!user) {
      res.status(400).send({
        message: "Email not found!",
      });
    }

    //compare the passwords
    else if (!checkpassword) {
      res.status(403).send({
        message: "Password is incorrect!",
      });
    } else {
      // create token and add it to the header file
      const token = jwt.sign({ _id: user.id }, process.env.JWT_KEY, {
        expiresIn: 6000,
      });
      var logindata = {
        logintime: Date.now(),
        userid: user._id,
        browser: req.headers["user-agent"],
        ip: getIP(req).clientIp,
      };
      const login = new Login({ ...logindata });
      var log = await login.save();
      res.header("auth-token", token).json({
        Token: token,
        message: "You have successfully logged in!",
      });
    }
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
}

async function verifyEmail(req, res, next) {
  try {
    await User.findOneAndUpdate(
      { everify: req.params.everify },
      { isEmailVerified: true },
      (err, result) => {
        if (err)
          res.send({ message: "There was an error verifying your email!" });
        else res.send({ message: "Your email has been verified!" });
      }
    );
  } catch (error) {
    res.status(400).send({ error: error });
  }
}

async function passwordReset(req, res, next) {
  const user = await User.findOne({ email: req.body.email }).then(
    async (user) => {
      if (user == null) res.status(401).send({ message: "User not found!" });
      else {
        var resetdata = {
          userid: user._id,
          browser: req.headers["user-agent"],
          ip: getIP(req).clientIp,
          requestTime: Date.now(),
        };

        const reset = new Reset({ ...resetdata });
        const rest = await reset.save();

        user.resetExpires = Date.now() + 300000;

        await user.save();

        var api_key = process.env.MAILGUN_API_KEY;
        var domain = process.env.MAILGUN_DOMAIN;
        const mg = mailgun({ apiKey: api_key, domain: domain });

        var data = {
          from: "GlobalCert <me@samples.mailgun.org>",
          to: req.body.email,
          subject: "Password Reset",
          html: `Click on the link to update your password: `,
        };

        mg.messages().send(data, function (error, body) {
          try {
            console.log("Email successfully sent!");
            res.status(200).send({
              message: "Email has been sent",
              everify: user.everify,
            });
          } catch (error) {
            console.log(error);
            res.status(400).send({
              message: "Error in sending Email!",
            });
          }
        });
      }
    }
  );
}

async function updatePassword(req, res, next) {
  try {
    var everify = req.params.everify;
    var newpassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    var hashedpassword = (hashedpassword = await bcrypt.hash(
      newpassword,
      salt
    ));
    await User.findOneAndUpdate(
      { everify: everify, resetExpires: { $gt: Date.now() } },
      { password: hashedpassword },
      function (err, result) {
        if (!result) {
          res.status(400).send({ message: "Time exceeded try again!" });
        } else {
          res.status(200).send({ message: " password updated succesfully" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send({ err });
  }
}


module.exports = {
  signupFunction,
  loginFunction,
  verifyEmail,
  passwordReset,
  updatePassword,
};
