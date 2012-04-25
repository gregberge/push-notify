var Worker = require("node-queue-worker").Worker,
    RedisDriver = require("node-queue-worker").RedisDriver;
    Notify = require("./lib/notify").Notify,
    apnNotify, driver, worker;

apnNotify = new Notify(Notify.PROTOCOL_APN);

driver = new RedisDriver(6379, 'arnold.lemonde-interactif.fr', 3);

worker = new Worker("notify:apn", apnNotify.notify, driver, {waitTime: 30});

worker.start();