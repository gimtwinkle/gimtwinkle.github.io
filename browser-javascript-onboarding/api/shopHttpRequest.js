import { getSearchParams } from '../utilities/url'

const SHOP_API_URL = import.meta.env.VITE_SHOP_API_URL
const SHOP_CLIENT_ID = import.meta.env.VITE_SHOP_CLIENT_ID

const httpRequest = ({ url, method, requestBody }) => fetch(SHOP_API_URL + url, {
  method, // GET, POST, PUT, DELETE
  headers: {
    clientId: SHOP_CLIENT_ID,
    Version: '1.0',
    platform: 'MOBILE',
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: JSON.stringify(requestBody)
})

const api = {
  getArticles: ({ boardNo, pageNumber, pageSize }) => {
    const queryString = getSearchParams({ pageNumber, pageSize, hasTotalCount: true })

    return httpRequest({
      url: `/boards/${boardNo}/articles?${queryString}`,
      method: 'GET',
    }).then(response => response.json())
  },
  postArticleNoneMember: ({ boardNo, requestBody: { guestName, password, articleTitle, articleContent }}) => {
    return httpRequest({
      url: `/boards/${boardNo}/articles`,
      method: 'POST',
      requestBody: {
        guestName, password, articleTitle, articleContent, secreted: false
      }
    })
  }
}

export default api;
