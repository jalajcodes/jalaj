import React, { useState, createContext } from 'react'

export const myContext = createContext()

const Provider = (props) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <myContext.Provider
      value={{
        showMenu,
        slideMenu: () => setShowMenu(!showMenu),
      }}
    >
      {props.children}
    </myContext.Provider>
  )
}

export default ({ element }) => <Provider>{element}</Provider>
