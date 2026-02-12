/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // add more env variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare namespace JSX {
    interface IntrinsicElements {
        'l-helix': any;
    }
}
