function httpURL(value: string, name: string): URL {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error(`${name} debe ser una URL HTTP(S) sin credenciales, query ni hash.`)
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/'
  return url
}

export const frontendURL = httpURL(process.env.BASE_URL ?? 'https://roaragonesc.github.io/duobalance/', 'BASE_URL').href
