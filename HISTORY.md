# History

#### 0.9.1
- Update game-cli for bug fixes

#### 0.9.0
- Update game-cli to get /cycle init

#### 0.8.7
- Be more defensive when reading the Meteor user record and expecting LG attributes (fixes #36).

#### 0.8.5
- Fix bug in `getServiceBaseURL`

#### 0.8.4
- Only format command-line options with markdown backticks

#### 0.8.3
- Add utility function to get service base URLs
- Upgrade to `@learnersguild/game-cli@0.8.1` (ensure Promise is returned from all command invoke funcs)

#### 0.8.2
- Upgrade to `@learnersguild/game-cli@0.8.0` (`/cycle reflect` --> `/cycle retro`)

#### 0.8.1
- Upgrade to `@learnersguild/game-cli@0.7.3` (compatible with Node < 1.0)
- Ensure that any Meteor callbacks passed to non-Meteor code run in a fiber

#### 0.8.0
Added support for `/log -r` and `/log -rq NUM`

#### 0.7.1
- Use `LG_BOT_USERNAME` from rocketchat-lg-sso
- Use latest @learnersguild/game-cli

#### 0.7.0
Most implementation moved to `@learnersguild/game-cli` NPM module.

#### 0.6.0
Integrated `@learnersguild/game-cli` npm module for better CLI parsing.

#### 0.5.0
- Added `/cycle retro` command
- Added `/cycle help` command

#### 0.4.4
- better error message when API returns error
- use actual lg-bot user rather than a mock user for slash-command notifications
- ensure that the room where the last slash command was issued is per-user

#### 0.4.1
GraphQL mutation must select result to return

#### 0.4.0
Introduced the `/cycle launch` command

#### 0.3.5
Moving validation for votes to server
