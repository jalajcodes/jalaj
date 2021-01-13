import { css } from 'styled-components'

const vars = {
  code_font_family: "'FiraCode', 'Roboto Mono', Courier New, monospace",
  code_font_color: '#b3b9c5',
  code_background_color: '#212121',
  string: '#92d192',
  variable: '#f2777a',
  property: '#abb2bf',
  number: '#fca369',
  operator: '#ac8d58',
  punctuation: '#d5d8df',
  comment: '#848991',
  function: '#62cfcf',
  keyword: '#ffeead',
  attribute: '#ffd479',
  class: '#e1a6f2',
  tag: '#6ab0f3',
  error: '#f2777a',
  light_background: '#f1f3f5',
}

const PrismStyles = css`
  pre[class*='language-'] {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.55);
  }

  code[class*='language-'],
  pre[class*='language-'] {
    -webkit-font-smoothing: subpixel-antialiased;
    color: ${vars.code_font_color};
    font-family: ${vars.code_font_family};
    font-size: 0.9rem;

    text-align: left;
    white-space: pre-wrap;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    font-weight: 400;
    line-height: 1.7;

    -moz-tab-size: 2;
    -o-tab-size: 2;
    tab-size: 2;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1.5rem;
    margin: 0.5rem 0 2rem 0;
    overflow: auto;
    border-radius: 0.3rem;
  }

  :not(pre) > code[class*='language-'],
  pre[class*='language-'] {
    background-color: ${vars.code_background_color};
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    padding: 0.1rem 0.3rem;
    border-radius: 0.3rem;
  }

  pre.language-text,
  code.language-text {
    background: ${vars.light_background} !important;
    color: #333 !important;
    box-shadow: none;
  }

  code.language-shell::before {
    content: '$ ';
    color: ${vars.comment};
  }

  pre.language-terminal {
    position: relative;
    background: white;
    color: #595c62;
    box-shadow: 0 8px 16px rgba(100, 120, 130, 0.35);
    padding-top: 3rem;
    margin: 2rem 0;
  }

  code.language-terminal {
    color: #595c62;
  }

  pre.language-terminal::before {
    content: '\2022 \2022 \2022';
    position: absolute;
    top: 0;
    left: 0;
    background: #e0e3e7;
    color: ${vars.code_font_color};
    width: 100%;
    font-size: 2.5rem;
    margin: 0;
    line-height: 0;
    padding: 18px 0 16px;
    text-indent: 6px;
    letter-spacing: -18px;
  }

  .gatsby-highlight-code-line {
    background-color: #191919;
    display: block;
    margin-right: -1rem;
    margin-left: -1rem;
    padding-right: 1rem;
    padding-left: 0.75rem;
    border-left: 0.25rem solid ${vars.string};
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata,
  .token.important {
    color: ${vars.comment};
  }

  .token.punctuation {
    color: ${vars.punctuation};
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.property {
    color: ${vars.property};
  }

  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: ${vars.tag};
  }

  .token.number {
    color: ${vars.number};
  }

  .token.char,
  .token.builtin,
  .token.url,
  .token.inserted {
    color: ${vars.code_font_color};
  }

  .token.attr-name,
  .token.selector {
    color: ${vars.attribute};
  }

  .token.attr-value,
  .token.string {
    color: ${vars.string};
  }

  .token.operator {
    color: ${vars.operator};
  }

  .token.atrule,
  .token.keyword {
    color: ${vars.keyword};
  }

  .token.function {
    color: ${vars.function};
  }

  .language-css,
  .token.boolean,
  .token.class-name {
    color: ${vars.class} !important;
  }

  .token.regex {
    color: ${vars.keyword};
  }

  .token.variable {
    color: ${vars.variable};
  }

  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }

  .filename {
    font-size: 0.9rem;
    margin-bottom: -0.8rem;
    padding: 0.5rem 1rem 0.75rem;
    line-height: 1.8;

    background-color: black;
    color: white;
    z-index: 1;

    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
  }

  pre::-moz-selection,
  pre::-moz-selection,
  code::-moz-selection,
  code::-moz-selection {
    text-shadow: none;
    color: inherit;
    background: rgba(150, 150, 150, 0.3) !important;
  }

  pre::selection,
  pre::selection,
  code::selection,
  code::selection {
    text-shadow: none;
    color: inherit;
    background: rgba(150, 150, 150, 0.3) !important;
  }

  pre[class*='language-']::-moz-selection,
  pre[class*='language-']::-moz-selection,
  code[class*='language-'] ::-moz-selection,
  code[class*='language-'] ::-moz-selection {
    text-shadow: none;
    color: inherit;
    background: rgba(150, 150, 150, 0.3) !important;
  }

  pre[class*='language-']::selection,
  pre[class*='language-']::selection,
  code[class*='language-'] ::selection,
  code[class*='language-'] ::selection {
    text-shadow: none;
    color: inherit;
    background: rgba(150, 150, 150, 0.3) !important;
  }
`

export default PrismStyles
