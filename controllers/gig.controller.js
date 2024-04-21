import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const addGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can add a new gig"));

  const newGig = new Gig({
    ...req.body,
    userId: req.userId,
  });

  try {
    const savedGig = await newGig.save();
    return res.status(200).json(savedGig);
  } catch (error) {
    next(error);
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gigs"));

    await Gig.findByIdAndDelete(req.params.id);
    return res.status(200).json("Gig has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return next(createError(404, "Gig not found"));
    return res.status(200).json(gig);
  } catch (error) {
    next(error);
  }
};

export const getGigs = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q?.userId && { userId: q.userId }),
    ...(q?.cat && { cat: q.cat }),
    ...((q?.min || q?.max) && {
      price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) },
    }),
    ...(q?.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    return res.status(200).json(gigs);
  } catch (error) {
    next(error);
  }
};
