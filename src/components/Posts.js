import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

// import { slugify } from '../utils/helpers'

/* {tags && (
              <div className="cell tags">
                {node.tags &&
                  node.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tags/${slugify(tag)}`}
                      className={`tag-${tag}`}
                    >
                      {tag}
                    </Link>
                  ))}
              </div>
            )} */

export default function Posts({ data, location }) {
  return (
    <div className="posts-grid">
      {data.map((node) => {
        return (
          <div key={node.id} className="post">
            <div className="post-thumbnail">
              <Img fluid={node.thumbnail} alt={node.title} />
            </div>
            <div className="post-details">
              <time>{node.date}</time>
              <Link to={`/blog/${node.slug}`}>{node.title}</Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
