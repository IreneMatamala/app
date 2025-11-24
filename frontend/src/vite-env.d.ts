/// <reference types="vite/client" />

// Para import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Para process.env (que defines en vite.config.ts)
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_API_URL: string
    readonly VITE_APP_NAME: string
  }
}
