# Reany

Re(use)any component in any project

reany is a command line tool for reusing components across projects. It allows you to easily fetch components from remote repositories and add them to your current project without manually copying and pasting code.

## Installation

```bash
npm install -g reany
```

## Quick Start

### 1. Initialize Configuration

Run the following command in your project root directory:

```bash
$ reany init
```

This will create a `reany.json` configuration file in your project root directory for managing component repositories.

### 2. Add Components

Use the following commands to add components:

```bash
# Add from full URL
reany add https://reany.tailwinds.dev/repos/component-name.json

# Add from scoped package (requires configuration)
reany add @tailwinds/button
```

### 3. Build Component Repository

If you are the maintainer of a component repository, you can use the following command to build the repository:

```bash
$ reany build
```

This will process the `repo.json` file and generate component files for distribution.

## Command Reference

### init

Initialize a new reany configuration file.

```bash
$ reany init
```

- Checks if `reany.json` already exists
- If not, creates a configuration file with an empty `repos` object

### add <components...>

Add one or more components to the project.

```bash
reany add [component1] [component2] ...
```

Components can be:

1. Full URL: pointing to a Reany repository JSON file
2. Scoped package: like `@scope/name`, resolved via the configuration file

### build

Build components for reany repositories.

```bash
reany build
```

- Reads the `repo.json` file in the project root
- Processes the items and reads file contents
- Generates component files for distribution into the `public/r` directory

## Configuration File

Example `reany.json` configuration file:

```json
{
  "repos": {
    "@tailwinds": "https://reany.tailwinds.dev/repos/{name}.json"
  }
}
```

- `repos`: Used to configure repository template URLs for scoped packages
- `{name}` in the template URL will be replaced with the actual component name

## Component Repository Structure

Example JSON structure for a component repository:

```json
{
  "name": "reany",
  "title": "Reany",
  "description": "A Reany Dev Kit.",
  "items": [
    {
      "name": "form",
      "scope": "tailwinds",
      "repoDependencies": [
        "https://reany.tailwinds.dev/repos/button.json",
        "https://reany.tailwinds.dev/repos/input.json"
      ],
      "files": [
        {
          "source": "src/Form.tsx",
          "target": "components/Form.tsx",
          "content": "// Form component code"
        }
      ]
    }
  ]
}
```

- `items`: List of components, each containing name, scope, and file list
- `files`: List of files added directly to the project
- `repoDependencies`: Other component repositories that are dependencies

## License

MIT
