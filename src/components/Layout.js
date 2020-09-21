import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { motion, AnimatePresence } from 'framer-motion'

import Nav from './Nav'
import '../style.css'
import '../new-moon.css'
import Icon from './Icon'
import Transition from './transition'

export default function Layout({ children, location }) {
  let isHome = false
  if (location) {
    isHome = location.pathname === '/'
  }
  const [isLoading, setIsLoading] = useState(isHome)

  // eventListener for rubberband animation
  window.onanimationend = (e) => {
    // console.log({
    //   // logging the full event will kill the page
    //   target: e.target,
    //   type: e.type,
    //   animationName: e.animationName,
    // })
    if (e.animationName === 'rubberBand') {
      e.target.classList.remove('blast')
      e.target.classList.remove('animated')
      e.target.classList.remove('rubberBand')
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
        <motion key="homepage">
          <Transition location={location}>
            <div className="site-wrapper">
              <Nav />
              <main className="main-area">{children}</main>
            </div>
          </Transition>
        </motion>
      </AnimatePresence>
    </>
  )
}
