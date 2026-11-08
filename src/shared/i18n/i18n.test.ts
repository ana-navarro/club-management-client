import { afterEach, expect, it, jest } from '@jest/globals'
import en from './en.json'
import { changeLanguage, detectLanguage, i18next, readStoredLanguage } from './i18n'
import ptBR from './pt-BR.json'

type Texts = { [key: string]: string | Texts }

const keysOf = (value: Texts, prefix = ''): string[] =>
  Object.entries(value)
    .flatMap(([key, child]) =>
      typeof child === 'string' ? [`${prefix}${key}`] : keysOf(child, `${prefix}${key}.`),
    )
    .sort()

const mockBrowser = (language: string) => jest.spyOn(navigator, 'language', 'get').mockReturnValue(language)

afterEach(() => {
  jest.restoreAllMocks()
})

it('has the same keys in both languages', () => {
  expect(keysOf(ptBR)).toEqual(keysOf(en))
})

const valuesOf = (value: Texts): string[] =>
  Object.values(value).flatMap((child) => (typeof child === 'string' ? [child] : valuesOf(child)))

it('has no empty text in either language', () => {
  for (const texts of [ptBR, en]) {
    expect(valuesOf(texts).filter((text) => text.trim() === '')).toEqual([])
  }
})

it('keeps the same placeholders in both languages', () => {
  const placeholders = (texts: Texts) =>
    keysOf(texts).map((key) => {
      const text = key.split('.').reduce<string | Texts>((node, part) => (typeof node === 'string' ? node : (node[part] ?? '')), texts)
      return `${key}:${(typeof text === 'string' ? text.match(/{{\w+}}/g) ?? [] : []).sort().join(',')}`
    })
  expect(placeholders(ptBR)).toEqual(placeholders(en))
})

it.each([
  ['pt-BR', 'pt-BR'],
  ['pt-PT', 'pt-BR'],
  ['en-US', 'en'],
  ['es', 'en'],
])('follows the browser language %s', (browser, expected) => {
  mockBrowser(browser)
  expect(detectLanguage()).toBe(expected)
})

it('prefers the session choice', () => {
  mockBrowser('en-US')
  sessionStorage.setItem('language', 'pt-BR')
  expect(detectLanguage()).toBe('pt-BR')
})

it('ignores an invalid stored value', () => {
  sessionStorage.setItem('language', 'fr')
  expect(readStoredLanguage()).toBeNull()
})

it('saves the choice in sessionStorage and switches the texts', async () => {
  changeLanguage('pt-BR')
  await i18next.loadLanguages('pt-BR')
  expect(sessionStorage.getItem('language')).toBe('pt-BR')
  expect(localStorage.getItem('language')).toBeNull()
  expect(i18next.t('login.password')).toBe('Senha')
})
