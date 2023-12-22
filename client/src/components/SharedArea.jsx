import React from "react";
import { Routes, Route } from "react-router-dom";
import Feed from "./Feed";
import Friends from "./Friends";
import MyProfileComponent from "./Profile/MyProfileComponent";
import OtherUserProfile from "./Profile/OthersProfile/OtherUserProfile";

const SharedArea = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="friends" element={<Friends />} />
        <Route path="myprofile" element={<MyProfileComponent />} />
        <Route path="user-profile/:profileId" element={<OtherUserProfile />} />
      </Routes>
    </>
  );
};

export default SharedArea;
