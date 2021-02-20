import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

// const Frame1 = styled(motion.div)`
//   position: fixed;
//   width: 100%;
//   height: 100vh;
//   left: 0;
//   top: 0;
//   /* bottom: 0; */
//   /* right: 0; */
//   background-color: green;
//   z-index: 10;
// `

// const Frame2 = styled(Frame1)`
//   background-color: pink;
// `
// const Frame3 = styled(Frame1)`
//   background-color: purple;
// `
// const Frame4 = styled(Frame1)`
//   background-color: orange;
// `
// const frameVariants = {
//   initial: {
//     x: '-130%',
//     skew: '45deg',
//   },
//   enter: {
//     x: '100%',
//     skew: '0deg',
//     transition: {
//       duration: 1,
//     },
//   },
// }

const Transition = ({ location, children }) => {
  const duration = 0.5

  const variants = {
    initial: {
      opacity: 0,
      y: -30,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: duration,
        staggerChildren: 0.2,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { duration: duration },
    },
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        layoutId="123"
        key={location ? location.pathname : Math.floor(Math.random() + 100)}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default Transition
