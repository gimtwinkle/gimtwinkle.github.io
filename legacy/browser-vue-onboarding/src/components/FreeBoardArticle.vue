<template>
  <div class="table">
    <table class="table__board--detail">
      <colgroup>
        <col style="width: 15%" />
        <col style="width: 30%" />
        <col style="width: auto" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="3">
            <strong v-if="article.notice" class="label-notice">공지</strong>
            {{ article.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>작성자 : {{ article.registerName }}</td>
          <td>작성일 : {{ article.registerYmdt.substr(0, 10) }}</td>
          <td>조회수 : {{ article.viewCnt }}</td>
        </tr>
        <tr>
          <td colspan="3">
            {{ article.content }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="js">
export default {
  props : {
    article : Object
  }
}
</script>
