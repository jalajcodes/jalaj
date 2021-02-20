import React, { useState } from 'react'
import { Link } from 'gatsby'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import Modal from './Modal'
import config from '../utils/config'

const Navbar = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--nav-bg);
  position: absolute;
  z-index: 10;
  top: 0;
  width: 100%;
  font-family: Quicksand;
  transition: background 0.5s ease-out;

  a {
    border-radius: 0.3rem;
    color: var(--brand);
    border-bottom: none;
    font-weight: 400;
  }

  svg {
    /* stroke-width: 1px; */
    width: 29px;
    height: 29px;
  }

  .navbar__links--active {
    color: var(--brand);
  }

  .navbar__links--active svg {
    color: var(--brand);
  }

  a svg {
    cursor: pointer;
    color: var(--light-background);
  }

  @media (min-width: 800px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 80px;
    height: 100%;
    box-shadow: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;

    a {
      font-size: 1.1rem;
      letter-spacing: 2px;
    }
  }
`
const NavbarLogo = styled.div`
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;

  a.brand {
    font-size: calc(2.6rem + 1.2vw);
    font-family: 'Righteous', sans-serif;
    font-weight: 600;
    color: var(--brand);
    padding: 0 10px;
  }

  @media (min-width: 800px) {
    width: 100%;

    a.brand {
      padding: 0;
    }
  }
`

const NavbarLinks = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;
  background-color: var(--nav-bg);
  padding: 0.8rem 0;
  z-index: 10;
  opacity: 1;
  transition: background 0.5s ease-out;

  a {
    position: relative;
  }

  a::after {
    content: '';
    width: 100%;
    position: absolute;
    bottom: 30%;
    left: -20%;
    display: block;
    text-align: center;
    letter-spacing: 2px;
    font-size: 10px;
    opacity: 0;
    /* transition: opacity 0.2s ease-in; */
  }

  a:hover::after {
    opacity: 1;
  }

  a:first-child::after {
    content: 'HOME';
  }
  a:first-child + a::after {
    content: 'ABOUT';
  }
  a:first-child + a + a::after {
    content: 'PROJECTS';
    left: -60%;
  }
  a:first-child + a + a + a::after {
    content: 'BLOG';
    /* letter-spacing: 0px; */
  }
  a:first-child + a + a + a + a::after {
    content: 'CONTACT';
    left: -45%;
  }

  a:hover svg {
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  @media (min-width: 800px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding-top: 33px;
    position: static;
    background-color: unset;
    transition: background 0.5s ease-out;
    transform: translateX(0);
    opacity: 1;

    a {
      width: 100%;
      margin-bottom: 20px;
      line-height: 51px;
      position: relative;
    }

    a::after {
      content: '';
      width: 100%;
      position: absolute;
      bottom: 10%;
      left: 0;
      display: block;
      text-align: center;
      letter-spacing: 2px;
      font-size: 10px;
      opacity: 0;
      /* transition: opacity 0.2s ease-in; */
    }

    a:hover::after {
      opacity: 1;
    }

    a:first-child::after {
      content: 'HOME';
    }
    a:first-child + a::after {
      content: 'ABOUT';
    }
    a:first-child + a + a::after {
      content: 'PROJECTS';
      left: 0;
    }
    a:first-child + a + a + a::after {
      content: 'BLOG';
      /* letter-spacing: 0px; */
    }
    a:first-child + a + a + a + a::after {
      content: 'CONTACT';
      left: 0;
    }
    a:hover svg {
      opacity: 0;
    }
  }
`

const NavbarSocial = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  transition: background 0.5s ease-out;

  a {
    margin-bottom: 10px;
  }

  a svg {
    width: 15px;
    height: 15px;
  }

  a:hover svg {
    color: var(--brand);
  }

  @media (max-width: 800px) {
    display: none;
    transition: background 0.5s ease-out;
  }
`

export default function Nav() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Navbar
        initial={{ opacity: 0, x: -80 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        }}
      >
        <NavbarLogo>
          <Link to="/" className="brand">
            &lt;J&gt;
          </Link>
        </NavbarLogo>
        <NavbarLinks>
          {config.navLinks.map((item) => {
            if (item.modal) {
              return (
                <Link
                  key={item.name}
                  className={showModal ? 'navbar__links--active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    setShowModal(!showModal)
                  }}
                  to={item.urlPath}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d={item.path} />
                  </svg>
                </Link>
              )
            }
            return (
              <>
                <Link
                  key={item.name}
                  activeClassName="navbar__links--active"
                  to={item.urlPath}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d={item.path} />
                  </svg>
                </Link>
              </>
            )
          })}
        </NavbarLinks>

        <NavbarSocial>
          {config.socialMedia.map((item) => {
            let pathElement

            if (typeof item.path === 'object') {
              pathElement = item.path.map((p, i) => <path key={i} d={p}></path>)
            } else {
              pathElement = <path d={item.path}></path>
            }

            return (
              <a
                key={item.name}
                className="navbar__social--twitter"
                href={item.url}
                title={item.name}
              >
                <svg
                  fill="currentColor"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                >
                  {pathElement}
                </svg>
              </a>
            )
          })}
        </NavbarSocial>
      </Navbar>
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}
