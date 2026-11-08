import { afterEach, beforeEach, expect, it, jest } from '@jest/globals'
import { act, render, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { changeLanguage, i18next } from '../i18n/i18n'
import { useColorMode, type ColorModeValue } from '../theme/color-mode-context'
import { ColorModeProvider } from '../theme/ColorModeProvider'
import { userResponse } from '../services/user.mock'
import { useApplyPreferences, usePreferencesSync } from './usePreferencesSync'

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <ColorModeProvider>{children}</ColorModeProvider>
  </SWRConfig>
)

let fetchMock: jest.Mock<typeof fetch>

beforeEach(async () => {
  await i18next.changeLanguage('en')
  fetchMock = jest.fn<typeof fetch>(async () => userResponse())
  globalThis.fetch = fetchMock
})

afterEach(() => {
  jest.restoreAllMocks()
})

it('applies the preferences returned by the backend', async () => {
  const { result } = renderHook(() => ({ apply: useApplyPreferences(), color: useColorMode() }), { wrapper })

  act(() => result.current.apply({ theme: 'dark', language: 'pt-BR' }))

  await waitFor(() => expect(result.current.color.mode).toBe('dark'))
  expect(sessionStorage.getItem('theme')).toBe('dark')
  expect(sessionStorage.getItem('language')).toBe('pt-BR')
})

it('leaves things as they are when the user has no saved choice', () => {
  const { result } = renderHook(() => ({ apply: useApplyPreferences(), color: useColorMode() }), { wrapper })

  act(() => result.current.apply({ theme: null, language: null }))

  expect(sessionStorage.getItem('theme')).toBeNull()
  expect(sessionStorage.getItem('language')).toBeNull()
})

it('saves nothing just by opening a page', async () => {
  renderHook(() => usePreferencesSync(), { wrapper })
  await act(async () => undefined)
  expect(fetchMock).not.toHaveBeenCalled()
})

it('saves a change of theme and of language', async () => {
  let setMode: ColorModeValue['setMode'] = () => undefined
  function Probe() {
    usePreferencesSync()
    setMode = useColorMode().setMode
    return null
  }
  render(<Probe />, { wrapper })

  await act(async () => setMode('dark'))
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ body: '{"theme":"dark"}' })

  await act(async () => changeLanguage('pt-BR'))
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({ body: '{"language":"pt-BR"}' })
})

it('ignores a failure to save', async () => {
  fetchMock.mockImplementation(async () => new Response('', { status: 500 }))
  let setMode: ColorModeValue['setMode'] = () => undefined
  function Probe() {
    usePreferencesSync()
    setMode = useColorMode().setMode
    return null
  }
  render(<Probe />, { wrapper })

  await act(async () => setMode('dark'))
  await waitFor(() => expect(fetchMock).toHaveBeenCalled())
})
