toggleFlexPanel = (url) => {
	let tmpl = RocketChat.TabBar.getTemplate()
	if (tmpl !== 'flexPanel') {
    RocketChat.TabBar.setTemplate('flexPanel')
  }
	if (RocketChat.TabBar.isFlexOpen()) {
		RocketChat.TabBar.closeFlex()
	} else {
    Session.set('flexPanelIframeURL', url)
		RocketChat.TabBar.openFlex()
	}
}
