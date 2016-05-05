Package.describe({
  name: 'learnersguild:rocketchat-lg-slash-commands',
  version: '0.2.2',
  summary: 'Custom /slash commands for Rocket.Chat within Learners Guild.',
  git: 'https://github.com/LearnersGuild/rocketchat-lg-slash-commands'
})

Package.onUse(function(api) {
  api.versionsFrom('1.2.1')

  api.use([
    'ecmascript',
    'learnersguild:rocketchat-lg-sso@0.4.0',
  ])
  api.use([
    'rocketchat:lib@0.0.1'
  ], { weak: true, unordered: false })
  api.use([
    'templating'
  ], 'client')
  // api.use([
  // ], 'server')

  api.addFiles([
    'lib/commandsConfig.js',
    'lib/graphQLFetcher.js',
  ])
  api.addFiles([
    'client/commands/profile.js',
    'client/commands/vote.js',
    'client/lib/toggleFlexPanel.js',
    'client/index.js',
    'client/views/flexPanelIframe.html',
    'client/views/flexPanelIframe.js',
  ], 'client')
  api.addFiles([
    'server/commands/vote.js',
    'server/lib/notifyUser.js',
    'server/index.js',
  ], 'server')
})
