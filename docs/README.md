# Documentation

## `.quadra.yml` config file reference
```yml
boxes:
  # Each key defines a box
  client:
    # Define failed checks severity
    # for this box. It applies to all
    # rules for this box
    severity: warning # 'warning' or 'error' (default)

    # 'files' is an array of file
    # globs that define your box
    files:
      - 'src/client/**/*.js'
      - '!src/client/index.js' # You can exclude files by starting pattern with a '!'

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
