/* global commandFuncs, window, openFlexPanel */

commandFuncs.vote = (/* command, commandParamStr */) => {
  const gameURL = window.location.href.match(/chat.learnersguild.org/) ? 'https://game.learnersguild.org' : 'http://game.learnersguild.dev'
  const flexPanelURL = `${gameURL}/cycle-voting-results#${Date.now()}`
  openFlexPanel(flexPanelURL)
}
