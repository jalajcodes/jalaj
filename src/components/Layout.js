import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { throttle } from '../utils/helpers'

import favicon from '../../content/thumbnails/react.png'

import Nav from './Nav'
import '../style.css'
import '../new-moon.css'
import Icon from './Icon'

export default function Layout({ children, location }) {
  let isHome = false
  if (location) {
    isHome = location.pathname === '/'
  }
  const [isLoading, setIsLoading] = useState(isHome)
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
      {isLoading && isHome ? (
        <Icon setIsLoading={setIsLoading} />
      ) : (
        <>
          <Nav hideNav={hideNav} />
          <div className="site-wrapper">
            <main className="main-area">{children}</main>
          </div>
        </>
      )}
    </>
  )
}
