import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const backgroundImage =
  "https://res.cloudinary.com/dtb1hpuil/image/upload/v1700772687/q6_gwb3jp.jpg";

const Welcome = () => {
  return (
    <FormWrapper>
      <FormContainer>
        <Heading>
          <span className="white">AZIEL</span>{" "}
          <span className="black">NET</span>
        </Heading>
        <Slogan>
          Brings everyone closer ...
          <br />
          And empowering refugees in the Netherlands
        </Slogan>
        <StyledList>
          <StyledListItem>
            <Guid>Welcome Back ...</Guid>
            <StyledLink to="/login">
              <StyledButton>Login</StyledButton>
            </StyledLink>
          </StyledListItem>
          <StyledListItem>
            <Guid>Join us here ...</Guid>
            <StyledLink to="/register">
              <StyledButton>Register</StyledButton>
            </StyledLink>
          </StyledListItem>
        </StyledList>
      </FormContainer>
    </FormWrapper>
  );
};

export default Welcome;

const FormWrapper = styled.div`
  position: relative;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  height: 100vh;
  @media (max-width: 1200px) {
    background-image: url("https://res.cloudinary.com/dtb1hpuil/image/upload/v1700777557/q7_ly4wlv.jpg");
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  right: 25%;
  align-items: center;
  height: 100vh;
`;

const Heading = styled.h1`
  position: relative;
  top: 10%;
  left: -10%;
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
  @media (max-width: 1200px) {
    top: 8%;
    left: 5%;
  }
  @media (max-width: 730px) {
    top: 12%;
    left: 25%;
  }
`;

const StyledList = styled.ul`
  position: relative;
  text-align: center;
  top: 35%;
  left: 5px;
  margin-bottom: 40px;
  list-style: none;
  padding: 0;
  margin: 0;
  @media (max-width: 1200px) {
    top: 25%;
    left: 10%;
  }
  @media (max-width: 730px) {
    top: 35%;
    left: 22%;
    color: #05445e;
  }
`;

const StyledListItem = styled.li`
  margin-bottom: 50px;
  padding: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const StyledButton = styled.button`
  height: 50px;
  width: 12rem;
  border-radius: 12px;
  border: 0;
  outline: 0;
  background: #75e6da;
  font-size: 17px;
  margin-top: 1rem;
  color: #05445e;
  cursor: pointer;
  font-weight: bolder;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.5);
  &:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease-in-out;
  }
`;

const Slogan = styled.p`
  max-width: 90%;
  text-align: center;
  position: relative;
  top: 30%;
  left: -1%;
  margin-top: 1rem;
  font-size: 20px;
  color: #75e6da;
  font-weight: 500;
  @media (max-width: 1200px) {
    top: 20%;
    left: 12%;
    color: #05445e;
  }
  @media (max-width: 730px) {
    top: 32%;
    left: 20%;
    color: #05445e;
  }
`;

const Guid = styled.div`
  margin-top: 1rem;
  font-size: 20px;
  color: #75e6da;
  font-weight: 500;
`;
