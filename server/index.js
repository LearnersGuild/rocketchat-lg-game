/* global lastSlashCommandRoomId:true, commandsConfig */
/* exported lastSlashCommandRoomId */

lastSlashCommandRoomId = null
function invoke(command, commandParamStr, commandInfo) {
  console.log(`[LG SLASH COMMANDS] '/${command}' invoked with '${commandParamStr}'`)
  const commandConfig = commandsConfig[command]
  if (commandConfig.onInvoke) {
    commandConfig.onInvoke(command, commandParamStr, commandInfo)
  }
  lastSlashCommandRoomId = commandInfo.rid
}

/* eslint-disable prefer-arrow-callback */
Meteor.startup(function () {
  Object.keys(commandsConfig).forEach(command => {
    const commandConfig = commandsConfig[command]
    const {description, params} = commandConfig
    RocketChat.slashCommands.add(command, invoke, {description, params})
  })
})
