import React from 'react'

import NavbarWrapper from './src/components/NavbarWrapper'

export const wrapPageElement = ({ element, props }) => {
  return <NavbarWrapper {...props}>{element}</NavbarWrapper>
}
