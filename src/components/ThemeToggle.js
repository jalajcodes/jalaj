import React, { useContext } from 'react'
import { ThemeContext } from 'gatsby-plugin-theme-switcher'
import styled from 'styled-components'

const Toggle = styled.div`
  --color-invert: var(--brand);
  --width: 150px;
  --height: 150px;
  position: absolute;
  top: -40px;
  right: -40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--width);
  height: var(--height);
  transform: scale(0.4);

  @media (max-width: 800px) {
    display: none;
    /* position: absolute;
    top: 0;
    right: 0; */
  }

  .button {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: radial-gradient(
        circle closest-side,
        var(--color-invert),
        transparent
      );
      filter: blur(20px);
      opacity: 0;
      transition: opacity 1s ease, transform 1s ease;
      transform: perspective(1px) translateZ(0);
      backface-visibility: hidden;
    }
    .power-on,
    .power-off {
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: 1;
      fill: none;
      stroke: var(--color-invert);
      stroke-width: 8px;
      stroke-linecap: round;
      stroke-linejoin: round;
      .line {
        opacity: 0.2;
      }
      .circle {
        opacity: 0.2;
        transform: rotate(-58deg);
        transform-origin: center 80px;
        stroke-dasharray: 220;
        stroke-dashoffset: 40;
      }
    }
    .power-on {
      filter: drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.8));
      .line {
        opacity: 0;
        transition: opacity 0.3s ease 1s;
      }
      .circle {
        opacity: 1;
        stroke-dashoffset: 220;
        transition: transform 0s ease, stroke-dashoffset 1s ease 0s;
      }
    }
  }
  input {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 2;
    cursor: pointer;
    opacity: 0;
    &:checked {
      + .button {
        &:after {
          opacity: 0.15;
          transform: scale(2) perspective(1px) translateZ(0);
          backface-visibility: hidden;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .power-on,
        .power-off {
          animation: click-animation 0.3s ease forwards;
          transform: scale(1);
          .line {
            animation: line-animation 0.8s ease-in forwards;
          }
          .circle {
            transform: rotate(302deg);
          }
        }
        .power-on {
          .line {
            opacity: 1;
            transition: opacity 0.05s ease-in 0.55s;
          }
          .circle {
            transform: rotate(302deg);
            stroke-dashoffset: 40;
            transition: transform 0.4s ease 0.2s,
              stroke-dashoffset 0.4s ease 0.2s;
          }
        }
      }
    }
  }

  @keyframes line-animation {
    0% {
      transform: translateY(0);
    }
    10% {
      transform: translateY(10px);
    }
    40% {
      transform: translateY(-25px);
    }
    60% {
      transform: translateY(-25px);
    }
    85% {
      transform: translateY(10px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes click-animation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`

const ThemeToggle = () => {
  const { theme, switchTheme } = useContext(ThemeContext)

  // if (!theme) {
  //   return null
  // }

  /* <label style={{ position: 'absolute', top: 0, right: 0 }}>
  <input
    type="checkbox"
    checked={theme === 'theme-dark'}
    onChange={(ev) => {
      switchTheme(ev.target.checked ? 'theme-dark' : 'theme-light')
    }}
  />{' '}
  Dark
</label>  */

  return (
    <Toggle
      className="switch"
      // style={{ position: 'absolute', top: 0, right: 0 }}
    >
      <input
        type="checkbox"
        checked={theme === 'theme-dark'}
        onChange={(ev) => {
          switchTheme(ev.target.checked ? 'theme-dark' : 'theme-light')
        }}
      />
      <div class="button">
        <svg class="power-off">
          <use href="#line" class="line" />
          <use href="#circle" class="circle" />
        </svg>
        <svg class="power-on">
          <use href="#line" class="line" />
          <use href="#circle" class="circle" />
        </svg>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 150 150"
          id="line"
        >
          <line x1="75" y1="34" x2="75" y2="58" />
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 150 150"
          id="circle"
        >
          <circle cx="75" cy="80" r="35" />
        </symbol>
      </svg>
    </Toggle>
  )
}

export default ThemeToggle

// const myThemes = [
//   {
//     id: 'theme-dark',
//     name: 'Dark Knight',
//   },

// ]

// const ThemePicker = ({ theme, setTheme }) => {
//   if (theme) {
//     return (
//       <div>
//         {myThemes.map((item, index) => {
//           const nextTheme =
//             myThemes.length - 1 === index
//               ? myThemes[0].id
//               : myThemes[index + 1].id

//           return item.id === theme ? (
//             <div key={item.id} className={item.id}>
//               <button
//                 aria-label={`Theme ${item.name}`}
//                 onClick={() => setTheme(nextTheme)}
//               >
//                 {item.name}
//               </button>
//             </div>
//           ) : null
//         })}
//       </div>
//     )
//   }
//   return null
// }

// export default ThemePicker
