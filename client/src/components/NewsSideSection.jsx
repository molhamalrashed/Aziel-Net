import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useFetch from "../hooks/useFetch";

const NewsSideSection = () => {
  const token = localStorage.getItem("token");
  const [articles, setArticles] = useState([]);

  const onReceived = (response) => {
    if (!response.error) {
      const htmlContent = response.data;

      // Create a DOMParser instance
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const baseUrl = "https://ind.nl";

      // Extract articles
      const extractedArticles = Array.from(
        doc.querySelectorAll(".article")
      ).map((element) => {
        return {
          date: element.querySelector(".article__date").textContent.trim(),
          title: element.querySelector(".article__title").textContent.trim(),
          description: element
            .querySelector(".article__description")
            .textContent.trim(),
          link:
            baseUrl +
            element.querySelector(".article__title").getAttribute("href"),
        };
      });

      setArticles(extractedArticles);
    }
  };

  const openLinkInNewTab = (link) => {
    window.open(link, "_blank");
  };

  const { performFetch, cancelFetch, isLoading, error } = useFetch(
    "/proxy/get",
    onReceived
  );

  const fetchData = () => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    performFetch(options);
  };

  useEffect(() => {
    fetchData();

    // Add empty dependency array
    return cancelFetch;
  }, []);

  return (
    <Container>
      <NewsContainer>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          articles.map((article, index) => (
            <Item key={index}>
              <Details>
                <NewsDate>{article.date}</NewsDate>
                <NewsName>
                  <ArticleLink onClick={() => openLinkInNewTab(article.link)}>
                    {article.title}
                  </ArticleLink>
                </NewsName>
              </Details>
              <NewsText>{article.description}</NewsText>
            </Item>
          ))
        )}
      </NewsContainer>
    </Container>
  );
};
export default NewsSideSection;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 49rem;
`;

const NewsContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const Item = styled.div`
  align-items: center;
  margin-bottom: 1.2rem;
  padding-right: 0.2rem;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 3px; /* Adjust the height as needed */
    background: linear-gradient(to right, #05445e, #d4f1f4, #05445e);
  }
`;

const NewsName = styled.div`
  font-weight: bold;
`;

const Details = styled.div`
  font-size: 1rem;
  flex-direction: column;
`;

const NewsDate = styled.div`
  display: inline-block;
  background-color: #189ab4;
  color: white;
  border-radius: 4px;
  padding: 3px;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
`;

const ArticleLink = styled(Link)`
  text-decoration: none;
  color: #1877f2;
`;

const NewsText = styled.div`
  text-align: justify;
`;
