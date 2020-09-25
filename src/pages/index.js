import React from 'react'
import Helmet from 'react-helmet'
import { motion } from 'framer-motion'

import SEO from '../components/SEO'

import config from '../utils/config'
import CharacterAnimate from '../components/CharacterAnimate'

const homeIntro = {
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
  const style = {
    fontFamily: 'Righteous',
    fontWeight: 800,
    textShadow: '0px 0px 10px green',
  }

  return (
    <>
      <Helmet title={config.siteTitle} />
      <SEO />
      <div>
        <div className="container homepage__wrapper">
          <motion.div
            key="1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={homeIntro}
            className="homepage__intro"
          >
            <motion.div
              variants={homeIntro}
              className="homepage__intro-greeting"
            >
              Hello!
            </motion.div>
            <motion.div variants={homeIntro}>
              I am <CharacterAnimate style={style}>Jalaj</CharacterAnimate>
            </motion.div>
            <motion.div
              variants={homeIntro}
              className="homepage__intro-profession"
            >
              Fullstack Web Developer
            </motion.div>
            {''}
          </motion.div>
        </div>
      </div>
    </>
  )
}
