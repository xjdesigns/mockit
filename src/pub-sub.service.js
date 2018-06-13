const pubsub = {
  events: {},

  subscribe: function(event, listener) {
    if(!this.events[event]) this.events[event] = [];

    this.events[event].push(listener)
  },

  publish: function(event, data) {
    if(!this.events[event] || this.events[event].length < 1) return;

    this.events[event].forEach(function(listener) {
      listener(data || {})
    });
  }
}

exports.pubsub = pubsub
