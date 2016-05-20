/* global lastSlashCommandRoomIds:true, commandsConfig */
/* exported lastSlashCommandRoomIds */

lastSlashCommandRoomIds = {}
function invoke(command, commandParamStr, commandInfo) {
  console.log(`[LG SLASH COMMANDS] '/${command}' invoked with '${commandParamStr}'`)
  const commandConfig = commandsConfig[command]
  if (commandConfig.onInvoke) {
    commandConfig.onInvoke(command, commandParamStr, commandInfo)
  }
  lastSlashCommandRoomIds[Meteor.userId()] = commandInfo.rid
}

/* eslint-disable prefer-arrow-callback */
Meteor.startup(function () {
  Object.keys(commandsConfig).forEach(command => {
    const commandConfig = commandsConfig[command]
    const {description, params} = commandConfig
    RocketChat.slashCommands.add(command, invoke, {description, params})
  })
})
