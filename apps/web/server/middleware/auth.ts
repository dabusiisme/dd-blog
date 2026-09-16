/** 服务端 API 鉴权：/api/admin/** 需要有效会话（与前端 auth.global.ts 双重校验） */
export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/admin')) {
    const session = getSessionPayload(event)
    if (!session) {
      throw createError({ statusCode: 401, statusMessage: '未登录或会话已过期' })
    }
  }
})
