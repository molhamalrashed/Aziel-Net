import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";

const CreatePost = ({ onPostCreate }) => {
  const [text, setText] = useState("");
  const onReceived = (response) => {
    setText("");
    onPostCreate(response.post);
  };

  const { performFetch, isLoading } = useFetch("/posts/create", onReceived);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handlePostCreate = () => {
    if (text.trim() !== "") {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId, text: text }),
      };

      performFetch(options);
    }
  };

  return (
    <Container>
      <TopArea>
        <ProfileImage
          src="https://c.animaapp.com/EuIEJ23i/img/ellipse@2x.png"
          alt="Profile Image"
        />
        <Text
          name="user-post"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></Text>
      </TopArea>
      <BottomArea>
        <PostButton onClick={handlePostCreate}>Post</PostButton>
      </BottomArea>
      {isLoading && <p>Loading...</p>}
    </Container>
  );
};

CreatePost.propTypes = {
  onPostCreate: PropTypes.func.isRequired,
};

export default CreatePost;

const Container = styled.div`
  background-color: #05445e;
  color: white;
  border: 1px solid black;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding-bottom: 1rem;
`;

const TopArea = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
`;

const BottomArea = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ProfileImage = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const Text = styled.textarea`
  margin-top: 0.5rem;
  display: flex;
  width: 100%;
  background-color: #ffffff;
  border-radius: 5.97px;
  height: 41px;
  resize: none;
  margin-left: 0.5rem;
  font-family: var(--font-family);
  font-size: 1rem;
  text-align: left;
  padding: 0.6rem;
`;

const PostButton = styled.button`
  background-color: #f0f7ff;
  color: #05445e;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  height: 31px;
  width: 122px;
`;
