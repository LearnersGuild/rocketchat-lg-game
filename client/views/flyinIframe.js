Template.flyin.helpers({
  iframeData: function() {
    const iframeURL = Session.get('flyinIframeURL')
    return {iframeURL}
  }
})

const closeOnWindowMessages = ['updateUser']

Template.flyinIframe.created = function() {
  window.addEventListener('message', e => {
    const message = e.data
    if (closeOnWindowMessages.indexOf(message) >= 0) {
      RocketChat.TabBar.closeFlex()
    }
  })
}
