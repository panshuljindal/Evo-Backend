const Event = require("../../models/event");
const Club = require("../../models/club");
const Combined = require("../../models/combined");
const cloudinary = require("cloudinary").v2;
const { isValidObjectId } = require("mongoose");
require("dotenv").config();
cloudinary.config({
  cloud_name: String(process.env.cloud_name),
  api_key: String(process.env.api_key),
  api_secret: String(process.env.api_secret),
});
async function createEvent(req, res, next) {
  try {
    var poster = "";
    if (req.body.poster && req.body.poster.length != 0)
      await cloudinary.uploader.upload(
        "data:image/jpeg;base64," + req.body.poster,
        function (error, result) {
          if (result) poster = result.url;
          else throw error;
        }
      );
    let eventData = {
      ...req.body,
      clubId: req.club._id,
      poster: poster,
      clubName: req.club.name,
    };
    const event = new Event(eventData);
    const createdEvent = await event.save();
    await Club.findByIdAndUpdate(req.club._id, {
      $push: { events: createdEvent._id },
    });
    res.status(200).send(createdEvent);
    let combinedData = {
      eventId: createdEvent._id,
      poster: createdEvent.poster,
      timestamp: createdEvent.timestamp,
      type: 2,
      eventName: createdEvent.name,
      clubId: createdEvent.clubId,
      eventType: createdEvent.eventType,
    };
    const newObject = new Combined(combinedData);
    await newObject.save();
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getAllEvents(req, res, next) {
  try {
    var query = {};
    if (req.query.paid && req.query.paid.length != 0)
      query.isPaid = req.query.paid;
    if (req.query.gravitas && req.query.gravitas.length != 0)
      query.isGravitas = req.query.gravitas;
    if (req.query.riviera && req.query.riviera.length != 0)
      query.isRiviera = req.query.riviera;
    if (req.query.hack && req.query.hack.length != 0)
      query.isHack = req.query.hack;
    if (req.query.type && req.query.type.length != 0)
      query.eventType = req.query.type;
    if (req.query.club && req.query.club.length != 0)
      query.clubId = req.query.club;
    const events = await Event.find(query, {
      name: 1,
      poster: 1,
      likes: 1,
      clubId: 1,
      clubName: 1,
      eventType: 1,
    })
      .populate({ path: "clubId", select: "logo" })
      .exec();
    const metadata = await Event.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
    ]);
    res.status(200).send({ data: events, metadata: metadata });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function likeEvent(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    await Event.findByIdAndUpdate(req.body.eventId, { $inc: { likes: 1 } });
    res.status(200).send({ message: "Likes updated!" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getEventById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id))
      throw { error: "Please provide a valid event id" };
    const event = await Event.findById(req.params.id);
    if (event) res.status(200).send({ event });
    else res.status(404).send({ message: "Event does not exist" });
  } catch (error) {
    res.status(500).send(error);
  }
}
async function getPopularEvents(req, res, next) {
  try {
    const events = await Event.aggregate([
      {
        $lookup: {
          from: "clubs",
          localField: "clubId",
          foreignField: "_id",
          as: "club",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$club", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $match: { isPartner: true },
      },
      {
        $group: {
          _id: "$eventType",
          events: {
            $push: {
              name: "$name",
              poster: "$poster",
              eventId: "$_id",
            },
          },
        },
      },
    ]);

    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
}

async function searchCombined(req, res, next) {
  try {
    let sk = req.body.input;
    const data = await Combined.find({
      $or: [
        { eventName: { $regex: sk, $options: "i" } },
        { clubName: { $regex: sk, $options: "i" } },
      ],
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
}
module.exports = {
  createEvent,
  getAllEvents,
  likeEvent,
  getPopularEvents,
  getEventById,
  searchCombined,
};
