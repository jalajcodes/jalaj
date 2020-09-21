import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Guides from '../components/Guides'
import SEO from '../components/SEO'

import { getSimplifiedPosts } from '../utils/helpers'
import config from '../utils/config'

export default function GuidesPage({ data }) {
  const posts = data.allMarkdownRemark.edges
  const simplifiedPosts = useMemo(
    () => getSimplifiedPosts(posts, { thumbnails: true }),
    [posts]
  )

  return (
    <>
      <Helmet title={`Guides | ${config.siteTitle}`} />
      <SEO />
      <section>
        <h1>Guides</h1>
        <p className="subtitle">The missing instruction manuals of the web.</p>
        <Guides data={simplifiedPosts} />
      </section>
    </>
  )
}

export const pageQuery = graphql`
  query GuidesQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { in: "Guides" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            thumbnail {
              childImageSharp {
                fixed(width: 50, height: 50) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
  }
`
