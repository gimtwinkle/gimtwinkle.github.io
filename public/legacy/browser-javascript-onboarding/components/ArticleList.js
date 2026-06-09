import api from "../api/shopHttpRequest";

const BOARD_NO = 2800;
const PAGE_SIZE = 10;

export default function ArticleList($app) {

  const articleList = {
    init() {
      this.renderWrap();
      this.fetchfreeBoardArticleList()
      .then(({items,totalCount}) => {
        this.render(items);
        this.pagination(this.pageNumber, totalCount)
      });
    },

    get pageNumber() {
      const searchParams = new URLSearchParams(location.search);
      return Number(searchParams.get("pageNumber")) || 1;
    },

    renderWrap() {
      $app.innerHTML = `
        <div class="board__btn--box">
          <a href="/article/create" class="board__btn">글쓰기</a>
        </div>
      
        <table id="table__board--list">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>등록일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody id="articleList">
            
          </tbody>
        </table>
      `;
    },

    fetchfreeBoardArticleList() {
      return api.getArticles(BOARD_NO, this.pageNumber)
    },

    render(items){
      //console.log(items);
      const $articleList = document.querySelector("#articleList");
      items.forEach(
        (item) =>
          ($articleList.innerHTML += `
          <tr>
            <td>${item.articleNo}</td>
            <td>
              <a href="/article?articleNo=${item.articleNo}">
                ${item.notice? `<strong class="label__notice">공지</strong>` : ``}
                ${item.title}
              </a>
            </td>
            <td class="board__date">${item.registerYmdt.substr(0,10)}</td>
            <td class="board__count">${item.viewCnt}</td>
          </tr>
        `)
      );
    },

    pagination(currentPageNumber, totalCount){
      const currentPageRange = this.getCurrentPageRange(currentPageNumber, totalCount); 
      const pageArry = this.getPageRange(totalCount);
      
      const $pagination = document.createElement("div");
      $pagination.id = "pagination";
      $app.appendChild($pagination);
      $pagination.innerHTML = `
        <a href="list?pageNumber=1" class="pagination__btn pagination__btn--arrow" id="first">첫번째로 가기</a>
        <a href="list?pageNumber=${currentPageNumber-1}" class="pagination__btn pagination__btn--arrow" id="prev">전페이지로 가기</a>
          <ol id="pagination__list">
          </ol>
        <a href="list?pageNumber=${currentPageNumber+1}" class="pagination__btn pagination__btn--arrow" id="next">다음페이지로 가기</a>
        <a href="list?pageNumber=${pageArry.length}" class="pagination__btn pagination__btn--arrow" id="last">마지막페이지로 가기</a>
      `;

      currentPageRange.forEach((page) => (
        document.getElementById("pagination__list").innerHTML +=`<li>
            ${
              page === currentPageNumber
              ? `<strong>${page}</strong>`
              : `<a href="list?pageNumber=${page}" class="pagination__btn">${page}</a>`
            }
          </li>`
        )
      );
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
  };

  articleList.init();
  return articleList;
}
