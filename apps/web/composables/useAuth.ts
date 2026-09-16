import type { LoginPayload } from '~/types/user'

/** 后台认证（单管理员，会话为 httpOnly Cookie） */
export function useAuth() {
  const loggedIn = useCookie<boolean>(LOGGED_IN_COOKIE, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  async function login(payload: LoginPayload): Promise<void> {
    await $fetch('/api/auth/login', { method: 'POST', body: payload })
    loggedIn.value = true
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    loggedIn.value = false
    await navigateTo('/admin/login')
  }

  return { loggedIn, login, logout }
}
