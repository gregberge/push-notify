# push-notify

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
  {number} expiry Timestamp for date expiration
  {number} badge Badge count
  {string} sound Sound
  {string} alert Text alert
  {object} payload Custom payload
```

### Google Cloud Messaging (GCM)

#### Example

```js
// Create a new GCM sender.
var gcm = require('push-notify').gcm({
  key: 'GOOGLE_SERVER_API_KEY',
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

## Multi notification support

You can send a notification to several devices, each identifier supports a simple string or an array of string.

## Events

### Common events

Push-notify provides an unified interface for events. There is three events that are common to all protocols: 

#### transmitted

Emmited when a notification was correctly transmitted to the remote service.

#### updated

Emmited when an id has changed needs to be updated in your database.

#### transmissionError

Emmited when an id is incorrect and must be removed from database.

#### error

Called when an error occur during the sending. Notification must be sent again. 

### Examples

#### APN

```js
apn.on('transmitted', function (notification, device) {});
apn.on('transmissionError', function (errorCode, notification, device) {});
apn.on('error', function (err) {});
```

#### GCM

```js
gcm.on('transmitted', function (result, registrationId) {});
gcm.on('updated', function (result, registrationId) {});
gcm.on('transmissionError', function (error, registrationId) {});
gcm.on('error', function (err) {});
```

#### C2DM

```js
c2dm.on('transmitted', function (messageId, payload) {});
c2dm.on('transmissionError', function (error, payload) {});
c2dm.on('error', function (err) {});
```

#### MPNS

```js
mpns.on('transmitted', function (result, pushUri) {});
mpns.on('transmissionError', function (error, pushUri) {});
mpns.on('error', function (err) {});
```

## Modules

* apn: [node-apn](https://github.com/argon/node-apn)
* gcm: [node-gcm](https://github.com/ToothlessGear/node-gcm)
* c2dm: [node-c2dm](https://github.com/SpeCT/node-c2dm)
* mpns: [node-mpns](https://github.com/jeffwilcox/mpns)

## License

MIT
