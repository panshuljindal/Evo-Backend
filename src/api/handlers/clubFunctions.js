const Club = require("../../models/club");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const Combined = require("../../models/combined");
const app = express();
const mailgun = require("mailgun-js");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { isValidObjectId } = require("mongoose");
cloudinary.config({
  cloud_name: String(process.env.cloud_name),
  api_key: String(process.env.api_key),
  api_secret: String(process.env.api_secret),
});

async function signupFunction(req, res, next) {
  //firstly salt the hashing for the password
  //genSalt is math.pow(2, value)
  const salt = await bcrypt.genSalt(10);
  //hash the password
  hashedpassword = await bcrypt.hash(req.body.password, salt);
  const emailAlreadyExists = await Club.findOne({ email: req.body.email });

  var flag = 0;
  var backdrop = "";
  var logo = "";
  if (emailAlreadyExists && req.body.email !== undefined) {
    res.status(400).json({
      success: false,
      message: "This Email Already exists!",
    });
    flag++;
  }
  if (req.body.logo && req.body.logo.length != 0)
    await cloudinary.uploader.upload(
      "data:image/jpeg;base64," + req.body.logo,
      function (error, result) {
        if (result) logo = result.url;
        else flag++;
      }
    );
  if (req.body.backdrop && req.body.backdrop.length != 0)
    await cloudinary.uploader.upload(
      "data:image/jpeg;base64," + req.body.backdrop,
      function (error, result) {
        if (result) backdrop = result.url;
        else flag++;
      }
    );
  const clubData = {
    ...req.body,
    password: hashedpassword,
    logo: logo,
    backdrop: backdrop,
  };
  var club = new Club({
    ...clubData,
  });

  try {
    if (flag == 0) {
      const clubSignup = await club.save();
      const payload = {
        _id: clubSignup._id,
        name: clubSignup.name,
      };
      res.status(200).send({
        message:
          "Account created successfully.Please contact Team Evo to verify the same.",
      });
      if (f == 0) {
        let combinedData = {
          poster: clubSignup.poster,
          type: 1,
          clubName: clubSignup.clubName,
          clubId: clubSignup._id,
          clubLogo: clubSignup.logo,
          clubBackdrop: clubSignup.backdrop,
          clubName: clubSignup.name,
        };
        const newObject = new Combined(combinedData);
        await newObject.save();
      }
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
    const club = await Club.findOne({ email: req.body.email });
    const checkpassword = await bcrypt.compare(
      req.body.password,
      club.password
    );
    if (!club) {
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
      const token = jwt.sign(
        { _id: club._id, name: club.name },
        process.env.JWT_KEY,
        {
          expiresIn: 6000,
        }
      );
      res.header("auth-token", token).json({
        token: token,
        id: club._id,
        message: "You have successfully logged in!",
      });
    }
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
}
async function editProfile(req, res, next) {
  try {
    const id = req.params.clubId;
    if (!id) {
      res.status(404).send("ClubID not found");
    }
    const club = await Club.findById(id);
    if (!club) {
      res.status(404).send("Club not found");
    }
    let logo = club.logo;
    let backdrop = club.backdrop;
    if (req.body.logo && req.body.logo.length != 0) {
      await cloudinary.uploader.upload(req.body.logo, function (error, result) {
        if (result) logo = result.url;
        else console.log(error);
      });
    } else {
    }
    if (req.body.backdrop && req.body.backdrop.length != 0)
      await cloudinary.uploader.upload(
        req.body.backdrop,
        function (error, result) {
          if (result) backdrop = result.url;
          else console.log(error);
        }
      );
    const eventData = {
      ...req.body,
      logo,
      backdrop,
    };
    const updatedClub = await Club.findByIdAndUpdate(club._id, {
      $set: eventData,
    });
    res.status(200).send(updatedClub);
    let combinedData = {
      poster: updatedClub.poster,
      type: 1,
      clubName: updatedClub.clubName,
      clubId: updatedClub._id,
      clubLogo: updatedClub.logo,
      clubBackdrop: updatedClub.backdrop,
      clubName: updatedClub.name,
    };
    await Combined.updateOne({ clubId: club._id }, combinedData);
  } catch (error) {
    res.status(500).send(error);
  }
}
async function verifyEmail(req, res, next) {
  try {
    await Club.findOneAndUpdate(
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

// async function passwordReset(req, res, next) {
//   const club = await Club.findOne({ email: req.body.email }).then(
//     async (club) => {
//       if (club == null) res.status(401).send({ message: "club not found!" });
//       else {
//         var resetdata = {
//           clubid: club._id,
//           browser: req.headers["club-agent"],
//           ip: getIP(req).clientIp,
//           requestTime: Date.now(),
//         };

//         const reset = new Reset({ ...resetdata });
//         const rest = await reset.save();

//         club.resetExpires = Date.now() + 300000;

//         await club.save();

//         var api_key = process.env.MAILGUN_API_KEY;
//         var domain = process.env.MAILGUN_DOMAIN;
//         const mg = mailgun({ apiKey: api_key, domain: domain });

//         var data = {
//           from: "GlobalCert <me@samples.mailgun.org>",
//           to: req.body.email,
//           subject: "Password Reset",
//           html: `Click on the link to update your password: `,
//         };

//         mg.messages().send(data, function (error, body) {
//           try {
//             console.log("Email successfully sent!");
//             res.status(200).send({
//               message: "Email has been sent",
//               everify: club.everify,
//             });
//           } catch (error) {
//             console.log(error);
//             res.status(400).send({
//               message: "Error in sending Email!",
//             });
//           }
//         });
//       }
//     }
//   );
// }

async function updatePassword(req, res, next) {
  try {
    var everify = req.params.everify;
    var newpassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    var hashedpassword = (hashedpassword = await bcrypt.hash(
      newpassword,
      salt
    ));
    await Club.findOneAndUpdate(
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
    res.status(400).send({ error: error });
  }
}

async function getParticularClub(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) throw "Please provide a valid club id";
    const club = await Club.findById(req.params.id)
      .populate("events", "name poster timestamp eventCost clubName")
      .exec();
    res.status(200).send(club);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getClubevents(req, res, next) {
  try {
    if (!isValidObjectId(req.params.clubId))
      throw "Please provide a valid club id";
    var likedEvents = await Club.findById(req.params.clubId)
      .populate("events", "-createdAt", null, { sort: { likes: -1 } })
      .exec();
    var viewedEvents = await Club.findById(req.params.clubId)
      .populate("events", "-createdAt", null, { sort: { views: -1 } })
      .exec();
    var upcomingEvents = await Club.findById(req.params.clubId)
      .populate("events")
      .exec();
    res.status(200).send({
      upcomingEvents: upcomingEvents.events,
      likedEvents: likedEvents.events,
      viewedEvents: viewedEvents.events,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

module.exports = {
  signupFunction,
  loginFunction,
  verifyEmail,
  updatePassword,
  getParticularClub,
  getClubevents,
  editProfile,
};
