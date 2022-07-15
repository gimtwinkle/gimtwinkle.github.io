import api from '../api/shopHttpRequest'
import { getSearchParam } from '../utilities/url'

export default function CreateArticle (render, push) {
  const createArticle = {
    get boardNo () {
      return getSearchParam('boardNo')
    },
    init () {
      const formEl = document.createElement('form')
      this.render(formEl)
      this.insertLengthCounter(formEl)
      this.bindSubmitEvent(formEl)
    },
    render (formEl) {
      formEl.insertAdjacentHTML('afterbegin', this.getFieldsTemplate())
      render(formEl)
    },
    insertLengthCounter (formEl) {
      const targetInputs = formEl.querySelectorAll('[type=text], textarea')

      targetInputs.forEach(el => {
        // Create Count Element
        const countEl = document.createElement('span')
        countEl.innerHTML = `<span data-count>${el.value.length}</span>/<span>${el.maxLength}</span>`
        el.insertAdjacentElement('afterend', countEl)

        // Bind Keyup Event
        el.addEventListener('keyup', event => {
          countEl.querySelector('[data-count]').textContent = event.target.value.length;
        })
      })
    },
    getFieldsTemplate () {
      return `
        <fieldset name="nonMember">
          <div class="row">
            <label for="guestName">작성자</label>
            <input type="text" name="guestName" id="guestName" value="test" maxlength="20" />
          </div>
          <div class="row">
            <label for="password">비밀번호</label>
            <input type="password" name="password" id="password" value="test" />
          </div>
        </fieldset>
        <fieldset name="common">
          <div class="row">
            <label for="articleTitle">제목</label>
            <input type="text" name="articleTitle" id="articleTitle"  maxlength="50" />
          </div>
          <div class="row">
            <label>내용</label>
            <textarea name="articleContent" id="articleContent" maxlength="1000">123</textarea>
          </div>
        <fieldset name="nonMember">
        <button type="submit">글쓰기</button>
      `
    },
    bindSubmitEvent (formEl) {
      formEl.addEventListener('submit', event => {
        event.preventDefault()
        this.onSubmitForm(event.currentTarget)
      })
    },
    onSubmitForm (formEl) {
      const data = this.getFormData(formEl)
      if (!this.validation(data)) return;
      console.log('success')
      this.postArticle(data)
    },
    getFormData (formEl) {
      const formData = new FormData(formEl)
      return Object.fromEntries(formData.entries())
    },
    validation (data) {
      if (!data.guestName.trim()) {
        alert('작성자 명을 입력하여 주세요.')
        return false
      }

      if (!data.password.trim()) {
        alert('비밀번호를 입력하여 주세요.')
        return false
      }

      if (!data.articleTitle.trim()) {
        alert('제목을 입력하여 주세요.')
        return false
      }

      if (!data.articleContent.trim()) {
        alert('내용을 입력하여 주세요.')
        return false
      }

      return true
    },
    postArticle(data) {
      api.postArticleNoneMember({ boardNo: this.boardNo, requestBody: data })
        .then(() => {
          push({
            pathname: '/article/list'
          })
        })
    },
  }

  createArticle.init()

  return createArticle
}
