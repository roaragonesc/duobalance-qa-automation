export function appRoute(path: string): string {
  return process.env.DUOBALANCE_LOCAL_MODE === 'api-e2e' ? path : `./#${path}`
}

export function applicationPath(url: URL): string {
  return url.hash.startsWith('#/') ? url.hash.slice(1).split('?')[0] : url.pathname
}
