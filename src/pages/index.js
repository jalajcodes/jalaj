import React, { useEffect, useRef } from 'react'
// import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

import config from '../utils/config'

export default function BlogIndex({ location }) {
  const handleEnter = (e) => {
    e.target.classList.add('blast')
    e.target.classList.add('animated')
    e.target.classList.add('rubberBand')
  }

  return (
    <Layout location={location}>
      <Helmet title={config.siteTitle} />
      <SEO />
      <AnimatePresence>
        <div className="container homepage__wrapper" exit={{ x: '100vw' }}>
          <div className="homepage__intro">
            <div
              onMouseEnter={handleEnter}
              // onMouseLeave={handleLeave}
              className="homepage__intro-greeting"
            >
              Hello!
            </div>
            <div className="homepage__intro-name">I am Jalaj</div>
            <div className="homepage__intro-profession">
              Fullstack Web Developer
            </div>
            {''}
          </div>
        </div>
      </AnimatePresence>
    </Layout>
  )
}
