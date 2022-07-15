<template>
  <div>
    <free-board-article-list :articles="articles" />
    <list-pagination
      v-if="totalCount > 10"
      :totalCount="totalCount"
      :pageSize="pageSize"
      :currentPageNumber="pageNumber"
    />
  </div>
</template>
<script lang="js">
import FreeBoardArticleList from '../components/FreeBoardArticleList.vue'
import ListPagination from '../components/ListPagination.vue'
import { getArticles } from "../api/index.js";

const BOARD_NO = 2800;
const PAGE_SIZE = 10;

export default {
    components: {
        FreeBoardArticleList,
        ListPagination
    },
    data() {
        return {
            articles: [],
            totalCount: null,
            pageSize: PAGE_SIZE,
        }
    },
    created() {
        this.fetchFreeBoardArticles();
    },
    methods: {
        fetchFreeBoardArticles(){
            getArticles(BOARD_NO, this.pageNumber)
            .then(response => {
                this.articles = response.data.items
                this.totalCount = response.data.totalCount;
            })
        }
    },
    computed: {
        pageNumber() {
            const pageNo  = Number(this.$route.query.pageNumber) || 1
            return pageNo;
        },
    },
    watch: {
        "$route.query.pageNumber": function () {
        this.fetchFreeBoardArticles();
    },
  },
}
</script>
<style lang="scss"></style>
