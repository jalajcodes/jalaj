import React from 'react'
import { characterAnimate } from '../utils/helpers'
import { motion } from 'framer-motion'

const CharacterAnimate = ({ children, style }) => {
  const charArr = children.split('')

  const charVariant = {
    initial: {
      opacity: 0,
    },
    final: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: 'beforeChildren',
        staggerChildren: 0.18,
      },
    },
  }

  return (
    <motion.span variants={charVariant} initial="initial" animate="final">
      {charArr.map((char, idx) => {
        // account for spaces in heading!
        if (char === ' ') {
          return ' '
        }
        return (
          <motion.span
            variants={charVariant}
            style={style}
            key={idx}
            onMouseEnter={characterAnimate}
          >
            {char}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
export default CharacterAnimate
