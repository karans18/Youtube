import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import mongoose from "mongoose";


export const signup = async (req, res) => {
  try {
    console.log("request coming");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const uploadImage = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath,
    );
    console.log("IMAGE👉", uploadImage);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
      channelName: req.body.channelName,
      phone: req.body.phone,
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
