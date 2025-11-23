declare global {
  namespace Reany {
    interface Config {
      repos: Record<string, string>
    }

    interface File {
      source: string
      target: string
      content?: string
    }

    interface Repo {
      name: string
      scope?: string
      title?: string
      description?: string
      items: Repo[]
      files: File[]
      repoDependencies?: string[]
    }
  }
}

export {}
