import React from 'react'
import { motion } from 'framer-motion'
import projects from '../data/projects'

export const ProjectCard = ({
  id,
  title,
  category,
  theme,
  isSelected,
  onClick,
}) => {
  return (
    <motion.li
      variants={listVariant}
      className={`card ${theme}`}
      onClick={onClick}
    >
      <motion.div className="card-content-container">
        <motion.div
          className="card-content"
          layoutId={`card-container-${id}`}
          magicDependency={isSelected}
        >
          <motion.div
            className="card-image-container"
            layoutId={`card-image-container-${id}`}
            magicDependency={isSelected}
          >
            <img className="card-image" src={`images/${id}.jpg`} alt="" />
          </motion.div>
          <motion.div
            className="title-container"
            layoutId={`title-container-${id}`}
            magicDependency={isSelected}
          >
            <span className="category">{category}</span>
            <h2>{title}</h2>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.li>
  )
}

const listVariant = {
  initial: {
    opacity: 0,
    scale: 1.1,
  },
  final: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 1,
      duration: 0.5,
      // when: 'beforeChildren',
      staggerChildren: 0.4,
    },
  },
}

export const ProjectsList = ({ selectedId, setOpen }) => {
  return (
    <motion.ul
      variants={listVariant}
      initial="initial"
      animate="final"
      className="card-list"
    >
      {projects.map((card) => {
        return (
          <ProjectCard
            key={card.id}
            {...card}
            isSelected={card.id === selectedId}
            onClick={() => setOpen(card.id)}
          />
        )
      })}
    </motion.ul>
  )
}

export function ProjectDetails({ id, setOpen }) {
  const { category, title, p1 } = projects.find((item) => item.id === id)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} //1
        transition={{ duration: 0.2 }}
        className="overlay"
        onClick={() => setOpen(false)}
      />
      <div className="card-content-container open">
        <motion.div
          className="card-content"
          layoutId={`card-container-${id}`} //2
        >
          <motion.div
            className="card-image-container"
            layoutId={`card-image-container-${id}`} //3
          >
            <img className="card-image" src={`images/${id}.jpg`} alt="" />
          </motion.div>
          <motion.div
            className="title-container"
            layoutId={`title-container-${id}`} //4
          >
            <span className="category">{category}</span>
            <h2>{[title, p1]}</h2>
          </motion.div>
          <motion.div className="content-container" animate>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab,
            cumque. Porro quod qui, amet quaerat voluptatem aspernatur beatae
            fugiat animi aut cum possimus quis laudantium dolore, eveniet totam
            dignissimos quia? Modi ut repellendus recusandae est eius odit ad.
            Asperiores quibusdam, ad dignissimos magni vero in odio expedita qui
            optio facere! Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Ab, cumque. Porro quod qui, amet quaerat voluptatem aspernatur
            beatae fugiat animi aut cum possimus quis laudantium dolore, eveniet
            totam dignissimos quia? Modi ut repellendus recusandae est eius odit
            ad. Asperiores quibusdam, ad dignissimos magni vero in odio expedita
            qui optio facere! Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Ab, cumque. Porro quod qui, amet quaerat
            voluptatem aspernatur beatae fugiat animi aut cum possimus quis
            laudantium dolore, eveniet totam dignissimos quia? Modi ut
            repellendus recusandae est eius odit ad. Asperiores quibusdam, ad
            dignissimos magni vero in odio expedita qui optio facere! Lorem
            ipsum dolor sit amet consectetur, adipisicing elit. Ab, cumque.
            Porro quod qui, amet quaerat voluptatem aspernatur beatae fugiat
            animi aut cum possimus quis laudantium dolore, eveniet totam
            dignissimos quia? Modi ut repellendus recusandae est eius odit ad.
            Asperiores quibusdam, ad dignissimos magni vero in odio expedita qui
            optio facere! Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Ab, cumque. Porro quod qui, amet quaerat voluptatem aspernatur
            beatae fugiat animi aut cum possimus quis laudantium dolore, eveniet
            totam dignissimos quia? Modi ut repellendus recusandae est eius odit
            ad. Asperiores quibusdam, ad dignissimos magni vero in odio expedita
            qui optio facere!
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
