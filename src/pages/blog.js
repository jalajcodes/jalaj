import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Search from '../components/Search'
import SEO from '../components/SEO'

import { getSimplifiedPosts } from '../utils/helpers'
import config from '../utils/config'
import CharacterAnimate from '../components/CharacterAnimate'

export default function BlogIndex({ data, location }) {
  const posts = data.allMarkdownRemark.edges
  const simplifiedPosts = useMemo(
    () => getSimplifiedPosts(posts, { thumbnails: true }),
    [posts]
  )

  return (
    <>
      <Helmet title={`Blog | ${config.siteTitle}`} />
      <SEO />
      <section>
        <h1>
          <CharacterAnimate>Blog</CharacterAnimate>
        </h1>
        <p className="subtitle">
          Articles, tutorials, snippets, musings, and everything else.
        </p>
        <Search location={location} posts={simplifiedPosts} />
      </section>
    </>
  )
}

export const pageQuery = graphql`
  query BlogQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          id
          excerpt
          timeToRead
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
            thumbnail {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`
