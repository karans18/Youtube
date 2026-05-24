import express from "express";
import Comment from "../model/comment.model.js";
import mongoose from "mongoose";

export const comment = async (req, res) => {
  try {
    const { video_id, commentText } = req.body;

    if (!video_id || !commentText) {
      return res.status(400).json({
        error: "Video Id and comment text is required",
      });
    }

    const newComment = new Comment({
      _id: new mongoose.Types.ObjectId(),

      video_id,

      commentText,

      user_id: req.user._id,
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
      message: error.message,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not Found" });
    }
    if (comment.req.user_id.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "authorized Access to delete this comment" });
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(201).json({
      message: "Comment Deleted successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not Found" });
    }
    if (comment.req.user_id.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "authorized Access to Update this comment" });
    }
    comment.commentText = commentText;
    await comment.save();

    res.status(201).json({
      message: "Comment Updated successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
      message: error.message,
    });
  }
};

export const commentByID = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video_id: videoId })
      .populate("user_id", "channelName logoUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
};
