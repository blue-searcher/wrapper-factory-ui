import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

import { ConnectKitProvider } from 'connectkit'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from './wagmi'

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider 
        customTheme={{
          "--ck-connectbutton-color": "var(--bs-primary)"
        }}
      >
        <NextHead>
          <title>Wrapper Factory</title>
        </NextHead>

        <div style={{ backgroundColor: "#f2f4f6" }}>
          {mounted && <Component {...pageProps} />}
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
