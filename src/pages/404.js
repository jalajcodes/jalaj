import React from 'react'
import Helmet from 'react-helmet'

import SEO from '../components/SEO'

import config from '../utils/config'

export default function FourOhFour() {
  return (
    <>
      <Helmet title={`404 | ${config.siteTitle}`} />
      <SEO />
      <h1>404</h1>
      <p>This was probably a mistake.</p>
    </>
  )
}
