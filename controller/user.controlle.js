import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, channelName, phone } = req.body;
  try {
    console.log("request coming");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoUrl.tempFilePath,
    );
    console.log("IMAGE👉", uploadImage);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      password: hashedPassword,
      channelName: channelName,
      phone: phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });

    let user = await newUser.save();

    res.status(201).json({
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) {
      return res.status(401).json({ message: "invalid Credentials" });
    }
    const token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        channelName: existingUser.channelName,
        phone: existingUser.phone,
        logoId: existingUser.logoId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" },
    );

    res.status(200).json({
      _id: existingUser._id,
      email: existingUser.email,
      channelName: existingUser.channelName,
      phone: existingUser.phone,
      logoId: existingUser.logoId,
      logoUrl: existingUser.logoUrl,
      token: token,
      subscribedChannels: existingUser.subscribedChannels,
      subscribers: existingUser.subscribers,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};


