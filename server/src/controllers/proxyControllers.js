import asyncHandler from "express-async-handler";
import fetch from "node-fetch";

export const getNews = asyncHandler(async (req, res) => {
  const response = await fetch(
    "https://ind.nl/en/news?f[0]=facets_news:Asylum"
  );
  const data = await response.text();

  res.status(200).send({ success: true, data: data });
});
