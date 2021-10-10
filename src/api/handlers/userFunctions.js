const { isValidObjectId } = require("mongoose");
const User = require("../../models/user");
const Event = require("../../models/event");
async function getData(req, res, next) {
  try {
    if (!req.params.uuid) {
      throw { error: "Please provide a valid user id" };
    }
    const userData = await User.findOne({ uuid: req.params.uuid });
    if (!userData) {
      const uD = { uuid: req.params.uuid };
      const uData = new User(uD);
      const createdUser = await uData.save();
      res.status(200).send(createdUser);
    } else {
      res.status(200).send(userData);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function likeEventNew(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    if (!req.body.uuid) {
      throw { error: "Please provide a valid user id" };
    }
    await Event.findByIdAndUpdate(req.body.eventId, { $inc: { likes: 1 } });
    const u = await User.updateOne(
      { uuid: req.body.uuid },
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
    if (!req.body.uuid) {
      throw { error: "Please provide a valid user id" };
    }
    await Event.findByIdAndUpdate(req.body.eventId, { $inc: { likes: -1 } });
    await User.updateOne(
      { uuid: req.body.uuid },
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
    if (!req.body.uuid) {
      throw { error: "Please provide a valid user id" };
    }
    await User.updateOne(
      { uuid: req.body.uuid },
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
    if (!req.body.uuid) {
      throw { error: "Please provide a valid user id" };
    }
    await User.updateOne(
      { uuid: req.body.uuid },
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
};
