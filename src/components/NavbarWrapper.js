import React from 'react'
import Nav from './Nav'

const NavbarWrapper = ({ children }) => (
  <>
    {children}
    <Nav />
  </>
)

export default NavbarWrapper
