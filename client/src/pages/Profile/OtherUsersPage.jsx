import React from "react";
import Nav from "../../components/Nav";

import logo from "../../../public/logo.png";
import FriendSideSection from "../../components/FriendSideSection";

import EventSideSection from "../../components/EventSideSection";
import UsersPosts from "../../components/Profile/UsersPosts";
import OtherUserProfile from "../../components/Profile/OthersProfile/OtherUserProfile";

const OtherUsersPage = () => {
  return (
    <div className="container wrapper">
      <div className="container homepage">
        <div className="container column">
          <div className="container block">
            <FriendSideSection />
          </div>
        </div>
        <div className="container middle-column">
          <div className="container logo">
            <div className="container">
              <img src={logo} alt="logo" />
            </div>

            <div className="container nav">
              <Nav />
            </div>
          </div>
          <OtherUserProfile />
          <UsersPosts />
        </div>
        <div className="container column">
          <div className="container block">
            <EventSideSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUsersPage;
