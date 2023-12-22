import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input";
import useFetch from "../../hooks/useFetch";
import TEST_ID from "./CreateUser.testid";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
const backgroundImage =
  "https://res.cloudinary.com/dtb1hpuil/image/upload/v1700775170/q5_rmntjh.jpg";
const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = () => {
    return email.includes("@");
  };

  const isPasswordValid = () => {
    const validPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return validPattern.test(password);
  };
  const isPasswordConfirmValid = () => {
    return confirmPassword === password && confirmPassword !== "";
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const isFormValid = () => {
    return isEmailValid() && isPasswordValid() && isPasswordConfirmValid();
  };

  const onSuccess = (response) => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    localStorage.setItem("token", response.token);
    localStorage.setItem("userId", response.user._id);
    localStorage.setItem("username", response.user.username);
    localStorage.setItem("user", JSON.stringify(response.user));
    navigate("/home");
  };

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/auth/register",
    onSuccess
  );

  useEffect(() => {
    return cancelFetch;
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid()) {
      performFetch({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
    }
  };
  let statusComponent = null;
  if (error != null) {
    statusComponent = (
      <div data-testid={TEST_ID.errorContainer}>{error.toString()}</div>
    );
  } else if (isLoading) {
    statusComponent = (
      <div data-testid={TEST_ID.loadingContainer}>Creating user....</div>
    );
  }

  return (
    <FormWrapper>
      <FormContainer>
        <Container>
          <Heading>
            <span className="white">SIGN</span>{" "}
            <span className="black">UP</span>
          </Heading>
          <Form onSubmit={handleSubmit}>
            <InputField>
              <StyledInput
                name="username"
                placeholder="Username"
                value={username}
                onChange={(value) => setUsername(value)}
                data-testid={TEST_ID.nameInput}
              />
              <GuideList>
                <li>No spaces in the username</li>
              </GuideList>
            </InputField>
            <InputField>
              <StyledInput
                name="email"
                value={email}
                placeholder="Email"
                onChange={(value) => setEmail(value)}
                style={{
                  backgroundColor:
                    email.trim() !== ""
                      ? isEmailValid()
                        ? "rgba(217, 250, 190, 0.5)"
                        : "rgba(255, 96, 82, 0.5)"
                      : "auto",
                }}
                data-testid={TEST_ID.emailInput}
              />
              <GuideList>
                <li>Enter a valid email</li>
              </GuideList>
            </InputField>
            <InputField>
              <StyledInput
                name="password"
                value={password}
                placeholder="Password"
                onChange={(value) => setPassword(value)}
                type={showPassword ? "text" : "password"}
                style={{
                  backgroundColor:
                    password.trim() !== ""
                      ? isPasswordValid()
                        ? "rgba(217, 250, 190, 0.5)"
                        : "rgba(255, 96, 82, 0.5)"
                      : "auto",
                }}
                data-testid={TEST_ID.emailInput}
              />
              <IconWrapper onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </IconWrapper>
              <GuideList>
                <li>At least 8 characters including letters and numbers</li>
              </GuideList>
            </InputField>
            <InputField>
              <StyledInput
                name="confirm password"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(value) => setConfirmPassword(value)}
                type={showPassword ? "text" : "password"}
                style={{
                  backgroundColor:
                    confirmPassword.trim() !== ""
                      ? isPasswordConfirmValid()
                        ? "rgba(217, 250, 190, 0.5)"
                        : "rgba(255, 96, 82, 0.5)"
                      : "auto",
                }}
                data-testid={TEST_ID.emailInput}
              />
              <IconWrapper onClick={togglePasswordVisibility}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </IconWrapper>
              <GuideList>
                <li>Re-Enter your password</li>
              </GuideList>
            </InputField>
            <StyledButton type="submit" data-testid={TEST_ID.submitButton}>
              SUBMIT
            </StyledButton>
          </Form>
          <ErrorDiv>{statusComponent}</ErrorDiv>
        </Container>
      </FormContainer>
    </FormWrapper>
  );
};
export default CreateUser;

const FormWrapper = styled.div`
  background-image: url(${backgroundImage});
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  background-color: white;
  margin: 1rem;
  width: 500px;
  min-width: 340px;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  overflow: hidden;
  border-radius: 20px;
  border: 3px solid #05445e;
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.3);
`;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputField = styled.div`
  width: 100%;
  margin: 12px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 15px;
`;

const StyledInput = styled(Input)`
  height: 50px;
  width: 100%;
  font-size: 17px;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid rgba(102, 102, 102, 0.35);
  padding: 5px;
  &:focus {
    outline: none;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
`;

const GuideList = styled.ul`
  margin: 5px auto 5px 0px;
  display: flex;
  font-color: gray;
  color: gray;
  list-style: none;
`;

const StyledButton = styled.button`
  height: 50px;
  width: 12rem;
  border-radius: 12px;
  border: 0;
  outline: 0;
  background: #189ab4;
  font-size: 17px;
  margin-top: 1rem;
  color: white;
  cursor: pointer;
  font-weight: bolder;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.3s ease-in-out;
    .SubmitButton:active {
      box-shadow: none;
    }
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  top: 35%;
  transform: translateY(-50%);
  cursor: pointer;
  svg {
    font-size: 1.5em;
    color: #777;
    transition: color 0.3s;
    &:hover {
      color: #0099ff;
    }
  }
`;

const ErrorDiv = styled.div`
  font-size: 17px;
  padding: 5px;
  margin-top: 1rem;
  color: red;
`;
