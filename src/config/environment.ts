function httpURL(value: string, name: string): URL {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error(`${name} debe ser una URL HTTP(S) sin credenciales, query ni hash.`)
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/'
  return url
}

export const frontendURL = httpURL(process.env.BASE_URL ?? 'https://roaragonesc.github.io/duobalance/', 'BASE_URL').href

const backend = process.env.API_BASE_URL ? httpURL(process.env.API_BASE_URL, 'API_BASE_URL') : undefined

if (backend?.hostname.endsWith('.github.io')) {
  throw new Error('API_BASE_URL no puede apuntar a GitHub Pages: no aloja una API REST.')
}

export const apiURL = backend?.href
