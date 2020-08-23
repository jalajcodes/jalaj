import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyToClipboard } from '../utils/helpers'

const overlayVariant = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
  exit: {
    opacity: 0,
    transition: { delay: 0.5 },
  },
}

const modalVariant = {
  visible: {
    y: '200px',
    opacity: 1,
    transition: { delay: 0.5 },
  },
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
}

const Modal = ({ showModal, setShowModal }) => {
  useEffect(() => {
    document.addEventListener('keyup', keyHandler)

    return () => document.removeEventListener('keyup', keyHandler)
  }, [])

  function keyHandler(e) {
    if (e.keyCode == 27) {
      setShowModal(false)
    }
  }
  function handleClick(e) {
    let email = e.target.previousSibling.textContent
    copyToClipboard(email)
    setShowModal(false)
  }

  return (
    <AnimatePresence exitBeforeEnter onExitComplete={() => setShowModal(false)}>
      {showModal && (
        <>
          <motion.div
            onClick={() => setShowModal(false)}
            className="overlay"
            variants={overlayVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* <div className="modal-wrapper"> */}
            <motion.div
              className="modal"
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
                Got something to ask? Email me 😁
              </p>
              <div className="modal-body" id="modalDescription">
                jalaj799@gmail.com
              </div>
              <a
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
              </a>
            </motion.div>
          </motion.div>
          {/* </div> */}
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
