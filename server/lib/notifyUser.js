/* global notifyUser:true, lastSlashCommandRoomId */
/* exported notifyUser */

const socketCluster = Npm.require('socketcluster-client')

const BOT_USERNAME = 'lg-bot'
notifyUser = (roomId, message) => {
  const {_id, username, name} = Meteor.users.findOne({username: BOT_USERNAME})
  RocketChat.Notifications.notifyUser(Meteor.userId(), 'lg-slash-command-response', {
    _id: Random.id(),
    rid: roomId,
    ts: new Date(),
    msg: message,
    u: {_id, username, name},
    private: true,
  })
}

let socket
function scConnect() {
  const scHostname = process.env.NODE_ENV === 'development' ? 'game.learnersguild.dev' : 'game.learnersguild.org'
  socket = socketCluster.connect({hostname: scHostname})
  socket.on('connect', () => console.log('... socket connected'))
  socket.on('disconnect', () => console.log('socket disconnected, will try to reconnect socket ...'))
  socket.on('connectAbort', () => null)
  socket.on('error', error => console.warn(error.message))
}

Meteor.methods({
  subscribeToLGUserNotifications() {
    if (Meteor.userId()) {
      if (!socket) {
        scConnect()
      }
      const {lgPlayer} = Meteor.user().services.lgSSO
      const channelName = `notifyUser-${lgPlayer.id}`
      if (!socket.isSubscribed(channelName, true)) {
        const playerNotificationsChannel = socket.subscribe(channelName)
        playerNotificationsChannel.watch(Meteor.bindEnvironment(playerNotification => {
          if (lastSlashCommandRoomId) {
            notifyUser(lastSlashCommandRoomId, playerNotification)
          } else {
            const msg = '[LG SLASH COMMANDS] received player notification, but do not know to which room to send it'
            console.error(msg)
            RavenLogger.log(msg)
          }
        }))
      }
    }
  },

  unsubscribeFromLGUserNotifications() {
    if (Meteor.userId()) {
      if (!socket) {
        return
      }
      const {lgPlayer} = Meteor.user().services.lgSSO
      const channelName = `notifyUser-${lgPlayer.id}`
      socket.unsubscribe(channelName)
    }
  }
})

/* eslint-disable prefer-arrow-callback */
Meteor.startup(function () {
  scConnect()
})
