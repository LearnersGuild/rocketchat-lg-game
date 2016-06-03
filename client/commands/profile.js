/* global commandFuncs, window, toggleFlexPanel */

commandFuncs.profile = args => {
  if (!args.help && args._.length === 0) {
    const idmURL = window.location.href.match(/chat.learnersguild.org/) ? 'https://idm.learnersguild.org' : 'http://idm.learnersguild.dev'
    const flexPanelURL = `${idmURL}/profile#${Date.now()}`
    toggleFlexPanel(flexPanelURL)
  }
}
