/* global commandsConfig, window, openFlexPanel */

commandsConfig.vote.onInvoke = (/* command, commandParamStr */) => {
  const gameURL = window.location.href.match(/chat.learnersguild.org/) ? 'https://game.learnersguild.org' : 'http://game.learnersguild.dev'
  const flexPanelURL = `${gameURL}/cycle-voting-results#${Date.now()}`
  openFlexPanel(flexPanelURL)
}
