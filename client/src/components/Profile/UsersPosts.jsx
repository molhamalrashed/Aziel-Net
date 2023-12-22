import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useFetch from "../../hooks/useFetch";
import CreatePost from "../CreatePost";
import Post from "../Post";

const UsersPosts = () => {
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

  const onReceived = (response) => {
    const userName = localStorage.getItem("username");

    const userPosts = response.posts.filter(
      (post) => post.username === userName
    );

    const sortedPosts = userPosts.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setPosts(sortedPosts);
  };

  const { performFetch, cancelFetch, isLoading, error } = useFetch(
    "/posts/get",
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

  const onPostCreate = () => {
    fetchPosts();
  };

  const onPostDelete = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
    return cancelFetch;
  }, []);

  const isOwner = (post) => {
    const userName = localStorage.getItem("username");
    return userName === post.username;
  };

  return (
    <Container>
      <PostsContainer>
        <CreatePost onPostCreate={onPostCreate} />
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onPostDelete={onPostDelete}
              isOwner={isOwner(post)}
            />
          ))
        )}
      </PostsContainer>
    </Container>
  );
};

export default UsersPosts;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 40rem;
  margin-top: 1rem;
`;
const PostsContainer = styled.div``;
