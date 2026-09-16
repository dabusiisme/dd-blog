/** 全局鉴权：后台路由保护（服务端 API 另有 server/middleware/auth.ts 双重校验） */
export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const loggedIn = useCookie<boolean>(LOGGED_IN_COOKIE)
    if (!loggedIn.value) {
      return navigateTo('/admin/login', { redirectCode: 302 })
    }
  }
})
