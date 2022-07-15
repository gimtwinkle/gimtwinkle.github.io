import api from '../api/shopHttpRequest'
import { getSearchParam } from '../utilities/url'

export default function ArticleList (render) {
  const BOARD_ID = 'free'
  const PAGE_SIZE = 15

  const articleList = {
    async init () {
      this.fetchArticles(BOARD_ID).then(({ items, totalCount }) => {
        this.render(items)
        this.pagination.init(this.pageNumber, totalCount)
      })
    },
    fetchArticles () {
      return api.getArticles({
        boardNo: BOARD_ID,
        pageSize: PAGE_SIZE,
        pageNumber: this.pageNumber,
      })
    },
    get pageNumber () {
      const pageNumber = getSearchParam('pageNumber');
      return Number(pageNumber) || 1
    },
    render (articles) {
      render(`
        <div>
          <a href="/article/create?boardNo=${BOARD_ID}">게시글 작성하기</a>
        </div>
        <table class="board-list">
        <colgroup>
          <col style="width:65%" />
          <col style="width:20%" />
          <col style="width:15%" />
        </colgroup>
        <thead>
        <tr>
          <th scope="row">제목</th>
          <th scope="row">등록일</th>
          <th scope="row">조회수</th>
        </tr>
        </thead>
        <tbody>
        ${
        articles.map(article => `
          <tr>
            <td class="title"><a href="/article?articleNo=${article.articleNo}">${article.title}</a></td>
            <td class="date">${article.registerYmdt.substring(0, 10)}</td>
            <td class="view">${article.viewCnt}</td>
          </tr>   
        `).join('')
      }
        </tbody>
        </table>
      `)
    },
    pagination: {
      init (currentPageNumber, totalCount) {
        const currentPageRange = this.getCurrentPageRange(currentPageNumber,
          totalCount)

        this.render(currentPageRange, currentPageNumber)
      },
      getCurrentPageRange (currentPageNumber, totalCount) {
        const VIEW_COUNT = 9

        const pageRange = this.getPageRange(totalCount)
        const half = Math.floor(VIEW_COUNT / 2)
        const startIndex = pageRange.indexOf(currentPageNumber) - half

        // 앞쪽 페이지 일 경우 head 에서 부터 정해진 갯수만큼 반환
        const isFrontPosition = startIndex <= 0;
        if (isFrontPosition) {
          return pageRange.splice(0, VIEW_COUNT)
        }

        // 뒤쪽 페이지 일 경우 tail 에서 부터 정해진 갯수만큼 반환
        const isMiddlePosition = startIndex + VIEW_COUNT > pageRange.length
        if (isMiddlePosition) {
          return pageRange.splice(pageRange.length - VIEW_COUNT)
        }

        return pageRange.splice(startIndex, VIEW_COUNT)
      },
      getPageRange (totalCount) {
        return Array.from(Array(Math.ceil(totalCount / PAGE_SIZE)),
          (_, i) => i + 1)
      },
      render (pageRange, currentPageNumber) {
        render(`
          <div class="pagination">
            <ul>
              ${
                pageRange.map(number => `
                  <li>
                    ${
                      number === currentPageNumber
                        ? `<strong>${number}</strong>`
                        : `<a href="/article/list?pageNumber=${number}">${number}</a>`
                    }
                  </li>
                `).join('')
               }
            </ul>
          </div>
        `)
      },
    },

    getCurrentPageRange(currentPageNumber, totalCount){
      const PAGE_COUNT = 10
      const minus = Math.floor(PAGE_COUNT / 2)
      const pageRange = this.getPageRange(totalCount)
      const currentIndexOf = pageRange.indexOf(currentPageNumber)

      return currentIndexOf - minus > 0
      ? currentIndexOf + PAGE_COUNT - minus < pageRange.length
      ? pageRange.splice(currentIndexOf - minus, PAGE_COUNT)
      : pageRange.splice(pageRange.length - PAGE_COUNT)
      : pageRange.splice(0, PAGE_COUNT)
    },


    getPageRange(totalCount){
      return Array.from(Array(Math.ceil(totalCount / PAGE_SIZE)),
      (_, i) => i + 1)
    },
  };

  articleList.init();
  return articleList;
}
