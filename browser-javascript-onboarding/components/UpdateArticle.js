import api from "../api/shopHttpRequest";

const BOARD_NO = 2800;

export default function updateArticle ($app) {
  const updateArticle = {
    init () {
      this.fetchFreeBoardArticle().
      then(article => {
        this.render(article)
        this.bindSubmitEvent()
        this.bineCancelEvent()  
      });
      
    },
  
    get articleNo() {
      const searchParams = new URLSearchParams(location.search);
      const articleNo = Number(searchParams.get("articleNo"));
      return isNaN(articleNo) ?  null : articleNo
    },

    fetchFreeBoardArticle () {
      return api.getArticle(BOARD_NO, this.articleNo)
    },
    
    async putArticle() {
      const response = await api.putArticleNotLogin(BOARD_NO, this.getFormData())
      if(response.status === 200 || response.status === 204){
        alert('게시글이 수정되었습니다.');
        window.history.back();  
      }else{
        const data = await response.json()
        alert(data.message);
      }
    },

    bindSubmitEvent () {
      const $articleForm = document.querySelector('#articleForm');
      $articleForm.addEventListener('submit', event => {
        event.preventDefault();
        if(this.validation()){
          this.putArticle();
        }
      })
    },

    bineCancelEvent(){
      const $updateArticleCancel = document.querySelector('#updateArticleCancel');
      $updateArticleCancel.addEventListener('click', event =>{
        event.preventDefault();
        if(window.confirm(`게시글 수정을 취소 하시겠습니까?`)){
          window.history.back();
        }
      }) 
    },

    render (article) {
      $app.innerHTML = `
      <form id="articleForm">
        <table class ="table__board--detail col">
          <colgroup>
              <col style="width:15%">
              <col style="width:30%">
              <col style="width:auto">
          </colgroup>
          <tr>
            <th><label for="guestName">작성자</label></th>
            <td><input type="text" id="guestName" name="guestName" value="${article.registerName}"></td>
            <th><label for="password">비밀번호</label></th>
            <td><input type="password" id="password" name="password" value="" placeholder="글 등록시 비밀번호"></td>
          </tr>
          <tr>
            <th><label for="articleTitle">제목</label></th>
            <td colspan="3"><input type="text" id="articleTitle" name="articleTitle" value="${article.title}"></td>
          </tr>
          <tr>
            <th><label for="articleContent">내용</label></th>
            <td colspan="3"><textarea id="articleContent" name="articleContent" rows="4">${article.content}</textarea></td>
          </tr>
        </table>
        <div class="board__btn--box">
          <input type="Submit" class="board__btn" value="수정">  
          <button class="board__btn" id="updateArticleCancel">취소</button>
        </div>
      </form>
      `
    },
    
    getFormData () {
      const guestName = document.querySelector('#guestName').value;
      const password = document.querySelector('#password').value;
      const articleTitle = document.querySelector('#articleTitle').value;
      const articleContent = document.querySelector('#articleContent').value;
      const articleNo = this.articleNo;
      
      return { guestName, password, articleTitle, articleContent, articleNo } 
    },

    validation () {
      if (guestName.value==="") {
        alert('작성자 명을 입력하여 주세요.')
        return false
      }

      if (password.value==="") {
        alert('비밀번호를 입력하여 주세요.')
        return false
      }

      if (articleTitle.value==="") {
        alert('제목을 입력하여 주세요.')
        return false
      }

      if (articleContent.value==="") {
        alert('내용을 입력하여 주세요.')
        return false
      }

      return true
    },
  }

  updateArticle.init()
  return updateArticle
}
