<template>
  <div class="pagination">
    <router-link
      class="pagination__btn pagination__btn--arrow first"
      :to="{ name: 'article-list', query: { pageNumber: 1 } }"
    >
      첫번째로 가기
    </router-link>
    <router-link
      class="pagination__btn pagination__btn--arrow prev"
      :to="{
        name: 'article-list',
        query: { pageNumber: `${currentPageNumber - 1}` },
      }"
    >
      전페이지로 가기
    </router-link>
    <ol class="pagination__list">
      <li
        v-for="pageNo in getCurrentPageRange(currentPageNumber, totalCount)"
        :key="pageNo"
      >
        <strong v-if="pageNo === currentPageNumber">{{ pageNo }}</strong>
        <router-link
          v-else
          class="pagination__btn"
          :to="{ name: 'article-list', query: { pageNumber: `${pageNo}` } }"
          >{{ pageNo }}</router-link
        >
      </li>
    </ol>

    <router-link
      class="pagination__btn pagination__btn--arrow next"
      :to="{
        name: 'article-list',
        query: { pageNumber: `${currentPageNumber + 1}` },
      }"
    >
      다음페이지로 가기
    </router-link>
    <router-link
      class="pagination__btn pagination__btn--arrow last"
      :to="{ name: 'article-list', query: { pageNumber: `${lastPageNumber}` } }"
    >
      마지막페이지로 가기
    </router-link>
  </div>
</template>
<script>
export default {
  props: {
    totalCount: Number,
    pageSize: Number,
    currentPageNumber: Number,
  },
  data() {
    return {
      lastPageNumber: Math.ceil(this.totalCount / this.pageSize),
    };
  },
  methods: {
    getCurrentPageRange(currentPageNumber, totalCount) {
      const VIEW_COUNT = 9;

      const pageRange = this.getPageRange(totalCount);
      const half = Math.floor(VIEW_COUNT / 2);
      const startIndex = pageRange.indexOf(currentPageNumber) - half;

      // 앞쪽 페이지 일 경우 head 에서 부터 정해진 갯수만큼 반환
      const isFrontPosition = startIndex <= 0;
      if (isFrontPosition) {
        return pageRange.splice(0, VIEW_COUNT);
      }

      // 뒤쪽 페이지 일 경우 tail 에서 부터 정해진 갯수만큼 반환
      const isMiddlePosition = startIndex + VIEW_COUNT > pageRange.length;
      if (isMiddlePosition) {
        return pageRange.splice(pageRange.length - VIEW_COUNT);
      }

      return pageRange.splice(startIndex, VIEW_COUNT);
    },

    getPageRange(totalCount) {
      return Array.from(
        Array(Math.ceil(totalCount / this.pageSize)),
        (_, i) => i + 1
      );
    },
  },
};
</script>
<style lang="scss"></style>
