require('./polyfills/broadcastchannel.js');
require('object.observe/dist/object-observe-lite.js');

var CrossTalk = function (object, channel, handler) {
  'use strict';

  if (object === undefined || object === '') {
    let err = new Error('channel required (at minimum)');
    console.error(err);
    return;
  }

  // Variadic check
  if (typeof object === 'string') {
    handler = channel;
    channel = object;
    object = {};
  }

  var self = this;

  // Helper because we'll do this often
  let updateWith = (object) => {
    for (let attr in object) {
      self._data[attr] = object[attr];
    }
  };

  // Create new broadcast channel
  let bc = new BroadcastChannel(channel);

  // Set object properties so it can't change
  Object.defineProperties(self, {
    _broadcastChannel: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: bc
    },
    _handler: {
      writable: true,
      enumerable: false,
      configurable: false,
      value: handler || function () {}
    },
    _locked: {
      writable: true,
      enumerable: false,
      configurable: false,
      value: false
    },
    _data: {
      writable: true,
      enumerable: false,
      configurable: false,
      value: object
    }
  });

  // Add observers
  Object.observe(self._data, (change) => {
    if (!self._locked) {
      // Sync/update
      self._broadcastChannel.postMessage({
        type: 'update',
        data: self._data
      });
    } else {
      // Unlock after sync/update
      self._locked = false;
    }
  });

  // Message handler
  self._broadcastChannel.onmessage = (message) => {
    switch (message.data.type) {
    case 'requestSync':
      self._broadcastChannel.postMessage({
        type: 'update',
        data: self
      });
      break;
    case 'update':
      // Lock data observer and unlock once change has been made
      self._locked = true;
      updateWith(message.data);
      self._handler(message.data);
      break;
    default:
      break;
    }
  };

  // Sync with other window(s).
  self.sync();

  return self;
};

CrossTalk.prototype.set = function (attr, value) {
  this._data.attr = value;
  return this._data.attr;
};

CrossTalk.prototype.get = function (attr) {
  return this._data.attr;
};

CrossTalk.prototype.getChannel = function () {
  return this._broadcastChannel._name;
};

CrossTalk.prototype.sync = function () {
  this._broadcastChannel.postMessage({
    type: 'requestSync'
  });
};

window.CrossTalk = CrossTalk;