import React from 'react'
import { motion } from 'framer-motion'

const charVariant = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 1,
    // scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
    // scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
    // scaleZ: [1, 1, 1, 1, 1, 1, 1],
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.18,
    },
  },
}

const CharacterAnimate = ({ text, style }) => {
  const charArr = Array.from(text)

  const addClasses = (e) => {
    e.target.classList.add('blast')
    e.target.classList.add('animated')
    e.target.classList.add('rubberBand')
  }
  const removeClasses = (e) => {
    e.target.classList.remove('blast')
    e.target.classList.remove('animated')
    e.target.classList.remove('rubberBand')
  }

  return (
    <motion.span variants={charVariant} initial="initial" animate="final">
      {charArr.map((char, idx) => {
        if (char === ' ') {
          return ' '
        }
        return (
          <motion.span
            variants={charVariant}
            // className="blast animated rubberBand"
            style={style}
            key={idx}
            onAnimationEnd={removeClasses}
            onMouseEnter={addClasses}
          >
            {char}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
export default CharacterAnimate
