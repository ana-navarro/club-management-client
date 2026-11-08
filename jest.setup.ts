import '@testing-library/jest-dom/jest-globals'
import { afterEach } from '@jest/globals'
import './src/shared/i18n/i18n'

afterEach(() => {
  sessionStorage.clear()
  localStorage.clear()
})
