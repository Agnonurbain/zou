import '@testing-library/jest-dom'

// Provide simple URL.createObjectURL / revoke mocks for jsdom tests
if (typeof globalThis.URL === 'undefined') {
  // @ts-expect-error - define minimal URL for tests
  globalThis.URL = {}
}

globalThis.URL.createObjectURL = (file: unknown) => 'blob:mock-url'
globalThis.URL.revokeObjectURL = (_: unknown) => {}
