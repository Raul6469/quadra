# quadra

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FRaul6469%2Fquadra%2Fbadge&style=flat)](https://actions-badge.atrox.dev/Raul6469/quadra/goto)

**Quadra is a JavaScript tool that lets you define and enforce architecture rules in your project.**

You define "boxes" that represent units of code, and the dependencies between them in a YAML config file. Quadra will scan files and look at `imports` and `require`, and make sure that they follow your rules.

It supports JavaScript, TypeScript and Vue SFC files :sparkles:

> This is a work in progress project, so expect some breaking changes to come. It is recommendend to specify a fixed version of quadra in your dependencies to avoid them.

## Installation

```bash
npm install --save-dev quadra
```

## Use
Create a `.quadra.yml` file at the root of your project, and define your "boxes" and their inter dependencies :

```yml
boxes:
  # Each key defines a box
  client:
    # 'files' is an array of file
    # globs that define your box
    files:
      - 'src/client/**/*.js'

    rules:
      # Define dependency rules
      boxes:
        # Files in the `client` box
        # can only import files from
        # these boxes, defined in this
        # config file
        only:
          - server
          - client # To allow imports within the 'client' box

  server:
    files:
      - 'src/server/**/*.js'
    rules:
      modules:
        # Specify a list of npm modules
        # banned in a box
        ban:
          - lodash
      boxes:
        only:
          - server
```
Check out the complete config file reference [in the docs](./docs/README.md).

> Please note that files that are not part of any box are always allowed dependencies.

Add quadra in your npm scripts in your `package.json` file:

```json
"scripts": {
  "quadra": "quadra",
},
```

And run checks with:
```bash
npm run quadra
```

## Contribute

All contributions are welcome! Open issues to provide feedback, ask questions or discuss new features, or open pull requests to propose new ones!
