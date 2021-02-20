import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import Nav from './Nav'
import styled, { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '../styles'
import Loader from './LoaderSvg'
import Transition from './Transition'
import { devEasterMessage } from '../utils/helpers'
import { theme } from '../styles/theme'
import ThemeToggle from './ThemeToggle'

const SiteWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  padding-left: 80px;
  overflow-x: hidden;
  overflow-y: scroll;

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 0;
  }
`

export default function Layout({ children, location }) {
  let isHome = false
  if (location) {
    isHome = location.pathname === '/'
  }
  const [isLoading, setIsLoading] = useState(isHome)

  useEffect(() => {
    devEasterMessage('https://placekitten.com/200/200')
  }, [])

  return (
    <>
      <Helmet>
        <title>Jalaj Gupta</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Quicksand:wght@400;500;600;700&family=Righteous&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <ThemeProvider theme={theme}>
        <AnimatePresence exitBeforeEnter>
          {isLoading && isHome && <Loader setIsLoading={setIsLoading} />}
          {!isLoading && (
            <motion.div key="layout" style={{ overflowY: 'hidden' }}>
              <Nav />
              <ThemeToggle />
              <Transition location={location}>
                <AnimateSharedLayout type="crossfade">
                  <SiteWrapper>{children}</SiteWrapper>
                </AnimateSharedLayout>
              </Transition>
            </motion.div>
          )}
        </AnimatePresence>
        <GlobalStyles />
      </ThemeProvider>
    </>
  )
}
