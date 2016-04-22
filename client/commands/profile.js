commandsConfig.profile.onInvoke = (command, commandParamStr) => {
  const idmURL = window.location.href.match(/chat.learnersguild.org/) ? 'https://idm.learnersguild.org' : 'http://idm.learnersguild.dev'
  const flexPanelURL = `${idmURL}/profile#${Date.now()}`
  toggleFlexPanel(flexPanelURL)
}
