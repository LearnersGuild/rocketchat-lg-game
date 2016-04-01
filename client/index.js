const commands = {
  profile: {
    description: 'Edit your user profile',
    getURL: () => {
      const idmURL = window.location.href.match(/chat.learnersguild.org/) ? 'https://idm.learnersguild.org' : 'http://localhost:8081'
      return `${idmURL}/profile#${Date.now()}`
    }
  }
}

function flyin(command, arg1, item) {
  const commandDesc = commands[command]
  if (commandDesc) {
		let tmpl = RocketChat.TabBar.getTemplate()
		if (tmpl !== 'flyin') {
      RocketChat.TabBar.setTemplate('flyin')
    }
		if (RocketChat.TabBar.isFlexOpen()) {
			RocketChat.TabBar.closeFlex()
		} else {
      Session.set('flyinIframeURL', commandDesc.getURL())
			RocketChat.TabBar.openFlex()
		}
  }
}

Meteor.startup(function() {
  // HOWTO add tab bar buttons on RHS
  //
	// RocketChat.TabBar.addButton({
	// 	groups: ['channel', 'privategroup', 'directmessage'],
	// 	id: 'fly-in',
	// 	title: 'Fly-in',
	// 	icon: 'icon-rocket',
	// 	template: 'flyinIframe',
	// 	order: 11
	// })

  Object.keys(commands).forEach(command => {
    RocketChat.slashCommands.add(command, flyin, {
  		description: commands[command].description,
  	})
  })
})
