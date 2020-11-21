import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { motion, AnimatePresence } from 'framer-motion'

import Nav from './Nav'
import '../style.css'
import '../new-moon.css'
import Icon from './Icon'
import Transition from './transition'
import { devEasterMessage } from '../utils/helpers'

export default function Layout({ children, location }) {
  let isHome = false
  if (location) {
    isHome = location.pathname === '/'
  }
  const [isLoading, setIsLoading] = useState(isHome)

  useEffect(() => {
    devEasterMessage('https://placekitten.com/200/200')
  }, [])

  // eventListener for rubberband animation
  if (typeof window !== 'undefined') {
    window.onanimationend = (e) => {
      if (e.animationName === 'rubberBand') {
        e.target.classList.remove('blast')
        e.target.classList.remove('animated')
        e.target.classList.remove('rubberBand')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Jalaj Gupta</title>
      </Helmet>
      {/* Show Preloader until isLoading is true and we're on Homepage  */}
      <AnimatePresence exitBeforeEnter>
        {isLoading && isHome && <Icon setIsLoading={setIsLoading} />}
        {!isLoading && (
          <motion.div key="homepage">
            <Nav />
            <Transition location={location}>
              <div className="site-wrapper">
                <main className="main-area">{children}</main>
              </div>
            </Transition>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
