import Speaker from "../models/Speaker.js";
import Follow from "../models/Follow.js";

export const getSpeakers = async (req, res) => {
  const { country, q } = req.query;
  const filter = {};

  if (country) filter.country = country;
  if (q) filter.name = new RegExp(q, "i");

  const speakers = await Speaker.find(filter).lean();
  res.json(speakers);
};

export const followSpeaker = async (req, res) => {
  const { speakerId } = req.params;
  const { userId } = req.body;

  await Follow.updateOne(
    { userId, speakerId },
    { userId, speakerId },
    { upsert: true }
  );

  await Speaker.findByIdAndUpdate(speakerId, {
    $inc: { followersCount: 1 }
  });

  res.json({ success: true });
};