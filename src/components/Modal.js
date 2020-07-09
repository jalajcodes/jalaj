import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
          ></motion.div>
          <motion.div
            className="modal"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <p>Hello?</p>
            <p>I am Live!</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
