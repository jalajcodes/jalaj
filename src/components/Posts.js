import React from 'react'
import { Link } from 'gatsby'

import { slugify } from '../utils/helpers'

export default function Posts({ data, tags, location }) {
  return (
    <div className={tags ? 'grid posts with-tags' : 'grid posts'}>
      {data.map((node) => {
        return (
          <div key={node.id} className="row">
            <div className="cell">
              <time>{node.date}</time>
            </div>
            <div className="cell">
              <Link to={`/blog/${node.slug}`}>{node.title}</Link>
            </div>
            {tags && (
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
            )}
          </div>
        )
      })}
    </div>
  )
}
