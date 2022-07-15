import Vue from "vue";
import VueRouter from "vue-router";
import HomeMenu from "../pages/HomeMenu.vue";
import ReadArticle from "../pages/ReadArticle.vue";
import ArticleList from "../pages/ArticleList.vue";
import CreateArticle from "../pages/CreateArticle.vue";
import UpdateArticle from "../pages/UpdateArticle.vue";

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: HomeMenu,
    },
    {
      path: "/article",
      name: "article",
      component: ReadArticle,
    },
    {
      path: "/article/list",
      name: "article-list",
      component: ArticleList,
    },
    {
      path: "/create",
      name: "create",
      component: CreateArticle,
    },
    {
      path: "/update",
      component: UpdateArticle,
    },
  ],
});
