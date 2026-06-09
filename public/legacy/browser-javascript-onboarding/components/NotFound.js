export default function NotFound ($app) {
  const notFound = {
    init () {
      this.render()
    },
    render () {
      $app.innerHTML = `<h1>페이지를 찾을 수 없습니다.</h1>`
    },
  }

  notFound.init()

  return notFound
}
