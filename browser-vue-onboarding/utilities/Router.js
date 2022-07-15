export default function Router ({ routes, change }) {
  function push (to) {
    if (typeof to === 'string') {
      try {
        to = new URL(to)
      }
      catch {
        throw TypeError('올바른 URL 형식이 아닙니다.')
      }
    }

    const matchedPathname = Object.keys(routes).
      find(pathname => to.pathname === pathname)

    history.pushState(
      null,
      null,
      matchedPathname ? to.pathname + to.search : '/not-found',
    )
    updateRoute()
  }

  function updateRoute () {
    change(routes[location.pathname] ?? routes.NOT_FOUND)
  }

  // 뒤로가기 처리
  window.onpopstate = function () {
    updateRoute()
  }

  updateRoute()

  return {
    push,
  }
}