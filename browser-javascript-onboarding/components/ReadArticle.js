export default function ReadArticle (render) {
  const notFound = {
    init () {
      this.fetchFreeBoardArticle().
      then(({title, content, viewCnt, registerName, registerYmdt}) => {
        this.render ({title, content, viewCnt, registerName, registerYmdt});
      })
    }, 
    
    get articleNo() {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get("articleNo")
    },

    fetchFreeBoardArticle () {
      return api.getArticle(BOARD_NO, this.articleNo)
    },
    render () {
      render(`<h1>게시글 상세보기</h1>`)
    },

    
  }

  ReadArticle.init()

  return ReadArticle
}
