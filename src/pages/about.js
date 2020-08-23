import React from 'react'
import Layout from '../components/Layout'
import javascriptImg from '../../content/thumbnails/javascript.webp'
import htmlImg from '../../content/thumbnails/html.webp'
import cssImg from '../../content/thumbnails/css.webp'
import reactImg from '../../content/thumbnails/react.webp'
import nodeImg from '../../content/thumbnails/node.webp'
import typescriptImg from '../../content/thumbnails/typescript.webp'

function About() {
  return (
    <Layout>
      <div className="about__main">
        <div className="about__main-col">
          <h2 className="about__heading">About Me</h2>
          <div className="about__main-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            quaerat, delectus aliquid eum quia illo molestiae, veniam, nostrum
            distinctio enim excepturi in deleniti! Ex rem cupiditate voluptas
            ducimus, ab voluptatum! Dolores, laboriosam. Omnis nulla labore ad{' '}
            <br />
            voluptatibus aut debitis fuga expedita, earum harum odit numquam non
            cupiditate nisi perspiciatis sapiente minus rerum sunt dignissimos
            suscipit reprehenderit asperiores quia beatae velit incidunt. Minus
            quidem assumenda similique voluptatem molestiae accusamus aspernatur
          </div>
          <button className="about-button">
            Resume <span className="about-button__arrow">&rarr;</span>
          </button>
        </div>
        <div className="skill-cube">
          <div className="cube">
            <div className="front">
              <img src={javascriptImg} alt="javascript" />
            </div>
            <div className="back">
              <img src={htmlImg} alt="html" />
            </div>
            <div className="top">
              <img src={cssImg} alt="css" />
            </div>
            <div className="bottom">
              <img src={reactImg} alt="react.js" />
            </div>
            <div className="left">
              <img src={nodeImg} alt="node.js" />
            </div>
            <div className="right">
              <img src={typescriptImg} alt="typescript" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default About
