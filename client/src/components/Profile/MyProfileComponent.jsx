import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useFetch from "../../hooks/useFetch";
import UsersPosts from "./UsersPosts";

export const fakeData = {
  username: "Sophie",
  friends: 2,
  profilePic:
    "https://th.bing.com/th/id/OIP.vQcH6uRqJd1SIpce-41uUgHaLH?w=146&h=219&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  coverPhoto:
    "https://th.bing.com/th?id=OIP.zcvn4QV1z5E7vQOFDLP6UQHaC2&w=350&h=134&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
};

const placeholderCoverPhoto =
  "https://via.placeholder.com/1000x240?text=Cover+Photo";

const MyProfileComponent = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [friendsNumber, setFriendsNumber] = useState(null);

  const onSuccess = (response) => {
    setData(response.user);
  };

  const onGetting = (response) => {
    setFriendsNumber(response.friendsNumber);
  };

  const { performFetch: fetchFriendsNumber, cancelFetch: cancelFriendsNumber } =
    useFetch(`/users/${userId}/friendsNumber`, onGetting);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/users/${userId}`,
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);
  useEffect(() => {
    return cancelFriendsNumber;
  }, []);

  useEffect(() => {
    fetchFriendsNumber({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, []);

  console.log(friendsNumber);

  useEffect(() => {
    performFetch({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [userId]);

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch(
        `${process.env.BASE_SERVER_URL}/api/uploads/upload-profile-picture/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();

        document.getElementById(
          "profilePic"
        ).src = `${process.env.BASE_SERVER_URL}${result.profilePictureUrl}`;
      } else {
        console.error("Profile picture upload failed");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <Container>
      <ScrollableContainer>
        {isLoading && <LoadingDiv>Loading....</LoadingDiv>}
        {!isLoading && error && (
          <ErrorDiv>
            Error while trying to get data from the server: {error.toString()}
          </ErrorDiv>
        )}
        {!isLoading && !error && (
          <>
            <CoverPhotoContainer>
              <CoverPhoto
                src={data.coverPhoto || placeholderCoverPhoto}
                alt="Cover Photo"
              />
            </CoverPhotoContainer>
            <ProfileInfo>
              <ProfilePicContainer>
                <ProfilePic
                  id="profilePic"
                  src={
                    data.profilePicture
                      ? `${process.env.BASE_SERVER_URL}/uploadImages/${data.profilePicture}`
                      : placeholderCoverPhoto
                  }
                  alt="Profile Pic"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
              </ProfilePicContainer>
              {
                <div>
                  <h1>@ {data.username}</h1>
                  <p>{`${friendsNumber} Friends`}</p>
                </div>
              }
            </ProfileInfo>
          </>
        )}
        <UsersPosts />
      </ScrollableContainer>
    </Container>
  );
};

export default MyProfileComponent;

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

const ScrollableContainer = styled.div`
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0em;
  }
  &::-webkit-scrollbar-thumb {
    background: #d4f1f4;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #d4f1f4;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const CoverPhotoContainer = styled.div`
  position: relative;
`;

const CoverPhoto = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 0.8rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const ProfilePicContainer = styled.div`
  position: relative;
`;

const ProfilePic = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 5px solid #fff;
  object-fit: cover;
  margin-top: -75px;
  margin-left: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;

  h1 {
    font-size: 17px;
    margin-right: 10px;
  }

  p {
    color: #666;
    font-size: 14px;
  }
`;

const LoadingDiv = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const ErrorDiv = styled.div`
  background-color: #ffe4e1;
  color: #e74c3c;
  padding: 8px 16px;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  margin: 8px 0;
`;
