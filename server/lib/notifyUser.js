const socketCluster = Npm.require('socketcluster-client')
const Future = Npm.require('fibers/future')

notifyUser = (roomId, message) => {
  RocketChat.Notifications.notifyUser(Meteor.userId(), 'lg-slash-command-response', {
    _id: Random.id(),
    rid: roomId,
    ts: new Date(),
    msg: message,
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
  subscribeToLGUserNotifications: function() {
    if (Meteor.userId()) {
      if (!socket) {
        scConnect()
      }
      const {lgPlayer} = Meteor.user().services.lgSSO
      socket.unsubscribe(`notifyUser-${lgPlayer.id}`)
      const playerNotificationsChannel = socket.subscribe(`notifyUser-${lgPlayer.id}`)
      playerNotificationsChannel.watch(Meteor.bindEnvironment(playerNotification => {
        if (lastSlashCommandRoomId) {
          notifyUser(lastSlashCommandRoomId, playerNotification)
        } else {
          console.error('[LG SLASH COMMANDS] received player notification, but do not know to which room to send it')
        }
      }))
    }
  },

  unsubscribeFromLGUserNotifications: function() {
    if (Meteor.userId()) {
      if (!socket) {
        return
      }
      const {lgPlayer} = Meteor.user().services.lgSSO
      socket.unsubscribe(`notifyUser-${lgPlayer.id}`)
    }
  }
})

Meteor.startup(function() {
  scConnect()
})
