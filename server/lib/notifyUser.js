notifyUser = (roomId, message) => {
  RocketChat.Notifications.notifyUser(Meteor.userId(), 'lg-slash-command-response', {
    _id: Random.id(),
    rid: roomId,
    ts: new Date(),
    msg: message,
  })
}
