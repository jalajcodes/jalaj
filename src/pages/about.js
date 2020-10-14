import React from 'react'
import CharacterAnimate from '../components/CharacterAnimate'
// import javascriptImg from '../../content/thumbnails/javascript.webp'
// import htmlImg from '../../content/thumbnails/html.webp'
// import cssImg from '../../content/thumbnails/css.webp'
// import reactImg from '../../content/thumbnails/react.webp'
// import nodeImg from '../../content/thumbnails/node.webp'
// import graphqlImg from '../../content/thumbnails/graphql.webp'

function About({ location }) {
  return (
    <>
      <div className="about__main">
        <div className="about__main-col">
          <h2 className="about__heading">
            <CharacterAnimate>About Me!</CharacterAnimate>
          </h2>
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
          <div className="cube" style={{ fontFamily: 'cursive' }}>
            <div className="front">
              JavaScript
              {/* <img src={javascriptImg} alt="javascript" /> */}
            </div>
            <div className="back">
              HTML
              {/* <img src={htmlImg} alt="html" /> */}
            </div>
            <div className="top">
              CSS
              {/* <img src={cssImg} alt="css" /> */}
            </div>
            <div className="bottom">
              React.js
              {/* <img src={reactImg} alt="react.js" /> */}
            </div>
            <div className="left">
              Node.js
              {/* <img src={nodeImg} alt="node.js" /> */}
            </div>
            <div className="right">
              GraphQL
              {/* <img src={graphqlImg} alt="graphql" /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
