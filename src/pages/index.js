import React from 'react'
import Helmet from 'react-helmet'
import { motion } from 'framer-motion'

import SEO from '../components/SEO'
import { characterAnimate } from '../utils/helpers'

import config from '../utils/config'

const home = {
  initial: {
    opacity: 0,
    y: '-2vw',
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
}

export default function HomePage({ location }) {
  return (
    <>
      <Helmet title={config.siteTitle} />
      <SEO />
      <div className="container homepage__wrapper">
        <motion.div
          key="1"
          initial="initial"
          animate="animate"
          variants={home}
          className="homepage__intro"
        >
          <motion.div variants={home} className="homepage__intro-greeting">
            <span onMouseEnter={characterAnimate}>H</span>
            <span onMouseEnter={characterAnimate}>e</span>
            <span onMouseEnter={characterAnimate}>l</span>
            <span onMouseEnter={characterAnimate}>l</span>
            <span onMouseEnter={characterAnimate}>o</span>
            <span onMouseEnter={characterAnimate}>!</span>
          </motion.div>
          <motion.div variants={home} className="homepage__intro-name">
            I am Jalaj
          </motion.div>
          <motion.div variants={home} className="homepage__intro-profession">
            Fullstack Web Developer
          </motion.div>
          {''}
        </motion.div>
      </div>
    </>
  )
}
