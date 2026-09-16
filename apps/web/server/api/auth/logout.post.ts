import { apiSuccess } from '../../../types/api'
import { clearSessionCookie } from '../../utils/auth'

export default defineEventHandler((event) => {
  clearSessionCookie(event)
  return apiSuccess({ ok: true })
})
