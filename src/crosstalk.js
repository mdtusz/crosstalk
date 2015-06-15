require('./polyfills/broadcastchannel.js');
require('object.observe/dist/object-observe-lite.js');

window.CrossTalk = (object, channel, handler) => {
  'use strict';

  // Variadic check
  if (typeof object === 'string') {
    handler = channel;
    channel = object;
    object = {};
  }

  var self = {};
  handler = handler || function () {};

  // Helper because we'll do this often
  let updateWith = (object) => {
    for (let attr in object) {
      self[attr] = object[attr];
    }
  };

  // Initialize with passed in object
  updateWith(object);

  // Create new broadcast channel
  let bc = new BroadcastChannel(channel);

  // Set object properties so it can't change
  Object.defineProperties(self, {
    _broadcastChannel: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: bc
    }
  });

  // Add observers
  Object.observe(self, (change) => {
    self._broadcastChannel.postMessage({
      type: 'update',
      data: self
    });
  });

  // Sync objects with ping pong on creation
  self._broadcastChannel.postMessage({
    type: 'ping'
  });

  // Message handler
  self._broadcastChannel.onmessage = (message) => {
    switch (message.data.type) {
    case 'update':
      updateWith(message.data.data);
      handler(message.data.data);
      break;
    case 'ping':
      self._broadcastChannel.postMessage({
        type: 'update',
        data: self
      });
      break;
    default:
      break;
    }
  };

  return self;
};