import React from "react";
import styled from "styled-components";

const EventSideSection = () => {
  return (
    <Container>
      <Item>
        <EventImage
          src="https://c.animaapp.com/shx7UmdF/img/rectangle-117-2@2x.png"
          alt="Party"
        />
        <DetailsWrapper>
          <Details>
            <EventName>Party</EventName>
            <EventDate>18 November</EventDate>
          </Details>
          <EventLink
            alt="Vector"
            src="https://c.animaapp.com/shx7UmdF/img/vector-7.svg"
          ></EventLink>
        </DetailsWrapper>
      </Item>
      <Item>
        <EventImage
          src="https://c.animaapp.com/shx7UmdF/img/rectangle-117-2@2x.png"
          alt="Party"
        />
        <DetailsWrapper>
          <Details>
            <EventName>Concert</EventName>
            <EventDate>2 December</EventDate>
          </Details>
          <EventLink
            alt="Vector"
            src="https://c.animaapp.com/shx7UmdF/img/vector-7.svg"
          ></EventLink>
        </DetailsWrapper>
      </Item>
      <Item>
        <EventImage
          src="https://c.animaapp.com/shx7UmdF/img/rectangle-117-2@2x.png"
          alt="Party"
        />
        <DetailsWrapper>
          <Details>
            <EventName>New Year Eve</EventName>
            <EventDate>31 December</EventDate>
          </Details>
          <EventLink
            alt="Vector"
            src="https://c.animaapp.com/shx7UmdF/img/vector-7.svg"
          ></EventLink>
        </DetailsWrapper>
      </Item>
    </Container>
  );
};

export default EventSideSection;
const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  padding: 0 0.7rem;
`;

const EventImage = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 0.2rem;
`;

const EventName = styled.div`
  margin-left: 1rem;
  font-weight: bold;
`;

const Details = styled.div`
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const EventDate = styled.div`
  margin-left: 1rem;
  font-size: 0.8rem;
`;

const DetailsWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const EventLink = styled.img`
  cursor: pointer;
`;
