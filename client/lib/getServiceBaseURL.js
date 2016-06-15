/* global window, IDM:true, GAME:true, getServiceBaseURL:true  */
/* exported IDM, GAME, getServiceBaseURL */

IDM = 'idm'
GAME = 'game'

const SERVICES = [IDM, GAME]

getServiceBaseURL = serviceName => {
  if (SERVICES.indexOf(serviceName) < 0) {
    throw new Error(`Invalid service name: ${serviceName}`)
  }
  switch (window.location.href) {
    case /\.dev/:
      return `http://${serviceName}.learnersguild.dev`
    default:
      return `https://${serviceName}.learnersguild.org`
  }
}
