function invoke(command, commandParamStr, commandInfo) {
  console.log(`[LG SLASH COMMANDS] '/${command}' invoked with '${commandParamStr}'`)
  const commandConfig = commandsConfig[command]
  if (commandConfig.onInvoke) {
    commandConfig.onInvoke(command, commandParamStr, commandInfo)
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
	// 	template: 'flexPanelIframe',
	// 	order: 11
	// })
  Object.keys(commandsConfig).forEach(command => {
    const commandConfig = commandsConfig[command]
    const {description, params} = commandConfig
    RocketChat.slashCommands.add(command, invoke, {description, params})
  })
})
