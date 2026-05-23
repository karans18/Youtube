import mongoose from "mongoose";
import Video from "../model/video.model.js";
import User from "../model/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({ error: "Video and Thumbanil is required" });
    }

    const videoUpload = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        resource_type: "video",
        folder: "videos",
      },
    );

    const thumbnailUpload = await cloudinary.uploader.upload(
      req.files.thumbnail.tempFilePath,
      {
        folder: "thumbnail",
      },
    );
    const newVideo = new Video({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      user_id: req.user._id,
      category,
      tags: tags ? tags.split(",") : [],
      videoId: videoUpload.public_id,
      videoUrl: videoUpload.secure_url,
      thumbnailUrl: thumbnailUpload.secure_url,
      thumbnailId: thumbnailUpload.public_id,
    });
    await newVideo.save();
    res.status(201).json({
      message: "video Uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};

/**
 * Only Metan deta like description tag title Etc will changed
 *
 */
export const updateVideo = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const videoId = req.params.id;
    const video = await Video.findById(`video/${videoId}`);
    if (!video) {
      return res.status(404).json({ error: "Videos Not Found" });
    }
    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "unauthorized" });
    }
    if (req.files && req.files.thumbnail) {
      await cloudinary.uploader.destroy(video.thumbnailId);
      const thumbnailUpload = await cloudinary.uploader.upload(
        req.files.thumbnail.tempFilePath,
        {
          folder: "thumbnail",
        },
      );
      video.thumbnailUrl = thumbnailUpload.secure_url;
      video.thumbnailId = thumbnailUpload.public_id;
    }
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags ? tags.split(",") : video.tags;

    await video.save();
    res.status(200).json({ message: "video Updated successfully", video });
  } catch (error) {
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }

  const existingVideo = await Video.findById(videoId);
};
