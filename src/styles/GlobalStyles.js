import { createGlobalStyle } from 'styled-components'
import PrismStyles from './PrismStyles'

const GlobalStyles = createGlobalStyle`
  /* Global variables */

  :root {
    /* --font-color: #495057; */
    --font-color: #f1f3f5;
    --heading-color: #343a40;
    --dark-font-color: #212529;
    --light-font-color: #868e96;
    --light-background: #f1f3f5;
    --scrollbar-bg: rgba(100, 110, 140, 0.25);
    --border: #d6d9de;
    --link-color: #5183f5;
    --light-green: #21e6c1;
    --dark-bg: #061621;
    --navbar-bg: #061118;
  }

  /* Reset */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-bg) transparent;
  }

  /* Scaffolding */

  html {
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI', Roboto,
      'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    color: var(--font-color);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.6;
  }

  body {
    margin: 0;
    background-color: var(--dark-bg);
    overflow-x: hidden;
    overflow-y: visible;
    font-family: 'Quicksand', sans-serif;
  }

  article {
    min-width: 0;
  }

  section {
    margin: 2rem 0;
  }

  section > h2 {
    margin-top: 4rem;
  }

  @media screen and (min-width: 800px) {
    section {
      margin: 3rem 0;
    }
  }

  img {
    display: inline-block;
    max-width: 100%;
    height: auto;
  }

  p,
  ol,
  ul,
  dl,
  table,
  blockquote {
    font-size: 1.05rem;
    margin: 0 0 1.5rem 0;
  }

  ul li p {
    margin: 0;
  }

  ul li ul {
    padding-left: 1rem;
    margin: 0;
  }

  ul li ul li {
    margin: 0.25rem 0;
  }

  ol li ol {
    margin-bottom: 0;
  }

  .task-list-item [type='checkbox'] {
    margin-right: 0.5rem;
  }

  blockquote {
    margin: 1.5rem 0;
    padding: 1rem;
    background: #fff9db;
    border-radius: 0.3rem;
    border: 1px solid #ffe066;
    border-left: 8px solid #ffe066;
  }

  blockquote p {
    margin: 0;
  }

  blockquote a {
    padding: 1px 4px;
    border-bottom: 2px solid #ffe066;
    color: var(--heading-color);
  }

  blockquote a:hover {
    border-radius: 0.3rem;
    border-bottom: 2px solid #ffe066;
    background: #ffe066;
    color: var(--heading-color);
  }

  /* Headings */

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0 0 1.5rem 0;
    font-weight: 700;
    line-height: 1.2;
    color: var(--heading-color);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1:not(:first-child),
  h2:not(:first-child),
  h3:not(:first-child),
  h4:not(:first-child) {
    margin-top: 3rem;
  }

  h1 {
    font-size: 2.5rem;
    line-height: 1.1;
  }

  h2 {
    font-size: 2rem;
  }

  h2 code {
    font-size: 2rem !important;
  }

  h3 {
    font-size: 1.6rem;
    color: var(--font-color);
    font-weight: 600;
  }

  h4 {
    font-size: 1.4rem;
    color: var(--font-color);
    font-weight: 500;
    margin-bottom: 1rem;
  }

  h5 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  @media screen and (min-width: 800px) {
    h1 {
      font-size: 3rem;
    }
  }
  /* Scrollbar */

  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-bg);
    border-radius: 10px;
  }

  /* Sidebar */

  aside {
    min-width: 300px;
  }

  aside p,
  aside ul {
    font-size: 0.95rem;
  }

  aside ul {
    padding-left: 1rem;
  }

  aside h3 {
    font-size: 1.4rem;
  }

  .aside-content {
    border-top: 2px solid var(--light-background);
  }

  @media screen and (min-width: 1100px) {
    .aside-content {
      border-top: 0;
      border-left: 2px solid var(--light-background);
      padding-left: 2rem;
    }
    .aside-content section {
      margin-top: 0.25rem;
    }
  }

  a.kofi,
  a.patreon {
    display: grid;
    grid-template-columns: 40px auto;
    color: var(--heading-color);
    border-bottom: none;
    padding: 0.75rem;
    border-radius: 0.3rem;
  }

  a.kofi:hover,
  a.patreon:hover {
    border-bottom: none;
    background: var(--light-background);
  }

  .kofi img,
  .patreon img {
    display: inline-block;
    height: auto;
    margin-right: 1rem;
  }

  .kofi img {
    width: 30px;
  }

  .patreon img {
    width: 25px;
  }

  button::active, button::focus {
    outline: none;
  }

.lead {
  margin: 4rem 0;
}

.lead h1 {
  color: var(--dark-font-color);
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.lead p {
  font-size: 1.1rem;
}

@media screen and (min-width: 800px) {
  .main-area {
    flex: 1;
  }

  .lead h1 {
    font-size: 3rem;
  }

  .lead p {
    font-size: 1.2rem;
  }
}

p.subtitle {
  color: var(--light-font-color);
  font-size: 1.2rem;
}

@media screen and (min-width: 800px) {
  p.subtitle {
    font-size: 1.4rem;
  }
}

/* Links */

a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
}

/* a:hover {
  border-bottom: 2px solid var(--link-color);
  color: var(--heading-color);
} */

a code {
  border-bottom: 2px solid var(--link-color);
}

a code:hover {
  background: var(--link-color) !important;
  color: white !important;
}

/* Tables */

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  display: block;
}

th {
  border-bottom: 2px solid var(--light-background);
}

tfoot th {
  border-top: 2px solid var(--light-background);
}

td {
  border-bottom: 2px solid var(--light-background);
}

th,
td {
  text-align: left;
  padding: 0.75rem !important;
  hyphens: auto;
  word-break: break-word;
}

tbody tr:nth-child(even) {
  background-color: var(--light-background);
}

/* Blog Page */

.posts-grid {
  display: grid;
  /* grid-template-columns: 1fr 1fr; */
  /* gap: 20px; */
  margin: 0 20px;
}

.post {
  /* background-color: #03e9f4; */
  border-radius: 10px;
  /* overflow: hidden; */
}

.post-details {
  padding: 10px;
}

.posts a {
  border-bottom: none;
}

@media screen and (min-width: 800px) {
  .posts-grid {
    /* grid-template-columns: repeat(3, 1fr); */
    margin: 0 0;
  }

  .post {
    /* max-width: 350px; */
  }
}

@media screen and (min-width: 800px) {
}

/* Post */

.grid.post {
  grid-gap: 3rem;
  margin-left: 0;
  margin-right: 0;
}

.article-header h1 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

@media screen and (min-width: 1100px) {
  .grid.post {
    /* grid-template-columns: 3fr 1fr; */
  }

  .article-header h1 {
    font-size: 2.75rem;
    margin-bottom: 3rem;
  }
}

/* Search */

[type='search'] {
  display: block;
  padding: 0.8rem 1rem;
  border: 2px solid var(--border);
  width: 100%;
  max-width: 400px;
  border-radius: 0.3rem;
  font-size: 1rem;
}

::placeholder,
::-webkit-input-placeholder,
::-moz-placeholder,
:-moz-placeholder,
:-ms-input-placeholder {
  color: var(--light-font-color);
}

/* Suggested */

.suggested {
  margin-left: -1rem;
  margin-right: -1rem;
  align-items: stretch;
}

.suggested a {
  flex: 1;
  text-align: center;
  margin: 1rem;
  border-bottom: none;
  transition: all 0.2s ease;
  padding: 1.5rem;
  border-radius: 0.3rem;
  box-shadow: 0 3px 13px rgba(100, 110, 140, 0.1),
    0 2px 4px rgba(100, 110, 140, 0.15);
  color: var(--font-color);
}

.suggested a:hover {
  transform: translate3D(0, -1px, 0);
  box-shadow: 0 8px 22px rgba(100, 110, 140, 0.2),
    0 5px 18px rgba(100, 110, 140, 0.25);
}

/* Helpers */

.small {
  max-width: 600px;
}

.medium {
  max-width: 750px;
}

time,
.meta {
  color: var(--light-font-color);
  font-size: 0.9rem;
  white-space: nowrap;
  font-weight: 400;
}

/* Tags */

.count {
  font-weight: 700;
  color: var(--link-color);
}

.tags {
  display: flex !important;
  align-items: center;
}

.tags > a {
  display: block;
  font-weight: 500;
  background: #f8f9fa;
  color: #868e96;
  margin: 0.2rem;
  padding: 0.4rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 0.3rem;
  border-bottom: 0;
  white-space: nowrap;
}

span {
  display: inline-block;
}

.tags > a:first-child {
  margin-left: 0;
}

.tags > a:last-child {
  margin-right: 0;
}

.tags > a:hover {
  background: #868e96;
  color: white;
}

mark {
  background: #ffec99;
}

a.tag-javascript,
a.tag-sql {
  background: #fff9db;
  color: #fab005;
}

a.tag-javascript:hover,
a.tag-sql:hover {
  background: #fab005;
  color: white;
}

a.tag-linux,
a.tag-git,
a.tag-snippets,
a.tag-html {
  background: #fff4e6;
  color: #fd7e14;
}

a.tag-linux:hover,
a.tag-git:hover,
a.tag-snippets:hover,
a.tag-html:hover {
  background: #fd7e14;
  color: white;
}

a.tag-vue,
a.tag-new-year {
  color: #0ca678;
  background: #e6fcf5;
}

a.tag-vue:hover,
a.tag-new-year:hover {
  background: #0ca678;
  color: white;
}

a.tag-fundamentals,
a.tag-game,
a.tag-testing {
  background: #ebfbee;
  color: #37b24d;
}

a.tag-fundamentals:hover,
a.tag-game:hover,
a.tag-testing:hover {
  background: #37b24d;
  color: white;
}

a.tag-node,
a.tag-security,
a.tag-automation {
  background: #fff5f5;
  color: #f03e3e;
}

a.tag-node:hover,
a.tag-security:hover,
a.tag-automation:hover {
  background: #f03e3e;
  color: white;
}

a.tag-wordpress,
a.tag-projects,
a.tag-reference,
a.tag-notes,
a.tag-jQuery {
  background: #e3fafc;
  color: #1098ad;
}

a.tag-wordpress:hover,
a.tag-projects:hover,
a.tag-reference:hover,
a.tag-notes:hover,
a.tag-jQuery:hover {
  background: #1098ad;
  color: white;
}

a.tag-css,
a.tag-dom,
a.tag-architecture {
  background: #e7f5ff;
  color: #1c7ed6;
}

a.tag-css:hover,
a.tag-dom:hover,
a.tag-architecture:hover {
  background: #1c7ed6;
  color: white;
}

a.tag-php,
a.tag-redux,
a.tag-gatsby,
a.tag-life {
  background: #f3f0ff;
  color: #7950f2;
}

a.tag-php:hover,
a.tag-redux:hover,
a.tag-gatsby:hover,
a.tag-life:hover {
  background: #7950f2;
  color: white;
}

a.tag-react,
a.tag-api {
  background: #edf2ff;
  color: #4263eb;
}

a.tag-react:hover,
a.tag-api:hover {
  background: #4263eb;
  color: white;
}

a.tag-design,
a.tag-database {
  background: #fff0f6;
  color: #e64980;
}

a.tag-design:hover,
a.tag-database:hover {
  background: #e64980;
  color: white;
}

a.tag-notes {
  background: #f8f0fc;
  color: #ae3ec9;
}

a.tag-notes:hover {
  background: #ae3ec9;
  color: white;
}

.blast {
  display: inline-block;
}
.blast {
  display: inline-block;
  -webkit-transition: all 0.3s ease-out;
  transition: all 0.3s ease-out;
}

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@keyframes rubberBand {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    -ms-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  30% {
    -webkit-transform: scale3d(1.25, 0.75, 1);
    -ms-transform: scale3d(1.25, 0.75, 1);
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    -webkit-transform: scale3d(0.75, 1.25, 1);
    -ms-transform: scale3d(0.75, 1.25, 1);
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    -webkit-transform: scale3d(1.15, 0.85, 1);
    -ms-transform: scale3d(1.15, 0.85, 1);
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    -webkit-transform: scale3d(0.95, 1.05, 1);
    -ms-transform: scale3d(0.95, 1.05, 1);
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    -webkit-transform: scale3d(1.05, 0.95, 1);
    -ms-transform: scale3d(1.05, 0.95, 1);
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    -ms-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
.rubberBand {
  animation-name: rubberBand;
}

  ${PrismStyles}
`
export default GlobalStyles
