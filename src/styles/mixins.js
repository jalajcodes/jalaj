import { css } from 'styled-components'

export const mixins = {
  button: css`
    color: var(--light-green);
    margin-top: 40px;
    align-self: flex-start;
    background: none;
    border: 2px solid var(--light-green);
    font: inherit;
    line-height: 1;
    padding: 1rem 2rem;
    cursor: pointer;
    position: relative;
    transition: 0.25s;

    &:hover {
      box-shadow: 0 0.5em 0.5em -0.4em var(--light-green);
      transform: translateY(-0.25em);
    }
  `,
  modalButton: css`
    color: #03e9f4;
    background-color: transparent;
    display: inline-block;
    font-size: 24px;
    letter-spacing: 4px;
    /* margin-top: 20px; */
    padding: 10px 10px;
    /* position: relative; */
    overflow: hidden;
    text-decoration: none;
    text-transform: uppercase;
    transition: 0.5s;
    cursor: pointer;
    border: 2px solid var(--light-green);

    &:hover {
      background: #03e9f4;
      box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
        0 0 200px #03e9f4;
      color: #fff;
    }

    span {
      display: block;
      position: absolute;
    }

    span:nth-child(1) {
      animation: animate1 1s linear infinite;
      background: linear-gradient(90deg, transparent, #03e9f4);
      height: 2px;
      left: -100%;
      top: 0;
      width: 100%;
    }

    span:nth-child(2) {
      animation: animate2 1s linear infinite;
      animation-delay: 0.25s;
      background: linear-gradient(180deg, transparent, #03e9f4);
      height: 100%;
      top: -100%;
      right: 0;
      width: 2px;
    }

    span:nth-child(3) {
      animation: animate3 1s linear infinite;
      animation-delay: 0.5s;
      background: linear-gradient(270deg, transparent, #03e9f4);
      bottom: 0;
      height: 2px;
      right: -100%;
      width: 100%;
    }

    span:nth-child(4) {
      animation: animate4 1s linear infinite;
      animation-delay: 0.75s;
      background: linear-gradient(360deg, transparent, #03e9f4);
      bottom: -100%;
      height: 100%;
      left: 0;
      width: 2px;
    }
    @keyframes animate1 {
      0% {
        left: -100%;
      }
      50%,
      100% {
        left: 100%;
      }
    }
    @keyframes animate2 {
      0% {
        top: -100%;
      }
      50%,
      100% {
        top: 100%;
      }
    }
    @keyframes animate3 {
      0% {
        right: -100%;
      }
      50%,
      100% {
        right: 100%;
      }
    }
    @keyframes animate4 {
      0% {
        bottom: -100%;
      }
      50%,
      100% {
        bottom: 100%;
      }
    }

    @media (min-width: 800px) {
      margin: 20px 40px;
      padding: 24px 30px;
    }
  `,
}
