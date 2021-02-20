export function getSimplifiedPosts(posts, options = {}) {
  return posts.map((post) => ({
    id: post.node.id,
    date: post.node.frontmatter.date,
    slug: post.node.fields.slug,
    excerpt: post.node.excerpt,
    timeToRead: post.node.timeToRead,
    tags: post.node.frontmatter.tags,
    title: post.node.frontmatter.title,
    ...(options.thumbnails && {
      thumbnail: post.node.frontmatter.thumbnail.childImageSharp.fluid,
    }),
  }))
}

export function slugify(string) {
  return (
    string &&
    string
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join('-')
  )
}

export function throttle(func, wait, options) {
  var context, args, result
  var timeout = null
  var previous = 0
  if (!options) options = {}
  var later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    var now = Date.now()
    if (!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

export function copyToClipboard(str) {
  const el = document.createElement('textarea')
  el.value = str
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(selected)
  }
}

export function devEasterMessage(url) {
  // https://stackoverflow.com/questions/26283936/stylized-console-logging
  // Create a new `Image` instance
  var image = new Image()

  // Actually loads the image
  image.src = url

  // console.clear()
  console.log(
    '%c     JALAJ',
    'width:1000px;text-align:center;font-weight:bold;font-size:50px;color:red;text-shadow:3px 3px 0 rgb(217,31,38),6px 6px 0 rgb(226,91,14),9px 9px 0 rgb(245,221,8),12px 12px 0 rgb(5,148,68),15px 15px 0 rgb(2,135,206),18px 18px 0 rgb(4,77,145),21px 21px 0 rgb(42,21,113)'
  )
  console.log(
    '%c 👋 Oh, Hi there, Curious Person!',
    'color: #21e6c1; font-size:24px;'
  )
  console.log(
    `%c

      🐛 Found a bug? Please, let me know by e-mail, twitter, github issue...
      ✨ Like what you see? We could work together!
      📬 Find me here: https://twitter.com/jalajcodes

      Let the debug begin!

      Bonus: 👇 A Cute Cat pic for you! 👇
    `,
    'font-size:16px'
  )

  image.onload = function () {
    // Inside here we already have the dimensions of the loaded image
    var style = [
      // Hacky way of forcing image's viewport using `font-size` and `line-height`
      'font-size: 1px;',
      'line-height: ' + this.height + 'px;',
      // Hacky way of forcing a middle/center anchor point for the image
      'padding: ' + this.height * 0.5 + 'px ' + this.width * 0.5 + 'px;',
      // // Set image dimensions
      // 'background-size: ' + this.width + 'px ' + this.height + 'px;',

      // Set image URL
      'background: url(' + url + ');',
      'background-repeat: no-repeat;',
    ].join(' ')

    console.log('%c ', style)
  }
}
