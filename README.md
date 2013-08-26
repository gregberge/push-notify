# push-notify

Easily send notifications over several protocols.

## Install

```
npm install push-notify
```

## How to use

### apn

```javascript
var apn = new notify.apn.Sender({
  key: 'my_key.pem',
  cert: 'my_cert.pem'
});

apn.send({
  token: 'my_device_token',
  alert: 'Hello world!'
});
```

### gcm

```javascript
var gcm = new notify.gcm.Sender({
  key: 'insert Google Server API Key here',
  retries: 1
});

gcm.send({
  registrationId: 'my_device_registration_id',
  collapseKey: 'my_collapse_key',
  delayWhileIdle: true,
  timeToLive: 3,
  data: {
      key1: 'message1',
      key2: 'message2'
  }
});
```

### c2dm

```javascript
var c2dm = new notify.c2dm.Sender({
  user: 'my_user@gmail.com',
  password: 'my_password',
  domain: 'com.myapp'
});

c2dm.send({
  registration_id: 'my_device_registration_id',
  collapse_key: 'my_collapse_key',
  'data.titre': 'Hello world!',
  'data.text': 'Is that true?'
})

```

### mpns

```javascript
var mpns = new notify.mpns.Sender();

mpns.send({
  pushUri: 'my_device_push_uri',
  text1: 'Hello world!',
  text2: 'Is that true?'
});
```

## Data format

### apn

```
{
  token: 'xxx', // Device token
  expiry: 1370612529, // Timestamp for date expiration
  badge: 3, // Badge count
  sound: 'ping.aiff', // Sound
  alert: 'Hello world!', // Text alert
  payload: {} // Custom payload
}
```

### gcm

```
{
  registrationId: 'xxx', // Device registration id
  collapseKey: 'xxx', // Collapse key
  delayWhileIdle: true, // If included, indicates that the message should not be sent immediately if the device is idle. The server will wait for the device to become active, and then only the last message for each collapse_key value will be sent. Optional. The default value is false, and must be a JSON boolean.
  timeToLive: 3, // How long (in seconds) the message should be kept on GCM storage if the device is offline. Optional (default time-to-live is 4 weeks, and must be set as a JSON number).
  data: {
    key1: 'message1',
    key2: 'message2'
  }
}
```

### c2dm

```
{
  registration_id: 'xxx', // Device registration id
  collapse_key: 'xxx', // Collapse key
  'data.key1': 'value1' // Custom data fields
}
```

### mpns

```
{
  pushUri: 'xxx', // Device push uri
  text1: 'xxx', // Text of the toast (bold)
  text2: 'xxx', // Text of the toast (normal)
  param: 'xxx' // Optional uri parameters
}
```

## Broadcast notifications

You can easily broadcast a notification, each protocols accept a simple string or an array of string in their own device id (`token`, `registrationId`, `pushUri`).

## Events

Each protocols trigger the same events: `transmitted` and `transmissionError`, sometimes other events are emmited, but these two are common to each protocols.

* `transmitted` : Emmited when a notification is transmitted to the server.
* `updated` : Emmited when a `registrationId` needs to be updated.
* `transmissionError` : Emmited when a device id is incorrect.

Each events has custom signature for each protocols :

### apn

* `transmitted` : `function (notification, device) {}`
* `transmissionError` : `function (errorCode, notification, device) {}`

### gcm

* `transmitted` : `function (result, registrationId) {}`
* `updated` : `function (result, registrationId) {}`
* `transmissionError` : `function (error, registrationId) {}`

### c2dm

* `transmitted` : `function (messageId, payload) {}`
* `transmissionError` : `function (error, payload) {}`

### mpns

* `transmitted` : `function (result, pushUri) {}`
* `transmissionError` : `function (error, pushUri) {}`

## Modules

* apn: [node-apn](https://github.com/argon/node-apn)
* gcm: [node-gcm](https://github.com/ToothlessGear/node-gcm)
* c2dm: [node-c2dm](https://github.com/SpeCT/node-c2dm)
* mpns: [node-mpns](https://github.com/jeffwilcox/mpns)

## License

MIT
