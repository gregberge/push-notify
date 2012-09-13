var Notify = require("./index").Notify,
    mpnsNotify;

var config = {
      "sandbox" : {
            "sender" : {
                  "mpns" : {
                        toastTarget: "toast",
                        notificationClass: "2"
                  }
            }
      }
};


mpnsNotify = new Notify(Notify.PROTOCOL_MPNS, config.sandbox);
mpnsNotify.setErrorCallback(function(data) {
   console.log(data);
});

var message = JSON.parse("{\"device_url\":\"http:\\/\\/db3.notify.live.net\\/throttledthirdparty\\/01.00\\/__AND_THE_REST_HERE__\",\"text1\":\"Fran\\u00e7ois Hollande promet de r\\u00e9former le syst\\u00e8me bancaire\",\"text2\":\"La candidat socialiste, qui tenait son premier grand meeting au Bourget (Seine-saint-Denis), a promis, s&apos;il \\u00e9tait \\u00e9lu, le vote d&apos;une loi sur les banques &quot;qui les obligera \\u00e0 s\\u00e9parer leurs activit\\u00e9s de cr\\u00e9dit et de sp\\u00e9culation&quot;. Il a \\u00e9galement promis d&apos;inscrire la loi de 1905 sur la la\\u00efcit\\u00e9 dans la Constitution et de baisser le salaire du pr\\u00e9sident et des ministres de 30 %. \",\"param\":\"\\/Views\\/BreakingNewsView.xaml?url=http%3A%2F%2F__MYURL__%2Falerte%2F1632971.json&amp;sequence=Politique\"}");

mpnsNotify.notify(message, function() {
   console.log("Sending ok");
});

/**
 *
 * Good response example :
 *
 * {
 *   statusCode: 200,
 *   deviceConnectionStatus: 'Connected',
 *   notificationStatus: 'Received',
 *   subscriptionStatus: 'Active',
 *   pushType: 'toast',
 *   text1: 'François Hollande promet de réformer le système bancaire',
 *   text2: 'La candidat socialiste, qui tenait son premier grand meeting au Bourget (Seine-saint-Denis), a promis, s&apos;il était élu, le vote d&apos;une loi sur les banques &quot;qui les obligera à séparer leurs activités de crédit et de spéculation&quot;. Il a également promis d&apos;inscrire la loi de 1905 sur la laïcité dans la Constitution et de baisser le salaire du président et des ministres de 30 %. ',
 *   param: '/Views/BreakingNewsView.xaml?url=http%3A%2F%2F__MYURL__%2Falerte%2F1632971.json&amp;sequence=Politique'
 * }
 *
 * Bad response example :
 *
 * {
 *   statusCode: 412,
 *   deviceConnectionStatus: 'Inactive',
 *   notificationStatus: 'Dropped',
 *   subscriptionStatus: '',
 *   pushType: 'toast',
 *   text1: 'François Hollande promet de réformer le système bancaire',
 *   text2: 'La candidat socialiste, qui tenait son premier grand meeting au Bourget (Seine-saint-Denis), a promis, s&apos;il était élu, le vote d&apos;une loi sur les banques &quot;qui les obligera à séparer leurs activités de crédit et de spéculation&quot;. Il a également promis d&apos;inscrire la loi de 1905 sur la laïcité dans la Constitution et de baisser le salaire du président et des ministres de 30 %. ',
 *   param: '/Views/BreakingNewsView.xaml?url=http%3A%2F%2F__MYURL__%2Falerte%2F1632971.json&amp;sequence=Politique',
 *   minutesToDelay: 61
 * }
 *
 */
