import React from 'react'
import Helmet from 'react-helmet'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import SEO from '../components/SEO'

import config from '../utils/config'
import CharacterAnimate from '../components/CharacterAnimate'
import HomeBg from '../components/HomeBg'
import HomeBgClouds from '../components/HomeBgClouds'
import { Link } from 'gatsby'
import HomeBgMobile from '../components/HomeBgMobile'

const HomeWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`

const Intro = styled(motion.div)`
  font-size: calc(1.2rem + 5.5vw);
  font-weight: 700;
  color: var(--font-color);
  padding-left: 50px;

  .p1 {
    color: var(--brand);
    font-size: calc(1rem + 1.5vw);
    margin-bottom: -20px;
    /* margin-left: 7px; */
    text-transform: uppercase;
  }

  .p2 {
    /* color: var(--font-color); */
  }

  .p3 {
    font-size: calc(1rem + 1.5vw);
    margin-top: -20px;
  }

  .about,
  .projects {
    ${({ theme }) => theme.mixins.button}
    font-size: calc(1rem + 1vw);
    margin-right: 15px;
  }

  @media (max-width: 800px) {
    padding-left: 0;

    .p2 {
      font-size: 6rem;
    }

    .p3 {
      font-size: 2rem;
    }
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
    color: 'var(--brand2)',
    fontFamily: 'Righteous',
    fontWeight: 800,
    textShadow: '0px 0px 5px',
  }

  return (
    <>
      <Helmet title={config.siteTitle} />
      <SEO />
      <HomeWrapper>
        <Intro key="1" initial="initial" animate="final" variants={homeIntro}>
          <motion.div className="p1" variants={homeIntro}>
            Hello there!
          </motion.div>
          <motion.div className="p2" variants={homeIntro}>
            I'm <CharacterAnimate style={style} text="Jalaj" />
          </motion.div>
          <motion.div className="p3" variants={homeIntro}>
            Fullstack Web Developer
          </motion.div>
          <Link to="/about">
            <button className="about">
              About <span className="about-button__arrow">&rarr;</span>
            </button>
          </Link>
          <Link to="/projects">
            <button className="projects">
              Projects <span className="about-button__arrow">&rarr;</span>
            </button>
          </Link>
          {''}
        </Intro>
        <HomeBgClouds />
        <HomeBg />
        <HomeBgMobile />
      </HomeWrapper>
    </>
  )
}
