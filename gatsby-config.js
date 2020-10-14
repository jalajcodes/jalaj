module.exports = {
  siteMetadata: {
    title: 'Jalaj Gupta',
    author: {
      name: 'Jalaj Gupta',
    },
    pathPrefix: '/',
    siteUrl: 'https://www.jalaj.dev',
    description:
      'Fullstack Web and Mobile Developer. This is my portfolio and personal blog.',
  },
  plugins: [
    // ===================================================================================
    // Meta
    // ===================================================================================

    'gatsby-plugin-react-helmet',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Jalaj Gupta',
        short_name: 'Jalaj Gupta',
        description:
          'Fullstack Web and Mobile Developer. This is my portfolio and personal blog.',
        start_url: '/',
        background_color: 'white',
        theme_color: '#5183f5',
        display: 'minimal-ui',
        icon: `static/logo.png`,
      },
    },

    // ===================================================================================
    // Images and static
    // ===================================================================================

    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `${__dirname}/static/`,
      },
    },

    // ===================================================================================
    // Markdown
    // ===================================================================================

    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-normalize-paths',
            options: {
              pathFields: ['thumbnail'],
            },
          },
          {
            resolve: `gatsby-remark-relative-images`,
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: true,
              noInlineHighlight: true,
              prompt: {
                user: 'root',
                host: 'localhost',
                global: true,
              },
            },
          },
          'gatsby-remark-prismjs',
        ],
      },
    },

    // ===================================================================================
    // Search
    // ===================================================================================

    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        name: 'pages',
        engine: 'flexsearch',
        engineOptions: {
          encode: 'icase',
          tokenize: 'forward',
          async: false,
        },
        query: `
		{
			allMarkdownRemark(filter: {frontmatter: {template: {eq: "post"}}}) {
				nodes {
					id
					excerpt
					timeToRead
					frontmatter {
						title
						tags
						slug
						date(formatString: "MMMM DD, YYYY")
						thumbnail {
							childImageSharp {
								fluid {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
					}
					rawMarkdownBody
				}
			}
		}
        `,
        ref: 'id',
        index: ['title', 'body', 'tags'],
        store: [
          'id',
          'slug',
          'title',
          'tags',
          'date',
          'thumbnail',
          'excerpt',
          'timeToRead',
        ],
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            slug: `/${node.frontmatter.slug}`,
            title: node.frontmatter.title,
            body: node.rawMarkdownBody,
            tags: node.frontmatter.tags,
            date: node.frontmatter.date,
            excerpt: node.excerpt,
            timeToRead: node.timeToRead,
            thumbnail: node.frontmatter.thumbnail.childImageSharp.fluid,
          })),
      },
    },

    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `tomato`,
        // Disable the loading spinner.
        showSpinner: true,
      },
    },
  ],
}
