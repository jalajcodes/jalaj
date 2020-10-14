import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Transition = ({ location, children }) => {
  const duration = 0.5

  const variants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: duration,
        delay: duration,
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
    <AnimatePresence>
      <motion.div
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
