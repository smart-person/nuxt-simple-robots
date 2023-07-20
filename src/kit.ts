import { addTemplate, createResolver, useNuxt } from '@nuxt/kit'
import { relative } from 'pathe'

export function extendTypes(module: string, template: (options: { typesPath: string }) => string | Promise<string>) {
  const nuxt = useNuxt()
  const { resolve } = createResolver(import.meta.url)
  // paths.d.ts
  addTemplate({
    filename: `module/${module}.d.ts`,
    getContents: async () => {
      const typesPath = relative(resolve(nuxt!.options.rootDir, nuxt!.options.buildDir, 'module'), resolve('runtime/types'))
      const s = await template({ typesPath })
      return `// Generated by ${module}
${s}
export {}
`
    },
  })

  nuxt.hooks.hook('prepare:types', ({ references }) => {
    references.push({ path: resolve(nuxt.options.buildDir, `module/${module}.d.ts`) })
  })
}
