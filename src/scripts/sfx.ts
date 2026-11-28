// Opt-in site sounds: a soft tick on links and buttons, a chime on the theme switch. Off until someone turns it on in
// the footer, and the choice is remembered. Everything is synthesised with the Web Audio API (no audio files).
const KEY = 'jj-sfx'
const btn = document.getElementById('sfx-toggle')
let on = false
try {
  on = localStorage.getItem(KEY) === '1'
} catch {}

let ctx: AudioContext | null = null
const tone = (freq: number, ms: number, vol = 0.05, type: OscillatorType = 'sine', delay = 0) => {
  if (!on) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const t = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + ms / 1000 + 0.02)
  } catch {}
}

const paint = () => {
  if (!btn) return
  btn.textContent = on ? 'Sounds: on' : 'Sounds: off'
  btn.setAttribute('aria-pressed', String(on))
}
paint()
btn?.addEventListener('click', () => {
  on = !on
  try {
    localStorage.setItem(KEY, on ? '1' : '0')
  } catch {}
  paint()
  tone(660, 120, 0.06)
  tone(880, 160, 0.06, 'sine', 0.09)
})

// A light tick when the pointer reaches a link (mouse only) and a firmer one when it is pressed.
if (matchMedia('(pointer: fine)').matches) {
  let last: Element | null = null
  document.addEventListener('pointerover', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href],button')
    if (a && a !== last && a !== btn) tone(1200, 35, 0.015, 'triangle')
    last = a ?? null
  })
}
document.addEventListener('click', (e) => {
  const el = e.target as HTMLElement
  if (el.closest?.('#theme-toggle')) {
    tone(523, 140, 0.05, 'sine')
    tone(784, 220, 0.05, 'sine', 0.08)
  } else if (el.closest?.('a[href]') && !el.closest('#sfx-toggle')) {
    tone(440, 60, 0.04, 'triangle')
  }
})
