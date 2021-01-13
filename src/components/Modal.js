import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyToClipboard } from '../utils/helpers'
import styled from 'styled-components'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContainer = styled(motion.div)`
  position: absolute;
  width: 90%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  top: -100px;
  padding: 20px 20px;
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
  z-index: 2;
  background: rgb(42, 42, 43);
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1462889/pat.svg'),
    radial-gradient(circle, var(--dark-bg) 0%, var(--navbar-bg) 100%);
  background-repeat: no-repeat;
  background-size: cover;

  p {
    color: var(--light-green);
    font-weight: bold;
    font-family: Righteous, sans-serif;
  }

  .modal-header {
    text-transform: uppercase;
    border-bottom: 3px solid var(--light-green);
    display: inline-block;
  }
  .modal-body {
    color: var(--light-green);
    /* font-family: 'Quicksand', sans-serif; */
    font-size: 1.7rem;
  }
  .modal-button {
    ${({ theme }) => theme.mixins.modalButton}
  }

  @media screen and (min-width: 800px) {
    max-width: 600px;

    .modal-body {
      font-size: 3rem;
    }
  }
`

const overlayVariant = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
  exit: {
    opacity: 0,
    transition: { delay: 0.5 },
  },
}

const modalVariant = {
  hidden: {
    y: '-100%',
    opacity: 0,
    transitionEnd: { display: 'none' },
  },
  visible: {
    display: 'flex',
    y: '60%',
    opacity: 1,
    transition: { delay: 0.5 },
  },
}

const Modal = ({ showModal, setShowModal }) => {
  const handleKey = useCallback(
    function keyHandler(e) {
      if (e.keyCode === 27) {
        setShowModal(false)
      }
    },
    [setShowModal]
  )

  useEffect(() => {
    document.addEventListener('keyup', handleKey)

    return () => document.removeEventListener('keyup', handleKey)
  }, [handleKey])

  function handleClick(e) {
    let email = e.target.previousSibling.textContent
    copyToClipboard(email)
    setShowModal((prev) => !prev)
  }

  return (
    <AnimatePresence exitBeforeEnter>
      {showModal && (
        <>
          <Overlay
            onClick={() => setShowModal(false)}
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* <div className="modal-wrapper"> */}
            <ModalContainer
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="dialog"
              onClick={(e) => e.stopPropagation()}
              aria-labelledby="modalTitle"
              aria-describedby="modalDescription"
            >
              <p className="modal-header" id="modalTitle">
                Got something to ask? Email me!
              </p>
              <div className="modal-body" id="modalDescription">
                jalaj799@gmail.com
              </div>
              <button
                type="button"
                className="modal-button"
                onClick={handleClick}
                aria-label="Close modal"
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Copy & Close
              </button>
            </ModalContainer>
          </Overlay>
          {/* </div> */}
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
