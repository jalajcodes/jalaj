import React, { useEffect, useContext } from 'react'
import CharacterAnimate from '../components/CharacterAnimate'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Canvas from '../utils/canvas'
import { ThemeContext } from 'gatsby-plugin-theme-switcher'

const AboutWrapper = styled(motion.div)`
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
    font-size: calc(1rem + 1vw);
  }

  .about-text {
    font-size: calc(1rem + 1vw);
    opacity: 0.9;
  }

  .about-heading {
    color: var(--brand);
    letter-spacing: 0.7rem;
    font-weight: 900;
    font-family: Righteous, sans-serif;
    font-size: calc(6rem + 1.5vw);
  }
`

const textVariant = {
  hidden: {
    opacity: 0,
    scaleX: 0,
    transformOrigin: '0 0',
  },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      delay: 1.4,
      duration: 0.7,
    },
  },
}
const textVariant2 = {
  hidden: {
    opacity: 0,
    skewY: '-10deg',
    transformOrigin: '100% 0',
  },
  visible: {
    opacity: 1,
    skewY: '0deg',
    transition: {
      delay: 2,
      duration: 0.7,
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
  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    new Canvas(theme === 'theme-dark' ? '#E0250C' : '#21E6C1')
    return () => {
      let el = document.querySelector('canvas')
      el.parentNode.removeChild(el)
    }
  }, [theme])

  return (
    <>
      <AboutWrapper layoutId="item" className="canvasContainer">
        <AboutDetail>
          <h2 className="about-heading">
            <CharacterAnimate text="About Me!" />
          </h2>
          <motion.span
            variants={textVariant}
            initial="hidden"
            animate="visible"
            className="about-text"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            quaerat, delectus aliquid eum quia illo molestiae, veniam, nostrum
            distinctio enim excepturi in deleniti! Ex rem cupiditate voluptas
            ducimus, ab voluptatum! Dolores, laboriosam. Omnis nulla labore ad{' '}
          </motion.span>
          <motion.span
            variants={textVariant2}
            initial="hidden"
            animate="visible"
            className="about-text"
          >
            voluptatibus aut debitis fuga expedita, earum harum odit numquam non
            cupiditate nisi perspiciatis sapiente minus rerum sunt dignissimos
            suscipit reprehenderit asperiores quia beatae velit incidunt. Minus
            quidem assumenda similique voluptatem molestiae accusamus aspernatur
          </motion.span>
          <button className="get-resume">
            Resume <span className="about-button__arrow">&rarr;</span>
          </button>
        </AboutDetail>
        {/* <div><SkillGrid /></div> */}
      </AboutWrapper>
    </>
  )
}

export default About
