import Friendship from "../models/Friendship.js";
import User from "../models/User.js";
import { ObjectId } from "mongodb";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({ message: "Error while fetching user." });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendships = await Friendship.find({
      $or: [
        { userA: ObjectId(userId), status: "accepted" },
        { userB: ObjectId(userId), status: "accepted" },
      ],
    });

    const friendIds = friendships
      .map((friendship) => {
        return userId === friendship.userA.toString()
          ? friendship.userB
          : friendship.userA;
      })
      .filter((friendId) => friendId.toString() !== userId); // Compare against ObjectId instance
    const userFriends = await User.find({
      _id: { $in: friendIds.map((id) => ObjectId(id)) },
    }); // Convert friendIds to ObjectId instances

    res.status(200).json({
      success: true,
      friends: userFriends,
    });
  } catch (error) {
    res.status(500).send({ message: "Error while fetching user's friends." });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const existingFriendship = await Friendship.findOne({
      userA: senderId,
      userB: receiverId,
      status: "pending",
    });

    if (existingFriendship) {
      return res.status(400).send({ message: "Friend request already sent." });
    }

    const newFriendship = new Friendship({
      userA: senderId,
      userB: receiverId,
      status: "pending",
    });

    await newFriendship.save();

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
    });
  } catch (error) {
    res.status(500).send({ message: "Friend request failed." });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const existingFriendship = await Friendship.findOne({
      userA: senderId,
      userB: receiverId,
      status: "pending",
    });

    if (!existingFriendship) {
      return res.status(404).send({
        message: "Friend request not found or already accepted/rejected.",
      });
    }

    await existingFriendship.remove();

    res.status(200).json({
      success: true,
      message: "Friend request canceled successfully.",
    });
  } catch (error) {
    res.status(500).send({ message: "Friend request cancellation failed." });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const friendship = await Friendship.findOneAndUpdate(
      { userA: senderId, userB: receiverId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).send({ message: "Friend request not found." });
    }

    res.status(200).json({
      success: true,
      message: "Friend request accepted.",
    });
  } catch (error) {
    res.status(500).send({ message: "Friend request acceptance failed." });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const friendship = await Friendship.findOneAndUpdate(
      {
        userA: senderId,
        userB: receiverId,
        status: "pending",
      },
      { status: "rejected" },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).send({ message: "Friend request not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Friend request rejected." });
  } catch (error) {
    res.status(500).send({ message: "Friend request rejection failed." });
  }
};

export const getNonFriendUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    const userFriendships = await Friendship.find({
      $or: [
        { userA: userId, status: "accepted" },
        { userB: userId, status: "accepted" },
      ],
    });

    const friendIds = userFriendships.map((friendship) => {
      return userId === friendship.userA ? friendship.userB : friendship.userA;
    });

    const nonFriendUsers = await User.find({
      _id: { $nin: [...friendIds, userId] },
    });

    res.status(200).json({
      success: true,
      nonFriends: nonFriendUsers,
    });
  } catch (error) {
    res.status(500).send({ message: "Error while fetching non-friends." });
  }
};

export const getAllSentRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const sentRequests = await Friendship.find({
      userA: userId,
      status: "pending",
    });

    const receiverIds = sentRequests.map((request) => request.userB);

    const receivers = await User.find({ _id: { $in: receiverIds } });

    res.status(200).json({
      success: true,
      sentRequests: receivers,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while fetching sent friend requests." });
  }
};

export const getAllReceivedRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const receivedRequests = await Friendship.find({
      userB: userId,
      status: "pending",
    });

    const senderIds = receivedRequests.map((request) => request.userA);

    const senders = await User.find({ _id: { $in: senderIds } });

    res.status(200).json({
      success: true,
      receivedRequests: senders,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while fetching received friend requests." });
  }
};

export const searchNonFriendsByName = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.query;

    const userFriendships = await Friendship.find({
      $or: [{ userA: ObjectId(userId) }, { userB: ObjectId(userId) }],
    });

    const friendIds = userFriendships.map((friendship) => {
      if (String(userId) === String(friendship.userA)) {
        return String(friendship.userB);
      } else {
        return String(friendship.userA);
      }
    });
    const nonFriendUsers = await User.find({
      _id: { $nin: [...friendIds, ObjectId(userId)] },
      $or: [
        { username: { $regex: name, $options: "i" } },
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      nonFriends: nonFriendUsers,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while searching for non-friends by name." });
  }
};

export const unfriendUser = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const friendship = await Friendship.findOne({
      $or: [
        { userA: ObjectId(userId), userB: ObjectId(friendId) },
        { userA: ObjectId(friendId), userB: ObjectId(userId) },
      ],
      status: "accepted",
    });

    if (!friendship) {
      return res
        .status(404)
        .send({ message: "Friendship not found or not accepted." });
    }

    await friendship.remove();

    res
      .status(200)
      .json({ success: true, message: "Friendship unfriended successfully." });
  } catch (error) {
    res.status(500).send({ message: "Friendship unfriending failed." });
  }
};

export const isFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const friendship = await Friendship.findOne({
      $or: [
        { userA: userId, userB: friendId, status: "accepted" },
        { userA: friendId, userB: userId, status: "accepted" },
      ],
    });

    if (friendship) {
      // Users are friends
      res.status(200).json({
        success: true,
        status: "friend",
      });
    } else {
      const sentRequest = await Friendship.findOne({
        userA: userId,
        userB: friendId,
        status: "pending",
      });

      const receivedRequest = await Friendship.findOne({
        userA: friendId,
        userB: userId,
        status: "pending",
      });

      if (sentRequest) {
        // A friend request is sent by the current user
        res.status(200).json({
          success: true,
          status: "sent_request",
        });
      } else if (receivedRequest) {
        // A friend request is received by the current user
        res.status(200).json({
          success: true,
          status: "received_request",
        });
      } else {
        // No friendship or pending requests
        res.status(200).json({
          success: true,
          status: "not_friend",
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error while checking friendship status." });
  }
};

export const getUserFriendsNumber = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendships = await Friendship.find({
      $or: [
        { userA: ObjectId(userId), status: "accepted" },
        { userB: ObjectId(userId), status: "accepted" },
      ],
    });

    const friendIds = friendships
      .map((friendship) => {
        return userId === friendship.userA.toString()
          ? friendship.userB
          : friendship.userA;
      })
      .filter((friendId) => friendId.toString() !== userId); // Compare against ObjectId instance
    res.status(200).json({
      success: true,
      friendsNumber: friendIds.length,
    });
  } catch (error) {
    res.status(500).send({ message: "Error while fetching user's friends." });
  }
};
