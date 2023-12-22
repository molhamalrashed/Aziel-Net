import express from "express";
import {
  getUser,
  getUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getNonFriendUsers,
  getAllSentRequests,
  getAllReceivedRequests,
  searchNonFriendsByName,
  cancelFriendRequest,
  unfriendUser,
  isFriend,
  getUserFriendsNumber,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/:userId", getUser);
router.get("/:userId/friends", getUserFriends);
router.get("/:userId/friendsNumber", getUserFriendsNumber);

router.post("/:senderId/:receiverId", sendFriendRequest);
router.delete("/:senderId/:receiverId/cancel", cancelFriendRequest);

router.put("/:senderId/:receiverId/accept", acceptFriendRequest);
router.put("/:senderId/:receiverId/reject", rejectFriendRequest);

router.get("/:userId/nonFriendUsers", getNonFriendUsers);
router.get("/:userId/getAllSentRequests", getAllSentRequests);
router.get("/:userId/getAllReceivedRequests", getAllReceivedRequests);

router.get("/:userId/searchNonFriendsByName", searchNonFriendsByName);

router.delete("/:userId/:friendId/unfriend", unfriendUser);

router.get("/:userId/:friendId/isFriend", isFriend);

export default router;
