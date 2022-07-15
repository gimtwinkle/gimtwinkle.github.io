import api from "../api/shopHttpRequest";

const BOARD_NO = 2800;

export default function ReadArticle ($app) {
  const ReadArticle = {
    init () {
      if (!this.articleNo) {
        alert('잘못된 접근입니다.') 
        location.href = '/'
        return;
      } 
      this.fetchFreeBoardArticle(this.articleNo).
      then(article => this.render(article)).
      catch(error =>{
        alert(`존재하지 않는 게시글 입니다.`),
        location.href = '/'
        return;
      }) 
    },
    get articleNo() {
      const searchParams = new URLSearchParams(location.search);
      const articleNo = Number(searchParams.get("articleNo"));
      return isNaN(articleNo) ?  null : articleNo // articleNo 있을 경우 number, 없을경우 null 반환
    },

    fetchFreeBoardArticle () {
      return api.getArticle(BOARD_NO, this.articleNo)
    },

    render (article) {
      $app.innerHTML = `
      <table class ="table__board--detail">
        <colgroup>
            <col style="width:15%">
            <col style="width:30%">
            <col style="width:auto">
        </colgroup>
        <thead>
          <tr>
            <th colspan="3">
              ${article.notice ? `<strong class="label__notice">공지</strong>` : ``}
              ${article.title}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
              <td>작성자 : ${article.registerName}</td>
              <td>작성일 : ${article.registerYmdt.substr(0,10)}</td>
              <td>조회수 : ${article.viewCnt}</td>
          </tr>
          <tr>
              <td colspan="3">
                ${article.content}
              </td>
          </tr>
        </tbody>
      </table>
      <div class="board__btn--box">
        <a href="javascript:;" class="board__btn" onclick="window.history.back();">목록</a>
        <a href="/article/update?articleNo=${this.articleNo}" class="board__btn" id="articleUpdate">수정</a>
      </div>
  
      
    `
    },

    
  }

  ReadArticle.init()

  return ReadArticle
}
