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

/**
 * Delete Video
 */
export const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Videos Not Found" });
    }

    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "unauthorized" });
    }

    await cloudinary.uploader.destroy(video.videoId);
    await cloudinary.uploader.destroy(video.thumbnailId);
    await Video.findByIdAndDelete(videoId);
    res.status(200).json({ message: "video Deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};

/*
 *Get all videos
 */

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};
/*
 *Get My videos
 */

export const getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(videos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;

    const userId = req.user._id;

    // Add user to viewedBy array without duplicates
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: {
          viewedBy: userId,
        },
      },
      {
        new: true,
      },
    );

    if (!video) {
      return res.status(404).json({
        error: "Video not found",
      });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
/*
 *Get video by category
 */

export const getVideoByCategory = async (req, res) => {
  try {
    const videos = (await Video.find({ category: req.params.category })).sort({
      createdAt: -1,
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
/**
 *
 *Get video By tag
 */
export const tag = async (req, res) => {
  try {
    const tag = req.params.id;
    const videos = await (
      await Video.find({ tag: tag })
    ).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * Post a Like
 */
export const like = async (req, res) => {
  try {
    const { videoId } = req.body;
    const videos = await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likedBy: req.user._id },
      $pull: { disLikedBy: req.user._id },
    });

    res.status(200).json({ message: "liked the Video" });
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const disLike = async (req, res) => {
  try {
    const { videoId } = req.body;
    const videos = await Video.findByIdAndUpdate(videoId, {
      $addToSet: { disLikedBy: req.user._id },
      $pull: { likedBy: req.user._id },
    });

    res.status(200).json({ message: "Disliked the Video" });
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
