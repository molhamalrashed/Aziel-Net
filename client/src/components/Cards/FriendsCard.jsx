import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

const FriendCard = (data) => {
  const navigate = useNavigate();
  const [endPoint, setEndPoint] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const [currentData, setCurrentData] = useState(data.data);

  const onSuccess = () => {
    setCurrentData((prevData) =>
      prevData.filter((user) => user._id !== otherUserId)
    );
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    endPoint,
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    setCurrentData(data.data);
  }, [data.data]);

  useEffect(() => {
    if (!endPoint) {
      return;
    }
    performFetch({
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [endPoint]);

  const handleProfileClick = (profileId) => {
    navigate(`/home/user-profile/${profileId}`);
  };

  let statusComponent = null;
  if (error != null) {
    statusComponent = (
      <div>Error while trying to get data from sever: {error.toString()}</div>
    );
  } else if (isLoading) {
    statusComponent = <div>Loading....</div>;
  }

  const sparePic =
    "https://th.bing.com/th/id/OIP.Y6Xo7ozc-rL5UrzUanPlxAHaHa?w=211&h=211&c=7&r=0&o=5&dpr=1.3&pid=1.7";
  return (
    <Container>
      <ScrollableContainer>
        <FriendGrid>
          {currentData && currentData.length > 0 ? (
            currentData.map((user) => (
              <FriendItem key={user._id}>
                <ProfilePic
                  src={user.profilePic ? user.profilePic : sparePic}
                  alt={user.name}
                />
                <FriendInfo>
                  <Name onClick={() => handleProfileClick(user._id)}>
                    {user.username}
                  </Name>
                </FriendInfo>
                <ButtonContainer>
                  <FriendButton
                    onClick={() => {
                      setOtherUserId(user._id);
                      setEndPoint(`/users/${userId}/${user._id}/unfriend`);
                    }}
                  >
                    Unfriend
                  </FriendButton>
                </ButtonContainer>
              </FriendItem>
            ))
          ) : (
            <ErrorDiv>No friends to display.</ErrorDiv>
          )}
        </FriendGrid>
        {statusComponent}
      </ScrollableContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40rem;
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

const ScrollableContainer = styled.div`
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0em;
  }
  &::-webkit-scrollbar-thumb {
    background: #8c8c8c;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555555;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const FriendGrid = styled.div`
  display: grid;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);

  @media (min-width: 250px) and (max-width: 450px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 450px) and (max-width: 770px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 770px) and (max-width: 1000px) {
    grid-template-columns: repeat(1, 1fr); /* 750-1000px: 1 column */
  }

  @media (min-width: 1000px) and (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr); /* 1000-1200px: 2 columns */
  }
`;

const FriendItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  border: 3px solid #05445e;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
`;

const ProfilePic = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 8px;
`;
const FriendInfo = styled.div`
  text-align: left;
`;

const Name = styled.h3`
  font-size: 18px;
  color: #05445e;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    color: #189ab4;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FriendButton = styled.button`
  background-color: #05445e;
  color: white;
  font-weight: bolder;
  padding: 8px 45px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 8px 0px 8px 0;
`;
const ErrorDiv = styled.button`
  background-color: #b5d4e8;
  color: black;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  margin: 8px 10px 8px 0;
  width: 200px;
`;
export default FriendCard;
