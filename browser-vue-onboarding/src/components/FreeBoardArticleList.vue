<template>
  <div class="table">
    <div class="table__btn--box">
      <router-link :to="{ name: 'create' }" class="table__btn"
        >글쓰기</router-link
      >
    </div>
    <table class="table__board--list">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>등록일</th>
          <th>조회수</th>
        </tr>
      </thead>
      <tbody class="articleList">
        <tr v-for="article in articles" v-bind:key="article.articleNo">
          <td>{{ article.articleNo }}</td>
          <td>
            <router-link
              :to="{
                name: 'article',
                query: { articleNo: `${article.articleNo}` },
              }"
            >
              <strong v-if="article.notice" class="label-notice">공지</strong>
              {{ article.title }}
            </router-link>
          </td>
          <td class="board-date">{{ article.registerYmdt.substr(0, 10) }}</td>
          <td class="board-count">{{ article.viewCnt }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="js">
export default {
  props : {
    articles : Array
  }
}
</script>
