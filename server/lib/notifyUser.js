notifyUser = (roomId, message) => {
  RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
    _id: Random.id(),
    rid: roomId,
    ts: new Date(),
    msg: message,
  })
}
