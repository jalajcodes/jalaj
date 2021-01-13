import React from 'react'
import Helmet from 'react-helmet'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import SEO from '../components/SEO'

import config from '../utils/config'
import CharacterAnimate from '../components/CharacterAnimate'
import HomeBg from '../components/HomeBg'
import HomeBgClouds from '../components/HomeBgClouds'

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`

const Intro = styled(motion.div)`
  font-size: 3rem;
  font-weight: 700;
  color: var(--light-green);

  @media (max-width: 800px) {
    font-size: 2.5rem;
  }
`

const homeIntro = {
  initial: {
    opacity: 0,
    y: '-2vw',
  },
  final: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: 'beforeChildren',
      staggerChildren: 0.2,
    },
  },
}

export default function Home({ location }) {
  const style = {
    fontFamily: 'Righteous',
    fontWeight: 800,
    textShadow: '0px 0px 10px green',
  }

  return (
    <>
      <Helmet title={config.siteTitle} />
      <SEO />
      <HomeWrapper>
        <Intro key="1" initial="initial" animate="final" variants={homeIntro}>
          <motion.div variants={homeIntro}>Hello!</motion.div>
          <motion.div variants={homeIntro}>
            I am <CharacterAnimate style={style} text="Jalaj" />
          </motion.div>
          <motion.div variants={homeIntro}>Fullstack Web Developer</motion.div>
          {''}
        </Intro>
        <HomeBgClouds />
        <HomeBg />
      </HomeWrapper>
    </>
  )
}
