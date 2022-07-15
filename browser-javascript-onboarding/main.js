import './assets/style.scss'
import Router from './utilities/Router'
import Home from './components/Home'
import ReadArticle from './components/ReadArticle'
import ArticleList from './components/ArticleList'
import CreateArticle from './components/CreateArticle'
import NotFound from './components/NotFound'

function Main () {
  const $app = document.getElementById('app')

  const main = {
    router: null,
    init () {
      this.setRouter()
      this.bindEvents()
    },
    setRouter () {
      this.router = new Router({
        routes: {
          '/': Home,
          '/article': ReadArticle,
          '/article/list': ArticleList,
          '/article/create': CreateArticle,
          'NOT_FOUND': NotFound,
        },
        change: this.mount.bind(this),
      })
    },
    mount (Page, push) {
      $app.innerHTML = ''
      new Page(this.render, push)
    },
    bindEvents () {
      $app.addEventListener('click', event => {
        const isAnchor = event.target.tagName === 'A' && event.target.href
        if (!isAnchor) {
          return
        }
        const isInside = new URL(event.target.href)?.host === location.host
        if (!isInside) {
          return
        }
        this.onClickLinkElement(event)
      })
    },
    render (htmlTemplate) {
      const isElement = Boolean(htmlTemplate?.tagName)
      if (isElement) {
        $app.append(htmlTemplate)
        return;
      }

      $app.insertAdjacentHTML(
        'beforeend',
        htmlTemplate
      )
    },
    onClickLinkElement (event) {
      event.preventDefault()
      this.router.push(event.target.href)
    },
  }

  main.init()

  return main
}

document.addEventListener('DOMContentLoaded', () => new Main())

