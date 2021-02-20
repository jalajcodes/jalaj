import React, { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import styled from 'styled-components'
import { ProjectDetails, ProjectsList } from '../components/Projects'

const Wrapper = styled.div`
  --secondary: rgb(161, 161, 161);
  --divider: #343434;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100vw;
  flex: 1 1 100%;

  .avatar {
    background: var(--divider);
    border-radius: 50%;
    position: absolute;
    bottom: 12px;
    right: 0;
    overflow: hidden;
  }

  .avatar,
  .avatar img {
    width: 40px;
    height: 40px;
  }

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .card-list {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .card {
    position: relative;
    padding: 25px;
    height: 460px;
    flex: 0 0 40%;
    max-width: 40%;
  }

  .card:nth-child(4n + 1),
  .card:nth-child(4n + 4) {
    flex: 0 0 60%;
    max-width: 60%;
  }

  .card:nth-child(odd) {
    padding-left: 0;
  }

  .card:nth-child(even) {
    padding-right: 0;
  }

  .card-content-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: block;
    pointer-events: none;
  }

  .card-content-container.open {
    top: 0;
    left: 0;
    right: 0;
    position: fixed;
    z-index: 1;
    overflow: hidden;
    padding: 40px 0;
  }

  .card-content {
    pointer-events: auto;
    position: relative;
    border-radius: 20px;
    background: #1c1c1e;
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .open .card-content {
    /* height: auto; */
    max-width: 700px;
    overflow: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar-track {
      margin: 15px 0;
    }
  }

  .card-open-link {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .card-image-container {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    height: 420px;
    width: 100vw;
  }

  .open .card-image-container,
  .open .title-container {
    z-index: 1;
  }

  .title-container {
    position: absolute;
    top: 15px;
    left: 15px;
    max-width: 300px;
  }

  .open .title-container {
    top: 30px;
    left: 30px;
  }

  h2 {
    color: #fff;
    margin: 8px 0;
  }

  .category {
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
  }

  .overlay {
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    will-change: opacity;
  }

  .content-container {
    padding: 460px 35px 35px 35px;
    max-width: 700px;
    width: 90vw;
  }

  @media only screen and (max-width: 800px) {
    .card {
      flex: 0 0 50%;
      max-width: 50%;
    }

    .card:nth-child(4n + 1),
    .card:nth-child(4n + 4) {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }

  @media only screen and (max-width: 600px) {
    .card {
      flex: 1 0 100%;
      max-width: 100%;
      padding-left: 0;
      padding-right: 0;
    }

    .card:nth-child(4n + 1),
    .card:nth-child(4n + 4) {
      flex: 1 0 100%;
      max-width: 100%;
    }

    .card-content-container.open {
      padding: 0;
    }
  }
`

const Projects = () => {
  const [open, setOpen] = useState(false)
  const handleKey = useCallback(
    function keyHandler(e) {
      if (e.keyCode === 27) {
        setOpen(false)
      }
    },
    [setOpen]
  )

  useEffect(() => {
    document.addEventListener('keyup', handleKey)
    return () => document.removeEventListener('keyup', handleKey)
  }, [handleKey])

  return (
    <Wrapper>
      <AnimateSharedLayout type="crossfade">
        <ProjectsList selectedId={open} setOpen={setOpen} />
        <AnimatePresence>
          {open && <ProjectDetails id={open} setOpen={setOpen} />}
        </AnimatePresence>
      </AnimateSharedLayout>
    </Wrapper>
  )
}

export default Projects
