import React, { useState, useEffect } from "react";
import styled from "styled-components";

import useFetch from "../../../hooks/useFetch";
import Post from "../../Post";

// eslint-disable-next-line react/prop-types
const OtherUsersPosts = ({ profileId }) => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  const onReceived = (response) => {
    const sortedPosts = response.posts.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    setPosts(sortedPosts);
  };
  const { performFetch, cancelFetch, isLoading, error } = useFetch(
    `/posts/${profileId}/posts`,
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

  useEffect(() => {
    fetchPosts();
    return cancelFetch; // Assuming cancelFetch is a cleanup function
  }, [profileId]); // Add profileId to the dependency array

  const isOwner = (post) => {
    const userName = localStorage.getItem("username");
    return userName === post.username;
  };

  return (
    <Container>
      <PostsContainer>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} isOwner={isOwner(post)} />
          ))
        )}
      </PostsContainer>
    </Container>
  );
};

export default OtherUsersPosts;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 40rem;
  margin-top: 1rem;
`;

const PostsContainer = styled.div``;
