Template.flexPanel.helpers({
  iframeData: function() {
    const iframeURL = Session.get('flexPanelIframeURL')
    return {iframeURL}
  }
})

const closeOnWindowMessages = ['updateUser']

Template.flexPanelIframe.created = function() {
  window.addEventListener('message', e => {
    const message = e.data
    if (closeOnWindowMessages.indexOf(message) >= 0) {
      RocketChat.TabBar.closeFlex()
    }
  })
}
