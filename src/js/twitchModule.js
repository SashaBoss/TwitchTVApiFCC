﻿; (function (angular) {

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

            $scope.filterOptions = [
                { name: "All", value: "all" },
                { name: "Online", value: "online" },
                { name: "Offline", value: "offline" }
            ];

            $scope.selectedFilter = $scope.filterOptions[0];

            $scope.filterChanged = function () {
                switch ($scope.selectedFilter.name) {
                    case "All":
                        $scope.streams.forEach(function (stream) {
                            stream.toDisplay = true;
                        });
                        break;
                    case "Online":
                        $scope.streams.forEach(function (stream) {
                            stream.toDisplay = !!stream.isOnline;
                        });
                        break;
                    case "Offline":
                        $scope.streams.forEach(function (stream) {
                            stream.toDisplay = !stream.isOnline;
                        });
                        break;
                }
            }

            testChannels.forEach(function (channel) {
                $http.jsonp(twitchTvProxyUrl + '/channels/' + channel, { jsonpCallbackParam: 'callback' })
                 .then(onSuccessGetChannelInfo);
            });

            function onSuccessGetChannelInfo(response) {
                var channel = response.data;
                $http.jsonp(twitchTvProxyUrl + '/streams/' + channel.name, { jsonpCallbackParam: 'callback' })
                 .then(function (response) {
                     var data = response.data;
                     if (data.stream === null) {
                         channel.game = "Offline";
                         channel.isOnline = false;
                         channel.displayClass = "offline";
                     } else if (data.stream === undefined) {
                         channel.game = "Account Closed";
                         channel.isOnline = false;
                         channel.displayClass = "offline";
                     } else {
                         channel.game = data.stream.game;
                         channel.isOnline = true;
                         channel.displayClass = "online";
                     };

                     channel.toDisplay = true;
                     $scope.streams.push(channel);
                 });
            }
        }
    ]);
})(window.angular);