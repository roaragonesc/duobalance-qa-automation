export function appRoute(path: string): string {
  return `./#${path}`
}

export function applicationPath(url: URL): string {
  return url.hash.startsWith('#/') ? url.hash.slice(1).split('?')[0] : url.pathname
}
