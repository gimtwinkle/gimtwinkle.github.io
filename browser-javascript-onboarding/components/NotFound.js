export default function NotFound (render) {
  const notFound = {
    init () {
      this.render()
    },
    render () {
      render(`<h1>페이지를 찾을 수 없습니다.</h1>`)
    },
  }

  notFound.init()

  return notFound
}
