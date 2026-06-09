<template>
  <div id="app">
    <free-board-article :article="article" />
  </div>
</template>
<script lang="js">
  import { getArticle } from "../api/index.js";
  import FreeBoardArticle from '../components/FreeBoardArticle.vue'

  const BOARD_NO = 2800;

  export default {
    components: {
        FreeBoardArticle
    },
    data() {
        return {
            article: null
        }
    },
    created() {
        this.fetchFreeBoardArticle();
    },
    methods: {
        fetchFreeBoardArticle(){
           getArticle(BOARD_NO, this.articleNo)
            .then(response => {
                this.article = response.data
            })
        }
    },
    computed: {
        articleNo() {
            const articleNo  = Number(this.$route.query.articleNo) || 1
            return articleNo;
        },
    },
    watch: {
        "$route.query.articleNo": function () {
            this.fetchFreeBoardArticle();
        }
    }
}
</script>
<style lang="scss"></style>
