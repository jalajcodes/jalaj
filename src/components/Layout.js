import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { throttle } from '../utils/helpers'

import favicon from '../../content/thumbnails/react.png'

import Nav from './Nav'
// import Footer from './Footer'

import '../style.css'
import '../new-moon.css'

export default function Layout({ children }) {
  const [hideNav, setHideNav] = useState(false)
  let prevScrollPos = 0
  useEffect(() => {
    if (typeof window != undefined) {
      prevScrollPos = window.pageYOffset
      window.onscroll = throttle(handleIt, 500, {
        leading: false,
        trailing: false,
      })
    }
  }, [])
  const handleIt = () => {
    let currentScrollPos = window.pageYOffset
    if (prevScrollPos > currentScrollPos) {
      setHideNav(false)
    } else {
      setHideNav(true)
    }
    prevScrollPos = currentScrollPos
  }

  return (
    <>
      <Helmet>
        <link
          rel="shortcut icon"
          type="image/png"
          href={favicon}
          // href="https://s2.googleusercontent.com/s2/favicons?domain=jalaj.funcity.org"
        />
      </Helmet>
      <Nav hideNav={hideNav} />
      <div
        // onWheel={throttle(handleIt, 1000, { trailing: false })}
        className="site-wrapper"
      >
        <main className="main-area">{children}</main>
        {/* <Footer /> */}
      </div>
    </>
  )
}
