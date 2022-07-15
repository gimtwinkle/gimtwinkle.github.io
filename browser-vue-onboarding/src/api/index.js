import axios from "axios";

const httpRequestInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    clientId: process.env.VUE_APP_API_CLIENT_ID,
    Version: process.env.VUE_APP_API_VERSION,
    "Content-Type": "application/json;charset=utf-8",
  },
});

function getArticles(boardNo, pageNo) {
  return httpRequestInstance.get(
    `/boards/${boardNo}/articles?hasTotalCount=true&pageSize=10&pageNumber=${pageNo}`
  );
}

function getArticle(boardNo, articleNo) {
  return httpRequestInstance.get(`/boards/${boardNo}/articles/${articleNo}`);
}

function postArticleNotLogin(
  boardNo,
  { guestName, password, articleContent, articleTitle }
) {
  return httpRequestInstance.post(`/boards/${boardNo}/articles`, {
    guestName,
    password,
    articleContent,
    articleTitle,
    secreted: false,
  });
}

export { getArticles, getArticle, postArticleNotLogin };
