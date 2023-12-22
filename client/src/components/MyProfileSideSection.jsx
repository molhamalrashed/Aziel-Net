import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useFetch from "../hooks/useFetch";

export const fakeData = {
  username: "Sophie",
  friends: 2,
  profilePic:
    "https://th.bing.com/th/id/OIP.vQcH6uRqJd1SIpce-41uUgHaLH?w=146&h=219&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  coverPhoto:
    "https://th.bing.com/th?id=OIP.zcvn4QV1z5E7vQOFDLP6UQHaC2&w=350&h=134&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
};

const placeholderProfilePic =
  "https://via.placeholder.com/120x120?text=Profile+Pic";

const MyProfileSideSection = () => {
  const [data, setData] = useState(fakeData);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const onSuccess = (response) => {
    setData(response);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/users/${userId}`,
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);

  useEffect(() => {
    performFetch({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [userId]);

  return (
    <Container>
      <ProfilePicContainer>
        <ProfilePic
          src={data.profilePic || placeholderProfilePic}
          alt="Profile Pic"
        />
      </ProfilePicContainer>
      {isLoading && <LoadingDiv>Loading....</LoadingDiv>}
      {!isLoading && error && (
        <ErrorDiv>
          Error while trying to get data from the server: {error.toString()}
        </ErrorDiv>
      )}
      {!isLoading && !error && data.success && (
        <TextWrapper>@ {data.user.username}</TextWrapper>
      )}
    </Container>
  );
};

export default MyProfileSideSection;

const Container = styled.div`
  height: 13rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const TextWrapper = styled.div`
  font-family: "Comfortaa", Helvetica;
  font-size: 32px;
  font-weight: bolder;
  color: #05445e;
  height: 36px;
  left: 90px;
  letter-spacing: -0.48px;
  line-height: normal;
  text-align: center;
  white-space: nowrap;
`;

const ProfilePicContainer = styled.div`
  position: relative;
`;

const ProfilePic = styled.img`
  position: relative;
  left: 20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid #fff;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
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
