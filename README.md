# push-notify
[![Build Status](https://travis-ci.org/neoziro/push-notify.svg?branch=master)](https://travis-ci.org/neoziro/push-notify)
[![Dependency Status](https://david-dm.org/neoziro/push-notify.svg?theme=shields.io)](https://david-dm.org/neoziro/push-notify)
[![devDependency Status](https://david-dm.org/neoziro/push-notify/dev-status.svg?theme=shields.io)](https://david-dm.org/neoziro/push-notify#info=devDependencies)

Easily send notifications over several protocols.

## Install

```
npm install push-notify
```

## Usage

### Apple Push Notification (APN)

#### Example

```js
// Create a new APN sender.
var apn = notify.apn({
  key: 'myKey.pem',
  cert: 'myCert.pem'
});

// Send a notification.
apn.send({
  token: 'DEVICE_TOKEN',
  alert: 'Hello world!'
});
```

#### Notification

```
  {string|string[]} token Device token
  ...
```

Additional fields can be found in [node-apn documentation](https://github.com/argon/node-apn/blob/master/doc/apn.markdown#class-apnnotification).

#### Closing connection

APN use a socket and keep it connected, so if we want to gracefully stop a process, you will need to close this connection. A close method is avalaible on the APN sender.

```js
apn.close(function () {
  // the connection is closed
});
```

#### Events

##### transmitted

Emmited when a notification was correctly transmitted to Apple servers. You can find more details in [node-apn documentation](https://github.com/argon/node-apn/blob/master/doc/apn.markdown#event-transmitted).

```js
apn.on('transmitted', function (notification, device) {});
```

##### transmissionError

Emmited when a error occurs during notfication transmission. You can find more details in [node-apn documentation](https://github.com/argon/node-apn/blob/master/doc/apn.markdown#event-transmissionerror).

```js
apn.on('transmissionError', function (errorCode, notification, device) {});
```

##### error

Called when an error occurs during the connection to Apple servers. You can find more details in [node-apn documentation](https://github.com/argon/node-apn/blob/master/doc/apn.markdown#event-error).

```js
apn.on('error', function (error) {});
```

### Google Cloud Messaging (GCM)

#### Example

```js
// Create a new GCM sender.
var gcm = require('push-notify').gcm({
  apiKey: 'GOOGLE_SERVER_API_KEY',
  retries: 1
});

// Send a notification.
gcm.send({
  registrationId: 'REGISTRATION_ID',
  collapseKey: 'COLLAPSE_KEY',
  delayWhileIdle: true,
  timeToLive: 3,
  data: {
    key1: 'message1',
    key2: 'message2'
  }
});
```

#### Notification

```
  {string|string[]} registrationId Device registration id
  {string} collapseKey Collapse key
  {boolean} delayWhileIdle If included, indicates that the message should not be sent immediately if the device is idle. The server will wait for the device to become active, and then only the last message for each collapse_key value will be sent. Optional. The default value is false, and must be a JSON boolean.
  {number} timeToLive How long (in seconds) the message should be kept on GCM 
  {object} data Custom data
```

#### Events

##### transmitted

Emmited when a notification was correctly transmitted to Google servers.

```js
gcm.on('transmitted', function (result, message, registrationId) {});
```

##### transmissionError

Emmited when a error occurs during the transmission of the message.

```js
gcm.on('transmissionError', function (error, message, registrationId) {});
```

##### updated

Emmited when a registration id must be updated in the database.

```js
gcm.on('updated', function (result, registrationId) {});
```

### Android Cloud to Device Messaging (C2DM)

#### Example

```js
// Create a new C2DM sender.
var c2dm = require('push-notify').c2dm({
  user: 'user@gmail.com',
  password: 'password',
  domain: 'com.myapp'
});

// Send notification.
c2dm.send({
  registration_id: 'REGISTRATION_ID',
  collapse_key: 'COLLAPSE_KEY',
  'data.titre': 'Hello world!',
  'data.text': 'Is that true?'
});
```

#### Notification

```
  {string|string[]]} registration_id Device registration id
  {string} collapse_key Collapse key
  {string} data.* Custom data field
```

#### Events

##### transmitted

Emmited when a notification was correctly transmitted to Google servers.

```js
c2dm.on('transmitted', function (messageId, payload, registrationId) {});
```

##### transmissionError

Emmited when a error occurs during notfication transmission.

```js
c2dm.on('transmissionError', function (error, payload, registrationId) {});
```

##### error

Called when an error occurs during the login.

```js
c2dm.on('error', function (error) {});
```

### Windows Push Notification Service (WNS)

#### Example

```js
// Create a new WNS sender.
var wns = require('push-notify').wns({
  client_id: 'your Package Security Identifier',
  client_secret: 'your Client secret'
});

// Send notification.
wns.send({
  channelURI: 'URI to your application notification channel',
  payload: 'XML containing the notification data',
  type: 'notification type'
});
```

#### Notification

```
  {string} channelURI URI for the device to send the notification to
  {string} payload the XML string containing the notif data
  {string} type notif type. One of: toast, badge, tile, raw
  {object} options an optional options object passed to wns lib (see wns lib)
```

#### Events

##### transmitted

Emmited when a notification was correctly transmitted to Microsoft servers.

```js
wns.on('transmitted', function (result) {});
```

##### transmissionError

Emmited when a error occurs during the transmission of the message.

```js
wns.on('transmissionError', function (error) {});
```

### Microsoft Push Notification Service (MPNS)

#### Example

```js
// Create a new MPNS sender.
var mpns = require('push-notify').mpns();

// Send notification.
mpns.send({
  pushUri: 'DEVICE_PUSH_URI',
  text1: 'Hello world!',
  text2: 'Is that true?'
});
```

#### Notification

```
  {string|string[]} pushUri Device push uri
  {string} text1 Text of the toast (bold)
  {string} text2 Text of the toast (normal)
  {string} param Optional uri parameters
```

#### Events

##### transmitted

Emmited when a notification was correctly transmitted to Microsoft servers.

```js
mpns.on('transmitted', function (result, payload, pushUri) {});
```

##### transmissionError

Emmited when a error occurs during the transmission of the message.

```js
mpns.on('transmissionError', function (error, payload, pushUri) {});
```

## Used modules

* apn: [node-apn](https://github.com/argon/node-apn)
* gcm: [node-gcm](https://github.com/ToothlessGear/node-gcm)
* c2dm: [node-c2dm](https://github.com/SpeCT/node-c2dm)
* mpns: [node-mpns](https://github.com/jeffwilcox/mpns)
* wns: [wns](https://github.com/tjanczuk/wns)

## License

MIT
