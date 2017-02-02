; (function (angular) {

    var app = angular.module('TwitchTV', ['ngRoute', 'ngResource']);

    var twitchTvProxyUrl = "https://wind-bow.gomix.me/twitch-api";

    app.config(function ($sceProvider) {
        $sceProvider.enabled(false);
    });

    var testChannels = ["ESL_SC2", "OgamingSC2", "cretetion",
                "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

    app.controller('TwitchTVController', [
        '$scope', '$http', function ($scope, $http) {
            $scope.streams = [];

            $scope.getInfo = function() {
                $scope.streams.forEach(function (stream) {
                    console.log(stream);
                });
            }

            $scope.log = function(toLog) {
                console.log(toLog);
            }

            testChannels.forEach(function(element) {
                $http.jsonp(twitchTvProxyUrl + '/streams/' + element, { jsonpCallbackParam: 'callback' })
                 .then(onSuccessGetStreamData);
            });

            function onSuccessGetStreamData(response) {
                if (response.data.stream != null) {
                    $scope.streams.push(response.data.stream);
                }
            }
        }
    ]);
})(window.angular);