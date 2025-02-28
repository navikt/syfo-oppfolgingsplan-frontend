import './globals.css'
import { configureLogger } from '@navikt/next-logger'
import type { Metadata } from 'next'
import React from 'react'
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr'
import Script from 'next/script'
import { publicEnv } from '@/constants/envs'

configureLogger({
    basePath: publicEnv.NEXT_PUBLIC_BASE_PATH,
})

function createDecoratorEnv(): 'dev' | 'prod' {
    switch (publicEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT) {
        case 'local':
        case 'test':
        case 'dev':
            return 'dev'
        default:
            return 'prod'
    }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const Decorator = await fetchDecoratorReact({
        env: createDecoratorEnv(),
        params: {
            language: 'nb',
            context: 'privatperson',
            logoutWarning: true,
            chatbot: true,
            feedback: false,
            redirectToApp: true,
        },
    })

    return (
        <html lang="no">
        <head>
            <Decorator.HeadAssets />
        </head>
        <body>
        <Decorator.Header />
            {children}
        <Decorator.Footer />
        <Decorator.Scripts loader={Script} />
        </body>
        </html>
    )
}

export const metadata: Metadata = {
    title: 'Oppfølgingsplan',
}