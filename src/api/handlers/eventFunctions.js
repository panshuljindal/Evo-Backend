const Event = require("../../models/event");
const Club = require("../../models/club");
const Combined = require("../../models/combined");
const cloudinary = require("cloudinary").v2;
const { isValidObjectId, Mongoose, Types } = require("mongoose");
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
        req.body.poster,
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
      price: createdEvent.price,
    };
    const newObject = new Combined(combinedData);
    await newObject.save();
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    if (!isValidObjectId(req.params.eventId))
      throw "Please provide a valid event id";
    var poster = "";
    let eventData = {};
    if (req.body.poster && req.body.poster.length != 0) {
      await cloudinary.uploader.upload(
        req.body.poster,
        function (error, result) {
          if (result) poster = result.url;
          else throw error;
        }
      );
      eventData = {
        ...req.body,
        poster: poster,
      };
    } else {
      eventData = {
        ...req.body,
      };
    }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, {
      $set: eventData,
    });
    res.status(200).send(updatedEvent);
    let combinedData = {
      eventId: updatedEvent._id,
      poster: updatedEvent.poster,
      timestamp: updatedEvent.timestamp,
      type: 2,
      eventName: updatedEvent.name,
      clubId: updatedEvent.clubId,
      price: updatedEvent.price,
    };
    await Combined.findOneAndUpdate(
      { eventId: updatedEvent._id },
      combinedData
    );
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getAllEvents(req, res, next) {
  try {
    var query = {};
    if (req.query.paid && req.query.paid.length != 0)
      query.isPaid = req.query.paid;
    if (req.query.type && req.query.type.length != 0 && req.query.type != "all")
      query.eventType = req.query.type;
    var page = req.query.page;
    const events = await Event.find(query, {
      name: 1,
      poster: 1,
      likes: 1,
      clubId: 1,
      clubName: 1,
      eventType: 1,
    })
      .populate({ path: "clubId", select: "logo isPartner" })
      .skip(page * 10)
      .limit(10)
      .exec();
    const metadata = await Event.aggregate([
      {
        $unwind: {
          path: "$eventType",
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: {
            $sum: 1,
          },
        },
      },
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

async function dislikeEvent(req, res, next) {
  try {
    if (!req.body.eventId || req.body.eventId.length == 0) {
      throw { error: "Please provide a valid event id" };
    }
    await Event.findByIdAndUpdate(req.body.eventId, { $inc: { likes: -1 } });
    res.status(200).send({ message: "Likes updated!" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getEventById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id))
      throw { error: "Please provide a valid event id" };
    const event = await Event.findById(req.params.id)
      .populate({ path: "clubId", select: "logo isPartner" })
      .exec();
    const viewedEvent = await Event.findByIdAndUpdate(req.params.id,{
      $inc:{
        views: 1
      }
    })
    
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
        $unwind: {
          path: "$eventType",
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
    var page = req.query.page;
    if (req.query.type && (req.query.type == 1 || req.query.type == 2)) {
      data = await Combined.find({
        type: req.query.type,
        $or: [
          { eventName: { $regex: sk, $options: "i" } },
          { clubName: { $regex: sk, $options: "i" } },
        ],
      })
        .skip(page * 10)
        .limit(10);
    } else {
      data = await Combined.find({
        $or: [
          { eventName: { $regex: sk, $options: "i" } },
          { clubName: { $regex: sk, $options: "i" } },
        ],
      })
        .skip(page * 10)
        .limit(10);
    }

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
}

async function getEventByClub(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id))
      throw { error: "Please provide a valid club id" };
    var query = { clubId: req.params.id };
    if (req.query.paid && req.query.paid.length != 0)
      query.isPaid = req.query.paid;
    if (req.query.type && req.query.type.length != 0 && req.query.type != "all")
      query.eventType = req.query.type;
    const events = await Event.find(query).select(
      "name poster timestamp eventCost clubName"
    );
    if (events) {
      const data = events;
      const mdata = await Event.aggregate([
        {
          $unwind: {
            path: "$eventType",
          },
        },
        { $match: { clubId: Types.ObjectId(req.params.id) } },
        { $group: { _id: "$eventType", count: { $sum: 1 } } },
      ]);
      res.status(200).send({ data: data, metadata: mdata });
    } else res.status(404).send({ message: "Event does not exist" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function getSavedEvents(req, res, next) {
  try {
    if (req.body.events.length == 0 || !req.body.events)
      throw "No events saved";
    req.body.events.forEach((e) => {
      if (!isValidObjectId(e))
        throw { error: "array contains invalid object ids" };
    });
    const events = await Event.find(
      { _id: { $in: req.body.events } },
      {
        name: 1,
        poster: 1,
        likes: 1,
        clubId: 1,
        clubName: 1,
        eventType: 1,
      }
    )
      .populate({ path: "clubId", select: "logo" })
      .exec();
    res.status(200).send(events);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    if (!isValidObjectId(req.params.eventId))
      throw "Please provide a valid event id";
    console.log(req.params.eventId)
    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.eventId,
      clubId: req.club._id,
    });
    console.log(deletedEvent)
    if (!deletedEvent) throw "Event does not exist";
    res.status(200).send({ message: "Event deleted" });
    await Combined.findOneAndDelete({ eventId: req.params.eventId });
    await Club.findByIdAndUpdate(req.club._id, {
      $pull: { events: req.params.eventId },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
module.exports = {
  createEvent,
  getAllEvents,
  likeEvent,
  getPopularEvents,
  getEventById,
  searchCombined,
  getEventByClub,
  getSavedEvents,
  dislikeEvent,
  deleteEvent,
  updateEvent,
};
