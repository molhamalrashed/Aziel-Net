import React from "react";
import TEST_ID from "./Home.testid";
import MyProfileSideSection from "../../components/MyProfileSideSection";
import FriendSideSection from "../../components/FriendSideSection";
import Nav from "../../components/Nav";
import SharedArea from "../../components/SharedArea";
import NewsSideSection from "../../components/NewsSideSection";
import styled from "styled-components";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <div className="container wrapper">
        <div className="container homepage">
          <div className="container column">
            <div className="container logo">
              <Heading>
                <span className="white">AZIEL</span>{" "}
                <span className="black">NET</span>
              </Heading>
            </div>
            <div className="container block my-profile">
              <MyProfileSideSection />
            </div>
            <div className="my-friends">
              <div className="title">
                <h2>My friends</h2>
              </div>
              <div className="container block">
                <FriendSideSection />
              </div>
            </div>
          </div>
          <div className="container middle-column">
            <Nav />

            <SharedArea />
          </div>
          <div className="container column">
            <div className="events">
              <div className="title">
                <h2>News from IND</h2>
              </div>
              <div className="container block">
                <NewsSideSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

const Heading = styled.h1`
  font-size: 40px;
  margin-bottom: 1rem;
  color: #05445e;
  font-weight: 800;
  font-family: Inter;
  .white {
    color: #05445e;
  }
  .black {
    color: #189ab4;
  }
`;
