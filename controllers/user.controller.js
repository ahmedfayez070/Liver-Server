import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId === user._id.toString()) {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("User account has been deleted");
    } else {
      return next(createError(403, "You can delete only your account"));
    }
  } catch (error) {
    next(error);
  }
};
