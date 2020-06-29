import React from 'react'
import { Link } from 'gatsby'
import { motion } from 'framer-motion'

export default function Nav() {
  return (
    <nav className="navbar">
      <div className="flex">
        <div>
          <Link to="/" className="brand">
            {/* <span className="emoji">💾</span>  */}
            &lt;Ja/aJ&gt;
          </Link>
        </div>
        <div className="hamburger">
          <Link to="/blog">Blog</Link>
          <Link to="/guides">Guides</Link>
        </div>
      </div>
    </nav>
  )
}
