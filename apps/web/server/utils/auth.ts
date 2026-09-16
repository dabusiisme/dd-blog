import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

/**
 * 轻量认证（单管理员）：
 * - JWT HS256 Session（httpOnly Cookie），无第三方依赖
 * - 密码哈希格式 "sha256:<hex>"，生成：echo -n "密码" | shasum -a 256
 */

export const SESSION_COOKIE = 'blog_session'
export const LOGGED_IN_COOKIE = 'blog_logged_in'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 天

export interface SessionPayload {
  sub: string
  exp: number
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export function verifyPassword(plain: string, stored: string): boolean {
  if (!stored) return false
  const [algo, hex] = stored.split(':')
  if (algo !== 'sha256' || !hex) return false
  const digest = createHash('sha256').update(plain).digest('hex')
  return safeEqual(digest, hex)
}

export function signSession(username: string, secret: string): string {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = b64url(
    JSON.stringify({
      sub: username,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    }),
  )
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${signature}`
}

export function verifySessionToken(token: string, secret: string): SessionPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [header, payload, signature] = parts
  const expected = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  if (!safeEqual(signature, expected)) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionPayload
    if (typeof parsed.exp !== 'number' || parsed.exp < Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null
  }
}

/** 读取并校验当前会话，无效返回 null（命名避开 h3 内置 getSession） */
export function getSessionPayload(event: H3Event): SessionPayload | null {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  return verifySessionToken(token, useRuntimeConfig().authSecret)
}

export function setSessionCookie(event: H3Event, username: string): void {
  const secret = useRuntimeConfig().authSecret
  const token = signSession(username, secret)
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  })
  // 非 httpOnly 标记 Cookie，供前端路由守卫使用（真实校验以服务端为准）
  setCookie(event, LOGGED_IN_COOKIE, '1', { sameSite: 'lax', maxAge: SESSION_MAX_AGE })
}

export function clearSessionCookie(event: H3Event): void {
  deleteCookie(event, SESSION_COOKIE)
  deleteCookie(event, LOGGED_IN_COOKIE)
}
