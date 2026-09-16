import { apiFailure, apiSuccess } from '../../../types/api'
import { verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  if (!body?.username || !body?.password) {
    return apiFailure('BAD_REQUEST', '用户名和密码不能为空')
  }

  const config = useRuntimeConfig()
  const ok =
    body.username === config.adminUsername && verifyPassword(body.password, config.adminPasswordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: '用户名或密码错误' })
  }

  setSessionCookie(event, body.username)
  return apiSuccess({ username: body.username })
})
