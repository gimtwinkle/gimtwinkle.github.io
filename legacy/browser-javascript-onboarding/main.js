import './assets/style.scss'
import Router from './utilities/Router'
import Home from './components/Home'
import ReadArticle from './components/ReadArticle'
import ArticleList from './components/ArticleList'
import CreateArticle from './components/CreateArticle'
import NotFound from './components/NotFound'
import UpdateArticle from './components/UpdateArticle'

function Main () {
  const $app = document.getElementById('app')

  const main = {
    router: null,
    instance: null,
    init () {
      this.setRouter()
      this.bindEvents()
    },
    setRouter() {
      this.router = new Router({
        routes: {
          '/': Home,
          '/article': ReadArticle,
          '/article/list': ArticleList,
          '/article/create': CreateArticle,
          '/article/update': UpdateArticle,
          'NOT_FOUND': NotFound,
        },
        change: this.renderPage.bind(this),
      });
    },
    renderPage (Page) {
      $app.innerHTML = '';
      this.instance = new Page($app)
    },
    bindEvents() {
      $app.addEventListener('click', event => {
        const isAnchor = event.target.tagName === 'A' && event.target.href
        if (!isAnchor) return;
        const isInside = new URL(event.target.href)?.host === location.host;
        if (!isInside) return;
        this.onClickLinkElement(event)
      })
    },
    onClickLinkElement(event) {
      event.preventDefault()
      this.router.push(event.target.href)
    }
  }

  main.init()

  return main
}

document.addEventListener('DOMContentLoaded', () => new Main())

