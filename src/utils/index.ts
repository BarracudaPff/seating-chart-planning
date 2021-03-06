export * from './helper'
// export * from './date'

export function filterOption(input: string, option: any): boolean {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export function sleep(delay?: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}
