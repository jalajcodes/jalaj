// Builds public/Jalaj-Gupta-Resume.pdf from src/data/resume.ts with headless Chrome.
// Built to be read by applicant tracking systems: one column, real text, standard headings, a standard font,
// no tables, icons or images. Run with `npm run resume:pdf` after editing the resume data, then commit the PDF.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { RESUME } from '../src/data/resume.ts'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = new URL('../public/Jalaj-Gupta-Resume.pdf', import.meta.url).pathname

// Contact details for the PDF only (the website shows the email as "name [at] domain").
const CONTACT = [
  'Bengaluru, India',
  '+91 7976030371',
  'jalaj799@gmail.com',
  'linkedin.com/in/jalajgupta',
  'github.com/jalajcodes',
  'jalaj.fyi',
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const list = (items) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Jalaj Gupta - Resume</title>
<style>
  @page { size: A4; margin: 14mm 15mm }
  * { box-sizing: border-box }
  body { font: 10pt/1.38 Arial, Helvetica, sans-serif; color: #000; margin: 0 }
  h1 { font-size: 20pt; margin: 0 0 2pt }
  .title { font-size: 11pt; margin: 0 0 3pt }
  .contact { margin: 0 0 6pt; font-size: 9.5pt }
  h2 { font-size: 10.5pt; letter-spacing: .06em; text-transform: uppercase; border-bottom: 1px solid #000; margin: 10pt 0 4pt; padding-bottom: 1pt }
  h3 { font-size: 10.5pt; margin: 6pt 0 0 }
  .meta { margin: 0 0 2pt }
  ul { margin: 2pt 0 0; padding-left: 15pt }
  li { margin: 0 0 1.5pt }
  p { margin: 0 0 3pt }
  .item { break-inside: avoid-page }
</style></head><body>
<h1>Jalaj Gupta</h1>
<p class="title">${esc(RESUME.title)}</p>
<p class="contact">${CONTACT.map(esc).join(' | ')}</p>

<h2>Summary</h2>
<p>${esc(RESUME.profile)} ${esc(RESUME.available)}</p>

<h2>Experience</h2>
${RESUME.experience
  .map(
    (x) => `<div class="item"><h3>${esc(x.role)}, ${esc(x.org)}</h3><p class="meta">${esc(x.when.replace(' to ', ' - '))}</p>${list(x.points)}</div>`,
  )
  .join('')}

<h2>Skills</h2>
${RESUME.skills.map((g) => `<p><strong>${esc(g.group)}:</strong> ${esc(g.items.join(', '))}</p>`).join('')}

<h2>Projects</h2>
${RESUME.projects
  .map((p) => `<div class="item"><h3>${esc(p.name)}</h3><p class="meta">${esc(p.stack)} | ${esc(p.href.replace('https://', ''))}</p>${list(p.points)}</div>`)
  .join('')}

<h2>Education</h2>
${RESUME.education.map((e) => `<p><strong>${esc(e.name)}</strong>, ${esc(e.where)}${e.when ? `, ${esc(e.when.replace(' to ', ' - '))}` : ''}</p>`).join('')}
</body></html>`

const dir = mkdtempSync(join(tmpdir(), 'resume-'))
const file = join(dir, 'resume.html')
writeFileSync(file, html)
execFileSync(CHROME, ['--headless=new', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${OUT}`, `file://${file}`], {
  stdio: 'ignore',
})
console.log('wrote', OUT)
