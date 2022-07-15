<template>
  <div class="table">
    <form id="articleForm" @submit="handleSubmitEvent">
      <table class="table__board--detail col">
        <colgroup>
          <col style="width: 15%" />
          <col style="width: 30%" />
          <col style="width: auto" />
        </colgroup>
        <tbody>
          <tr>
            <th><label for="guestName">작성자</label></th>
            <td>
              <input
                type="text"
                id="guestName"
                v-model="guestName"
                name="guestName"
              />
            </td>
            <th><label for="password">비밀번호</label></th>
            <td>
              <input
                type="password"
                id="password"
                v-model="password"
                name="password"
              />
            </td>
          </tr>
          <tr>
            <th><label for="articleTitle">제목</label></th>
            <td colspan="3">
              <input
                type="text"
                id="articleTitle"
                v-model="articleTitle"
                name="articleTitle"
              />
            </td>
          </tr>
          <tr>
            <th><label for="articleContent">내용</label></th>
            <td colspan="3">
              <textarea
                id="articleContent"
                v-model="articleContent"
                name="articleContent"
                rows="4"
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="table__btn--box">
        <input type="Submit" class="table__btn" value="등록" />
        <button class="table__btn" @click="handleCancelEvent">취소</button>
      </div>
    </form>
  </div>
</template>
<script lang="js">
import { postArticleNotLogin } from "../api/index.js";

const BOARD_NO = 2800;

export default {
  data() {
      return {
        guestName : null,
        password : null,
        articleTitle : null,
        articleContent : null
      }
  },
  methods: {
    postArticle(){
      postArticleNotLogin(BOARD_NO, this.getFormData())
      .then(response => {
        response
        alert('게시글이 등록되었습니다.');
        this.$router.push({ name: 'article-list'});
      })
      .catch(error =>{
        alert(error.response.data.message)
      });
    },

    handleSubmitEvent (e) {
      e.preventDefault();
      if(this.validation()){
          this.postArticle();
        }
    },

    handleCancelEvent(e) {
      e.preventDefault();
      if (window.confirm(`게시글 등록을 취소 하시겠습니까?`)) {
        this.$router.push({ name: 'article-list'});
      }
    },

    getFormData () {
      const getFormData = {
        guestName : String(this.guestName),
        password : String(this.password),
        articleTitle : String(this.articleTitle),
        articleContent : String(this.articleContent)
      }
      return getFormData;
    },

    validation () {
      if (!this.guestName) {
        alert('작성자 명을 입력하여 주세요.');
        return false;
      }
      if (!this.password) {
        alert('비밀번호를 입력하여 주세요.');
        return false;
      }
      if (!this.articleTitle) {
        alert('제목을 입력하여 주세요.');
        return false;
      }
      if (!this.articleContent) {
        alert('내용을 입력하여 주세요.');
        return false;
      }

      return true;
    },
  },
}
</script>
<style lang="scss"></style>
