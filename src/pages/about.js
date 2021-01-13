import React from 'react'
import CharacterAnimate from '../components/CharacterAnimate'
import SkillGrid from '../components/SkillGrid'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const AboutWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`

const AboutDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media (max-width: 800px) {
    width: 100%;
  }

  .get-resume {
    ${({ theme }) => theme.mixins.button}
  }

  .about-text {
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .about-heading {
    color: var(--light-green);
    letter-spacing: 1.5px;
    font-weight: 900;
    font-family: Righteous, sans-serif;
    font-size: 4rem;
  }
`

const textVariant = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      // delay: 0.7,
      duration: 0.3,
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
}

function About({ location }) {
  // whileHover={{
  //             scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
  //             scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
  //             scaleZ: [1, 1, 1, 1, 1, 1, 1],
  //             transition: {
  //               duration: 1,
  //               times: [0, 0.3, 0.4, 0.5, 0.65, 0.75, 1],
  //             },
  //           }}

  return (
    <>
      <AboutWrapper>
        <AboutDetail>
          <h2 className="about-heading">
            <CharacterAnimate text="About Me!" />
          </h2>
          <motion.div
            variants={textVariant}
            initial="hidden"
            animate="visible"
            className="about-text"
          >
            <motion.span variants={textVariant}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            </motion.span>
            <motion.span variants={textVariant}>
              quaerat, delectus aliquid eum quia illo molestiae, veniam, nostrum
            </motion.span>
            <motion.span variants={textVariant}>
              distinctio enim excepturi in deleniti! Ex rem cupiditate voluptas
            </motion.span>
            <motion.span variants={textVariant}>
              ducimus, ab voluptatum! Dolores, laboriosam. Omnis nulla labore ad{' '}
            </motion.span>
            <motion.span variants={textVariant}>
              voluptatibus aut debitis fuga expedita, earum harum odit numquam
            </motion.span>
            <motion.span variants={textVariant}>
              non cupiditate nisi perspiciatis sapiente minus rerum sunt
            </motion.span>
            <motion.span variants={textVariant}>
              dignissimos suscipit reprehenderit asperiores quia beatae velit
            </motion.span>
            <motion.span variants={textVariant}>
              incidunt. Minus quidem assumenda similique voluptatem molestiae
            </motion.span>
            <motion.span variants={textVariant}>
              accusamus aspernatur
            </motion.span>
          </motion.div>
          <button className="get-resume">
            Resume <span className="about-button__arrow">&rarr;</span>
          </button>
        </AboutDetail>
        <div>{/* <SkillGrid /> */}</div>
      </AboutWrapper>
    </>
  )
}

export default About
