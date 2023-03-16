import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

import { ConnectKitProvider } from 'connectkit'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from './wagmi'

/*
<style global jsx>{`
  html,
  body,
  body > div:first-child,
  div#__next,
  div#__next > div {
    background: #f2f4f6;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`}</style>
*/
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
