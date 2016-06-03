/* global commandFuncs, window, openFlexPanel */

commandFuncs.vote = args => {
  console.log({args})
  if (!args.help && (args._.length === 0 || args._.length >= 2)) {
    const gameURL = window.location.href.match(/chat.learnersguild.org/) ? 'https://game.learnersguild.org' : 'http://game.learnersguild.dev'
    const flexPanelURL = `${gameURL}/cycle-voting-results#${Date.now()}`
    openFlexPanel(flexPanelURL)
  }
}
