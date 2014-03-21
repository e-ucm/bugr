bugr
====

NodeJS Bug tracker system for the eAdventure platform


## API
- `POST /api/bug` receives a bug report. The post body must contain a json describing the bug report. If the report is processed, returns `204`.
- `POST /api/activate` activates a new user in the editor. Returns a `200` with a string representing user GUID

