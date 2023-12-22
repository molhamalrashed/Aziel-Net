import asyncHandler from "express-async-handler";
import Friendship from "../models/Friendship.js";
import User from "../models/User.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  // Find all users and their posts
  const users = await User.find().populate("posts");

  // Extract and flatten all posts from users
  const allPosts = users.reduce((posts, user) => posts.concat(user.posts), []);

  res.status(200).json({ success: true, posts: allPosts });
});

// Get all posts of user's friends
export const getFriendsPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const user = await User.findById(userId);

  const friendships = await Friendship.find({
    $or: [
      { userA: ObjectId(userId), status: "accepted" },
      { userB: ObjectId(userId), status: "accepted" },
    ],
  });

  const friendIds = friendships.map((friendship) => {
    return userId === friendship.userA.toString()
      ? friendship.userB
      : friendship.userA;
  });

  // Fetch posts for each friend
  const allFriendsPosts = await Promise.all(
    friendIds.map(async (friendId) => {
      // Find each friend and retrieve their posts
      const friend = await User.findById(friendId);

      if (!friend) {
        return [];
      }

      // Return the friend's posts
      return friend.posts;
    })
  );

  // Add user's posts to the array
  allFriendsPosts.push(user.posts);

  // Flatten the array of arrays into a single array of posts
  const friendsPosts = allFriendsPosts.flat();

  res.status(200).json({ success: true, posts: friendsPosts });
});

// Controller to get all posts of a specific user
export const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const userPosts = user.posts; // Assuming "posts" is the array of embedded posts

  res.status(200).json({ success: true, posts: userPosts });
});

export const getLikesForPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ success: false, message: "Invalid postId" });
    return;
  }

  // Find the user that has the post
  const user = await User.findOne({ "posts._id": postId });

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  const post = user.posts.id(postId);

  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
    return;
  }

  const likes = post.likes;

  res.status(200).json({ success: true, likes });
});

export const likePost = asyncHandler(async (req, res) => {
  const { userId, postId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ success: false, message: "Invalid postId" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const post = user.posts.id(postId);

  if (!post) {
    // If the post is not found in the user's posts, add the like directly to the post
    await User.findOneAndUpdate(
      { "posts._id": postId },
      {
        $addToSet: {
          "posts.$.likes": { user: userId },
        },
      },
      { new: true }
    );
  } else {
    // If the post is found in the user's posts, check if the user has already liked it
    if (!post.likes.some((like) => like.user.equals(userId))) {
      post.likes.push({ user: userId });
      await user.save();
      return res
        .status(201)
        .json({ success: true, message: "Post liked successfully" });
    } else {
      return res.status(409).json({
        success: false,
        message: "You have already liked this post",
      });
    }
  }

  res.status(201).json({ success: true, message: "Post liked successfully" });
});

export const unlikePost = asyncHandler(async (req, res) => {
  const { userId, postId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ success: false, message: "Invalid postId" });
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const post = user.posts.id(postId);

  if (!post) {
    const result = await User.findOneAndUpdate(
      { "posts._id": postId, "posts.likes.user": userId },
      {
        $pull: {
          "posts.$.likes": { user: userId },
        },
      },
      { new: true }
    );

    if (result) {
      res
        .status(200)
        .json({ success: true, message: "Post unliked successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "You have not liked this post" });
    }
  } else {
    post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Post unliked successfully" });
  }
});

export const createPost = asyncHandler(async (req, res) => {
  const { userId, text } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create a new post object
  const newPost = {
    username: user.username,
    text,
    images: [], // You can add images here if needed
    timestamp: new Date(),
  };

  user.posts.push(newPost);
  await user.save();

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: { ...newPost },
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { userId, id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid postId");
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the post with the given id and remove it from the user's posts
  const updatedUser = await User.findOneAndUpdate(
    { posts: userId },
    { $pull: { posts: { _id: id } } },
    { new: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    post: { ...updatedUser },
  });
});

export const editPost = asyncHandler(async (req, res) => {
  const { userId, id, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid postId");
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the post with the given id and update its text
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, "posts._id": id },
    { $set: { "posts.$.text": text } },
    { new: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Retrieve the updated post
  const updatedPost = updatedUser.posts.find((post) => post._id.equals(id));

  res.status(200).json({
    success: true,
    message: "Post edited successfully",
    post: { ...updatedPost.toObject() },
  });
});

export const commentPost = asyncHandler(async (req, res) => {
  const { userId, postId, text } = req.body;
  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  // Find the post within the user's posts
  const post = user.posts.id(postId);

  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
    return;
  }

  // Create a new comment
  const newComment = {
    user: userId,
    username: user.username,
    text,
    timestamp: new Date(),
  };

  // Add the comment to the post
  post.comments.push(newComment);

  // Save the changes to the user document
  await user.save();

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    comment: { ...newComment },
  });

  res.status(500).json({ success: false, message: "Internal Server Error" });
});

export const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Validate if postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ success: false, message: "Invalid postId" });
    return;
  }

  // Find the user that has the post
  const user = await User.findOne({ "posts._id": postId });

  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  // Find the post by postId
  const post = user.posts.id(postId);

  if (!post) {
    res.status(404).json({ success: false, message: "Post not found" });
    return;
  }

  const comments = post.comments;

  res.status(200).json({ success: true, comments });

  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// export const editcomment = asyncHandler(async (req, res) => {});
// export const getCommentsForPost = asyncHandler(async (req, res) => {});
// export const deleteComment = asyncHandler(async (req, res) => {});
