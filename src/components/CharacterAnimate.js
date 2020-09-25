import React from 'react'
import { characterAnimate } from '../utils/helpers'

const CharacterAnimate = ({ children, style }) => {
  const charArr = children.split('')
  return charArr.map((char, idx) => {
    if (char === ' ') {
      return ' '
    }
    return (
      <span style={style} key={idx} onMouseEnter={characterAnimate}>
        {char}
      </span>
    )
  })
}

export default CharacterAnimate
