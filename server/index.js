function invoke(command, commandParamStr) {
  console.log(`'/${command}' invoked with '${commandParamStr}'`)
  const commandConfig = commandsConfig[command]
  if (commandConfig.onInvoke) {
    commandConfig.onInvoke(command, commandParamStr)
  }
}

Meteor.startup(function() {
  Object.keys(commandsConfig).forEach(command => {
    const commandConfig = commandsConfig[command]
    RocketChat.slashCommands.add(command, invoke, {
  		description: commandConfig.description,
  	})
  })
})
