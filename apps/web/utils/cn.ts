import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn-vue 风格 class 合并：clsx 合并 + tailwind-merge 去重冲突 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}