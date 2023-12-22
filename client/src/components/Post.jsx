import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import PropTypes from "prop-types";
import TimeAgo from "react-timeago";
import useFetch from "../hooks/useFetch";

const Post = ({ post, onPostChanged, isOwner }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [isEditMode, setIsEditMode] = useState(false);
  const [postContent, setPostContent] = useState(post.text);
  const [likesData, setLikesData] = useState({ likes: [] });
  const [hasLikedPost, setHasLikedPost] = useState(false);

  useEffect(() => {
    performGetLikesFetch();
    return () => {
      cancelDeleteFetch();
      cancelEditFetch();
      cancelGetLikesFetch();
    };
  }, [userId]);

  useEffect(() => {
    const newHasLikedPost =
      likesData &&
      likesData.likes &&
      likesData.likes.some((like) => like.user === userId);

    if (newHasLikedPost !== hasLikedPost) {
      setHasLikedPost(newHasLikedPost);
    }
  }, [likesData, userId, hasLikedPost]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const onReceived = () => {
    onPostChanged();
  };

  const { performFetch: performDeleteFetch, cancelFetch: cancelDeleteFetch } =
    useFetch("/posts/delete", onReceived);

  const { performFetch: performEditFetch, cancelFetch: cancelEditFetch } =
    useFetch("/posts/edit", onReceived);

  const { performFetch: performLikeFetch } = useFetch(
    `/posts/${post._id}/like`,
    (data) => {
      setLikesData(data);
      performGetLikesFetch();
    }
  );

  const { performFetch: performUnlikeFetch } = useFetch(
    `/posts/${post._id}/unlike`,
    (data) => {
      setLikesData(data);
      performGetLikesFetch();
    }
  );

  const {
    performFetch: performGetLikesFetch,
    cancelFetch: cancelGetLikesFetch,
  } = useFetch(`/posts/${post._id}/likes`, setLikesData);

  const handlePostDelete = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (isConfirmed) {
      if (userId && post && post._id) {
        const options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: userId, id: post._id }),
        };

        performDeleteFetch(options);
      }
    }
  };

  const handleSaveChanges = () => {
    if (!postContent) {
      alert("Text field cannot be empty");
      return;
    }
    if (post && post._id && postContent) {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          id: post._id,
          text: postContent,
        }),
      };

      performEditFetch(options);
      setIsEditMode(false);
    }
  };

  const handleLikeClick = async () => {
    if (userId && post && post._id) {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId, postId: post._id }),
      };

      performLikeFetch(options);
      performGetLikesFetch();
    }
  };

  const handleUnlikeClick = async () => {
    if (userId && post && post._id) {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId, postId: post._id }),
      };

      performUnlikeFetch(options);

      performGetLikesFetch();
    }
  };

  Post.propTypes = {
    post: PropTypes.object.isRequired,
    onPostChanged: PropTypes.func,
    isOwner: PropTypes.bool.isRequired,
  };

  return (
    <Container>
      <PostTitle>
        <ProfileImage
          src="https://c.animaapp.com/shx7UmdF/img/ellipse-26-2@2x.png"
          alt="Profile Image"
        />
        <UserName>
          <strong>{post.username}</strong>

          <Time>
            <TimeAgo date={post.timestamp} />
          </Time>
        </UserName>
        {isOwner && (
          <>
            {isEditMode ? (
              <CancelButton onClick={toggleEditMode}>Cancel</CancelButton>
            ) : (
              <EditButton onClick={toggleEditMode}>Edit</EditButton>
            )}
            <DeleteButton onClick={handlePostDelete}>Delete</DeleteButton>
          </>
        )}
      </PostTitle>
      {isEditMode ? (
        <Text
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></Text>
      ) : (
        <PostText>{post.text}</PostText>
      )}
      <PostFooter>
        {isEditMode && (
          <SaveChangesButton onClick={handleSaveChanges}>
            Save Changes
          </SaveChangesButton>
        )}
        {likesData &&
        likesData.likes &&
        likesData.likes.length !== undefined ? (
          <LikeCount>{likesData.likes.length} Likes</LikeCount>
        ) : (
          <LikeCount> 0 Likes</LikeCount>
        )}

        {userId && post && post._id && (
          <ButtonContainer>
            {hasLikedPost ? (
              <UnlikeButton onClick={handleUnlikeClick}>
                <FaThumbsDown />
              </UnlikeButton>
            ) : (
              <LikeButton onClick={handleLikeClick}>
                <FaThumbsUp />
              </LikeButton>
            )}
          </ButtonContainer>
        )}
      </PostFooter>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid #d4f1f4;
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem 2rem 0.5rem 2rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const PostTitle = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 4.3rem;
  height: 4.3rem;
  padding: 0.2rem;
  border-radius: 50%;
  border-color: var(--white);
  box-shadow: -1.27px 1.27px 5.07px #78829280;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
const LikeButton = styled.button`
  color: #fff;
  background-color: ${({ liked }) => (liked ? "#ff6347" : "#4caf50")};
  cursor: pointer;
  opacity: 0.8;
  margin-left: 1.5rem;
  font-size: 1.3rem;
  border: none;
  border-radius: 50%;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ liked }) => (liked ? "#45a049" : "#d32f2f")};
  }
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.4rem;
  }
`;

const UnlikeButton = styled(LikeButton)`
  background-color: ${({ liked }) => (liked ? "#4caf50" : "#ff6347")};
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.4rem;
  }
`;

const LikeCount = styled.div`
  color: #788292;
  font-size: 1rem;
  @media (max-width: 768px) {
    margin-right: 6rem;
  }
`;

const UserName = styled.div`
  font-size: 1.2rem;
  flex-grow: 1;
`;

const Time = styled.p`
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;
const PostText = styled.p`
  font-size: 1.1rem;
  line-height: 2rem;
  overflow-wrap: break-word;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const DeleteButton = styled.div`
  display: flex;
  color: grey;
  cursor: pointer;
  align-self: flex-start;
`;

const EditButton = styled.div`
  display: flex;
  color: grey;
  cursor: pointer;
  align-self: flex-start;
  margin-right: 1rem;
`;

const SaveChangesButton = styled.button`
  background-color: #75e6da;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;

  &:hover {
    background-color: #75e6da;
  }
`;

const CancelButton = styled.div`
  display: flex;
  color: #189ab4;
  cursor: pointer;
  align-self: flex-start;
  margin-right: 1rem;

  &:hover {
    color: red;
  }
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
  padding: 0.5rem;
`;

export default Post;
