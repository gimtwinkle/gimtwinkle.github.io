const SHOP_API_URL = import.meta.env.VITE_SHOP_API_URL;
const SHOP_CLIENT_ID = import.meta.env.VITE_SHOP_CLIENT_ID;

const httpRequest = ({ url, method, requestBody }) =>
  fetch(SHOP_API_URL + url, {
    method, // GET, POST, PUT, DELETE
    headers: {
      clientId: SHOP_CLIENT_ID,
      Version: "1.0",
      platform: "MOBILE",
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(requestBody)
  }).then(response => method === 'GET' ? response.json() : response)
   
const api = {
  getBoardConfig: () =>
    httpRequest({
      url: "/boards/configurations",
      method: "GET",
    }),
  getArticles: (boardNo, pageNo) =>
    httpRequest({
      url: `/boards/${boardNo}/articles?hasTotalCount=true&pageSize=10&pageNumber=${pageNo}`,
      method: "GET",
    }),
    
  getArticle: (boardNo, articleNo) =>
    httpRequest({
      url: `/boards/${boardNo}/articles/${articleNo}`,
      method: "GET",
    }),
  
  postArticleNotLogin: (boardNo, { guestName, password, articleContent, articleTitle }) =>
    httpRequest({
      url: `/boards/${boardNo}/articles`,
      method: 'POST',
      requestBody : {
        guestName, password, articleContent, articleTitle,
        secreted: false
        }
    }),
  
  putArticleNotLogin: (boardNo, { guestName, password, articleContent, articleTitle, articleNo }) =>
    httpRequest({
      url: `/boards/${boardNo}/articles/${articleNo}`,
      method: 'PUT',
      requestBody : {
        guestName, password, articleContent, articleTitle, articleNo,
        secreted: false
        }
    }),
};

export default api;
