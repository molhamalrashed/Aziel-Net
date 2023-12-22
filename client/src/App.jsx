import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import Welcome from "./pages/Home/Welcome";
import LoginUser from "./pages/User/LoginUser";
import SharedArea from "./components/SharedArea";
import Feed from "./components/Feed";
import MyProfileComponent from "./components/Profile/MyProfileComponent";
import Friends from "./components/Friends";
import OtherUserProfile from "./components/Profile/OthersProfile/OtherUserProfile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home/*" element={<Home />}>
          <Route index element={<SharedArea />} />
          <Route path="feed" element={<Feed />} />
          <Route path="friends" element={<Friends />} />
          <Route path="myprofile" element={<MyProfileComponent />} />
          <Route
            path="user-profile/:profileId"
            element={<OtherUserProfile />}
          />
        </Route>
        <Route path="/home/users" element={<UserList />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/register" element={<CreateUser />} />
      </Routes>
    </>
  );
};

export default App;
