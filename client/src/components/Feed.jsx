import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Post from "./Post";
import CreatePost from "./CreatePost";
import useFetch from "../hooks/useFetch";

const Feed = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);

  const onReceived = (response) => {
    const sortedPosts = response.posts.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setPosts(sortedPosts);
  };

  const { performFetch, cancelFetch, isLoading, error } = useFetch(
    `/posts/${userId}/friends-posts`,
    onReceived
  );

  const fetchPosts = () => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    performFetch(options);
  };

  const onPostChanged = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
    return cancelFetch;
  }, [userId]);

  const isOwner = (post) => {
    const userName = localStorage.getItem("username");
    return userName === post.username;
  };

  return (
    <Container>
      <PostsContainer>
        <CreatePost onPostCreate={onPostChanged} />
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onPostChanged={onPostChanged}
              isOwner={isOwner(post)}
            />
          ))
        )}
      </PostsContainer>
    </Container>
  );
};

export default Feed;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 51rem;
  margin-top: 1.5rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #05445e, #d4f1f4, #05445e);
  }
`;
const PostsContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;
