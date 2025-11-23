import fs from 'fs'
import path from 'path'
import { isText } from '../fns/is-text'

export const commandBuild = async () => {
  const projectDir = process.cwd()
  const repoDir = path.join(projectDir, `repo.json`)
  const publicRepoDir = path.join(projectDir, `public/r/repo.json`)

  if (fs.existsSync(repoDir)) {
    try {
      fs.mkdirSync(path.dirname(publicRepoDir), { recursive: true })

      const repoString = fs.readFileSync(repoDir, `utf-8`)
      const repo = JSON.parse(repoString)

      if (Array.isArray(repo.items)) {
        repo.items = repo.items.map((item: any) => {
          if (Array.isArray(item.files)) {
            item.files = item.files.map((file: any) => {
              if (fs.existsSync(file.source)) {
                const buffer = fs.readFileSync(file.source)
                if (isText(buffer)) {
                  file.content = buffer.toString(`utf-8`)
                }
              } else {
                console.log(`file source not exists`, file.source)
              }
              return file
            })
          }
          const itemDir = path.join(
            path.dirname(publicRepoDir),
            item.scope || ``,
            `${item.name}.json`
          )

          fs.mkdirSync(path.dirname(itemDir), { recursive: true })

          fs.writeFileSync(itemDir, JSON.stringify(item, null, 2))
          return item
        })
      }

      if (Array.isArray(repo.items)) {
      }

      fs.writeFileSync(publicRepoDir, JSON.stringify(repo, null, 2))
    } catch (error) {
      console.log(`repo.json is not a valid json file`, error)
    }
  }
}
