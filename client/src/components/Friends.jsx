import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import FriendCard from "./Cards/FriendsCard";
import SentRequestCard from "./Cards/SentRequestsCard";
import SearchCard from "./Cards/SearchCard";
import FriendRequestCard from "./Cards/FriendsRequestsCard";
import useFetch from "../hooks/useFetch";

const Friends = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [category, setCategory] = useState("friends");
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [endPoint, setEndPoint] = useState(`/users/${userId}/friends`);

  const onSuccess = (response) => {
    setData(response);
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    endPoint,
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
  }, [userId, endPoint]);

  let statusComponent = null;
  if (error != null) {
    statusComponent = (
      <div>Error while trying to get data from sever: {error.toString()}</div>
    );
  } else if (isLoading) {
    statusComponent = <div>Creating user....</div>;
  }

  let cardComponent = null;
  if (category === "friends") {
    cardComponent = <FriendCard data={data.friends} />;
  } else if (category === "friends-requests") {
    cardComponent = <FriendRequestCard data={data.receivedRequests} />;
  } else if (category === "sent-requests") {
    cardComponent = <SentRequestCard data={data.sentRequests} />;
  } else if (category === "search") {
    cardComponent = <SearchCard data={data.nonFriends} />;
  }

  return (
    <Container>
      <BoxContainer>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            onChange={(e) => {
              setCategory("search");
              setEndPoint(
                `/users/${userId}/searchNonFriendsByName?name=${e.target.value}`
              );
              setInput(e.target.value);
            }}
            value={input}
            type="text"
            placeholder="Search People"
          />
        </SearchContainer>

        <FriendsNav>
          <ul>
            <li
              className={category === "friends" ? "active" : ""}
              onClick={() => {
                setCategory("friends");
                setEndPoint(`/users/${userId}/friends`);
                setInput("");
              }}
            >
              My
              <br />
              Friends
            </li>
            <li
              className={category === "friends-requests" ? "active" : ""}
              onClick={() => {
                setCategory("friends-requests");
                setEndPoint(`/users/${userId}/getAllReceivedRequests`);
                setInput("");
              }}
            >
              Friends
              <br />
              Requests
            </li>
            <li
              className={category === "sent-requests" ? "active" : ""}
              onClick={() => {
                setCategory("sent-requests");
                setEndPoint(`/users/${userId}/getAllSentRequests`);
                setInput("");
              }}
            >
              Sent
              <br />
              Requests
            </li>
          </ul>
        </FriendsNav>
      </BoxContainer>
      {cardComponent}
      {statusComponent}
    </Container>
  );
};

export default Friends;

const SearchContainer = styled.div`
  width: 100%;
`;

const BoxContainer = styled.div`
  width: 100%;
  background-color: #05445e;
  color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;

const Container = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FriendsNav = styled.div`
  margin-top: 20px;
  background-color: #05445e;
  border-radius: 12px;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    border-radius: 12px;

    li {
      flex: 1;
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: white;
      font-weight: bolder;
      padding: 15px;
      font-size: 14px;
      color: white;
      font-weight: bolder;
      cursor: pointer;
      transition: color 0.3s, background-color 0.3s;
      transition: color 0.3s, background-color 0.3s;

      &:hover {
        color: orange;
        border-radius: 12px;
      }

      &.active {
        color: #189ab4;
        font-weight: bold;
        background-color: #d4f1f4;
        border-radius: 5px;
      }
    }
  }
  @media (min-width: 1200px) {
    width: 100%;
  }
  li {
    margin: 0 15px;
  }
  @media (min-width: 500px) and (max-width: 770px) {
    width: 100%;
  }
  li {
    margin: 0px;
  }
`;
const SearchIcon = styled(FaSearch)`
  color: gray;
  margin-right: 0.5rem;
`;
const SearchInput = styled.input`
  width: 90%;
  border: none;
  outline: none;
  background: white;
  background: white;
  flex: 1;
  font-size: 16px;
  padding: 0.5rem;
  border-radius: 1rem;
  color: black;

  transition: border-color 0.3s;

  &::placeholder {
    color: #189ab4;
  }

  &:focus {
    border-color: #189ab4;
  }
`;
