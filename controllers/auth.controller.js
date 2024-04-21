import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import createError from "../utils/createError.js";
import User from "../models/user.model.js";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json("User has been created");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong username or password"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT
    );

    const { password, ...others } = user._doc;
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return res
    .clearCookie("token", { sameSite: "none", secure: true })
    .status(200)
    .json("User has logged out");
};
