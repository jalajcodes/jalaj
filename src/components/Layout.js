import React, { useState } from 'react'
import Helmet from 'react-helmet'
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

      {/* Show Preloader until isLoading is true and we're on Homepage  */}
      {isLoading && isHome ? (
        <Icon setIsLoading={setIsLoading} />
      ) : (
        <>
          <div className="site-wrapper">
            <Nav />
            <main className="main-area">{children}</main>
          </div>
        </>
      )}
    </>
  )
}
