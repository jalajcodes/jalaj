import styled from 'styled-components'

const Blobs = styled.div`
  min-height: 50vh;
  width: 100%;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: stretch;
  align-items: stretch;
  -webkit-box-pack: space-evenly;
  justify-content: space-evenly;
  overflow: hidden;
  position: absolute;

  &::before,
  &::after {
    content: '';
    width: 70vmax;
    height: 60vmax;
    position: absolute;
    z-index: -1;
    background: rgba(255, 255, 255, 0.03);
    left: 20vmin;
    top: 20vmin;
    -webkit-animation: squish 10s linear infinite alternate,
      spin 40s linear infinite;
    animation: squish 10s linear infinite alternate, spin 40s linear infinite;
    z-index: 0;
    will-change: border-radius, transform;
    -webkit-transform-origin: 55% 55%;
    transform-origin: 55% 55%;
    pointer-events: none;
  }
  &::after {
    width: 60vmin;
    height: 50vmin;
    left: auto;
    right: 20vmin;
    top: auto;
    bottom: 20vmin;
    animation: squish 10s linear infinite alternate,
      spin 40s linear infinite reverse;
    -webkit-transform-origin: 20% 20%;
    transform-origin: 20% 20%;
  }

  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes squish {
    0% {
      border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
    }
    100% {
      border-radius: 40% 60%;
    }
  }
`

export default Blobs
