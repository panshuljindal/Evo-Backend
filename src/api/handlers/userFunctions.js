const { isValidObjectId } = require("mongoose");
const User = require("../../models/user");
const Event = require("../../models/event");
async function getData(req, res, next) {
  try {
    if (!req.params.id || !isValidObjectId(req.params.id)) {
      throw { error: "Please provide a valid user id" };
    }
    const userData = await User.findById(req.params.id);
    if (!userData) {
      res.status(400).send({ message: "User does not exist" });
    } else {
      res.status(200).send(userData);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function registerDevice(req, res, next) {
  try {
    const uD = {};
    const uData = new User(uD);
    const createdUser = await uData.save();
    if (createdUser._id) {
      res.status(200).send({ id: createdUser._id });
    } else res.status(400).send({ message: "error creating user" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function likeEventNew(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    if (!req.body.id || !isValidObjectId(req.body.id)) {
      throw { error: "Please provide a valid user id" };
    }
    await Event.findByIdAndUpdate(req.body.eventId, { $inc: { likes: 1 } });
    const u = await User.updateOne(
      { _id: req.body.id },
      { $addToSet: { likedEvents: req.body.eventId } }
    );
    res.status(200).send({ message: "Likes updated!" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function dislikeEventNew(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    if (!req.body.id || !isValidObjectId(req.body.id)) {
      throw { error: "Please provide a valid user id" };
    }
    await Event.findByIdAndUpdate(req.body.eventId, { $inc: { likes: -1 } });
    await User.updateOne(
      { _id: req.body.id },
      { $pull: { likedEvents: req.body.eventId } }
    );
    res.status(200).send({ message: "Likes updated!" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function interestedEventNew(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    if (!req.body.id || !isValidObjectId(req.body.id)) {
      throw { error: "Please provide a valid user id" };
    }
    await User.updateOne(
      { _id: req.body.id },
      { $addToSet: { interestedEvents: req.body.eventId } }
    );
    res.status(200).send({ message: "List updated!" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function disInterestedEventNew(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    if (!req.body.id || !isValidObjectId(req.body.id)) {
      throw { error: "Please provide a valid user id" };
    }
    await User.updateOne(
      { _id: req.body.id },
      { $pull: { interestedEvents: req.body.eventId } }
    );
    res.status(200).send({ message: "List updated!" });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  dislikeEventNew,
  disInterestedEventNew,
  likeEventNew,
  interestedEventNew,
  getData,
  registerDevice,
};
