import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'

const TextGrid = styled.div`
  cursor: crosshair;
  font-weight: bold;
  --chars: 11;
  text-transform: uppercase;
  font-size: calc(70vmin / var(--chars));
  display: grid;
  place-items: center;
  /* margin: 0 auto; */
  grid-template-columns: repeat(var(--chars), 0.9em);
  grid-template-rows: repeat(8, 70px);
  margin-top: -20px;
  margin-left: 50px;

  @media (max-width: 800px) {
    font-size: calc(100vmin / var(--chars));
    margin: 20px 0 0 0;
  }

  .char {
    --d: max(0.3, var(--distance, 0));
    opacity: var(--d);
    display: inline-grid;
    place-items: center;
    transform: scale(calc(var(--d) * 1.5));
    color: rgb(
      calc(200 * var(--d)),
      calc(102 * (10 - var(--d))),
      calc(0 + (100 * var(--d)))
    );
    transition: color 0.2s linear;
  }

  .special {
    color: #21e6c1;
    text-shadow: 0 0 20px;
  }
`

const SkillGrid = () => {
  const gridRef = useRef(null)

  useEffect(() => {
    function splittingLite(el) {
      let characters = el.innerText
        .split('')
        .filter((char) => char !== ' ')
        .map((char, i) => {
          if (char !== '*') {
            return `<span class="char special" data-char="${char}" style="--i: ${i}">${char}</span>`
          } else {
            return `<span class="char" data-char="${char}" style="--i: ${i}">${char}</span>`
          }
        })
      el.innerHTML = characters.join('')
      el.style.setProperty('--total', characters.length)
      return el.querySelectorAll('.char')
    }

    const elCharacters = splittingLite(gridRef.current)

    function getCharMeasurements() {
      return Array.from(elCharacters, (elChar) => {
        return {
          element: elChar,
          rect: elChar.getBoundingClientRect(),
          distance: 0,
        }
      })
    }

    let charMeasurements = getCharMeasurements()

    const resetMeasurements = () => {
      charMeasurements = getCharMeasurements()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resetMeasurements)
    }

    function recalculateDistances(mouseCoords) {
      let containerRect = gridRef.current.getBoundingClientRect()
      let diagonal = Math.hypot(containerRect.width, containerRect.height)
      charMeasurements.forEach(({ element, rect }) => {
        const distance = Math.hypot(
          rect.left - (mouseCoords.x - 5),
          rect.top - mouseCoords.y
        )
        const normalizedDistance = 1 - distance / diagonal
        element.style.setProperty(
          '--distance',
          Math.max(Math.pow(normalizedDistance, 3), 0)
        )
      })
    }
    const mouseMoveFunc = (event) => {
      const { clientX, clientY } = event.touches ? event.touches[0] : event
      recalculateDistances({ x: clientX, y: clientY })
    }
    document.addEventListener('mousemove', mouseMoveFunc)

    return () => {
      document.removeEventListener('mousemove', mouseMoveFunc)
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resetMeasurements)
      }
    }
  }, [])

  return (
    <TextGrid ref={gridRef}>
      *HTML**CSS* *JS**REACT* MONGODB*TS* *NODE****** ***POSTGRES ***********
      *********** *********** {/*********** ***********/}
    </TextGrid>
  )
}

export default SkillGrid
