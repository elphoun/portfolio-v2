export const baseUrl = 'https://michaelzhang.dev'

export default async function sitemap() {
  let routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes]
}
