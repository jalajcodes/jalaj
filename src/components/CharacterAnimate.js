import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

// const charVariant = {
//   initial: {
//     opacity: 0,
//   },
//   final: {
//     opacity: 1,
//     // scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
//     // scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
//     // scaleZ: [1, 1, 1, 1, 1, 1, 1],
//     transition: {
//       duration: 0.3,
//       when: 'beforeChildren',
//       staggerChildren: 0.18,
//     },
//   },
// }
const addClasses = (e) => {
  // e.target.classList.add('blast')
  e.target.classList.add('animated')
  e.target.classList.add('rubberBand')
}
const removeClasses = (e) => {
  // e.target.classList.remove('bounceIn')
  e.target.classList.remove('animated')
  e.target.classList.remove('rubberBand')
}

const CharacterAnimate = ({ text, style }) => {
  const charArr = Array.from(text)
  useEffect(() => {
    let time = 0
    let allChars = document.querySelectorAll('span span.blast')
    allChars.forEach((el) => {
      setTimeout(() => {
        el.style.opacity = 1
        el.classList.add('animated')
        el.classList.add('bounceIn')
      }, time)

      time = time + 200
      setTimeout(() => {
        el.classList.remove('bounceIn')
      }, 2000);
    })
  }, [])

  return (
    // <motion.span variants={charVariant} initial="initial" animate="final">
    <span>
      {charArr.map((char, idx) => {
        if (char === ' ') {
          return ' '
        }
        return (
          <motion.span
            // variants={charVariant}
            className="blast"
            style={style}
            key={idx}
            onAnimationEnd={removeClasses}
            onMouseEnter={addClasses}
          >
            {char}
          </motion.span>
        )
      })}
    </span>
    // </motion.span>
  )
}
export default CharacterAnimate
