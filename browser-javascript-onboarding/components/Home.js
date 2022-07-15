export default function Home ($app) {
  const main = {
    init () {
      this.render()
    },
    render () {
      $app.innerHTML = `
        <h1>메뉴</h1>
        <nav>
          <ul>
            <li><a href="/article/list">게시판</a></li>  
          </ul>
        </nav>
      `
    },
  }

  main.init()

  return main
}