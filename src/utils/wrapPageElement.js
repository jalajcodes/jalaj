import React from 'react'
import Layout from '../components/Layout'

const CustomLayout = ({ element, props }, pluginOptions) => {
  return <Layout {...props}>{element}</Layout>
}

export default CustomLayout
