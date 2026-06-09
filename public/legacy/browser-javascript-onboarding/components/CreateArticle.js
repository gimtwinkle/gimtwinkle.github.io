import api from "../api/shopHttpRequest";

const BOARD_NO = 2800;

export default function CreateArticle ($app) {
  const CreateArticle = {
    init () {
      this.render();
      this.bindSubmitEvent ();
      this.bineCancelEvent();
    },
    
    postArticle() {
      api.postArticleNotLogin(BOARD_NO, this.getFormData())
    },

    bindSubmitEvent () {
      const $articleForm = document.querySelector('#articleForm');
      $articleForm.addEventListener('submit', event => {
        event.preventDefault();
        if(this.validation()){
          this.postArticle();
          alert('게시글이 등록되었습니다.');
          location.href = '/article/list'
        }
      })
    },

    bineCancelEvent(){
      const $createArticleCancel = document.querySelector('#createArticleCancel');
      $createArticleCancel.addEventListener('click', event =>{
        event.preventDefault();
        if(window.confirm(`게시글 등록을 취소 하시겠습니까?`)){
          location.href = '/article/list' 
        }
      }) 
    },

    render () {
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
            <td><input type="text" id="guestName" name="guestName" value=""></td>
            <th><label for="password">비밀번호</label></th>
            <td><input type="password" id="password" name="password" value=""></td>
          </tr>
          <tr>
            <th><label for="articleTitle">제목</label></th>
            <td colspan="3"><input type="text" id="articleTitle" name="articleTitle" value=""></td>
          </tr>
          <tr>
            <th><label for="articleContent">내용</label></th>
            <td colspan="3"><textarea id="articleContent" name="articleContent" rows="4"></textarea></td>
          </tr>
        </table>
        <div class="board__btn--box">
          <input type="Submit" class="board__btn" value="등록">  
          <button class="board__btn" id="createArticleCancel">취소</button>
        </div>
      </form>
      `
    },
    
    getFormData () {
      const guestName = document.querySelector('#guestName').value;
      const password = document.querySelector('#password').value;
      const articleTitle = document.querySelector('#articleTitle').value;
      const articleContent = document.querySelector('#articleContent').value;
      
      return { guestName, password, articleTitle, articleContent } 
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

  CreateArticle.init()
  return CreateArticle
}
