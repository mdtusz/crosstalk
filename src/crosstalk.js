require('./polyfills/broadcastchannel.js');

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
    _data: {
      writable: true,
      enumerable: false,
      configurable: false,
      value: object
    },
    _instance: {
      writable: true,
      enumerable: false,
      configurable: false,
      value: 0
    }
  });

  // Message handler
  self._broadcastChannel.onmessage = (message) => {
    switch (message.data.type) {
    case 'requestSync':
      self._broadcastChannel.postMessage({
        type: 'pushSync',
        data: self._data
      });
      break;
    case 'pushSync':
      self._data = message.data.data;
      self._handler(self._data);
      break;
    case 'requestInit':
      self._broadcastChannel.postMessage({
        type: 'pushInit',
        data: {
          data: self._data,
          instance: self._instance + 1
        }
      });
      break;
    case 'pushInit':
      self._instance = Math.max(self._instance, message.data.data.instance);
      self._data = message.data.data.data;
      self._handler(self._data);
      break;
    default:
      break;
    }
  };

  // Sync with other window(s).
  self._broadcastChannel.postMessage({
    type: 'requestInit'
  });

  return self;
};

CrossTalk.prototype.set = function (attr, value) {
  if (typeof attr === 'string') {
    this._data[attr] = value;
    this.sync(this._data);
    this._handler(this.data);
    return this._data[attr];
  } else if (typeof attr === 'object') {
    this._data = attr;
    this.sync(this._data);
    this._handler(this.data);
    return this._data;
  }
};

CrossTalk.prototype.get = function (attr) {
  if (typeof attr === 'string') {
    return this._data[attr];
  } else {
    return this._data;
  }
};

CrossTalk.prototype.sync = function (data) {
  if (data === undefined) {
    this._broadcastChannel.postMessage({
      type: 'requestSync'
    });
  } else {
    this._broadcastChannel.postMessage({
      type: 'pushSync',
      data: this._data
    });
  }
};

CrossTalk.prototype.getInstance = function () {
  return this._instance;
};

CrossTalk.prototype.getChannel = function () {
  return this._broadcastChannel._name;
};

window.CrossTalk = CrossTalk;