// Code goes here

'use strict';

/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'simpleLogin', 'leaflet-directive'])

.controller('HomeCtrl', ['$scope', 'fbutil', 'user', 'FBURL',
  function($scope, fbutil, user, FBURL) {
    $scope.syncedValue = fbutil.syncObject('syncedValue');
    $scope.user = user;
    $scope.FBURL = FBURL;
  }
])

.controller('ChatCtrl', ['$scope', 'messageList',
  function($scope, messageList) {
    $scope.messages = messageList;
    $scope.addMessage = function(newMessage) {
      if (newMessage) {
        $scope.messages.$add({
          text: newMessage
        });
        $scope.messages.$add({
          text: newMessage
        });
      }
    };
  }
])

.controller('LoginCtrl', ['$scope', 'simpleLogin', '$location',
  function($scope, simpleLogin, $location) {
    $scope.email = null;
    $scope.pass = null;
    $scope.confirm = null;
    $scope.createMode = false;

    $scope.login = function(email, pass) {
      $scope.err = null;
      simpleLogin.login(email, pass)
        .then(function( /* user */ ) {
          $location.path('/account');
        }, function(err) {
          $scope.err = errMessage(err);
        });
    };

    $scope.createAccount = function() {
      $scope.err = null;
      if (assertValidAccountProps()) {
        simpleLogin.createAccount($scope.email, $scope.pass)
          .then(function( /* user */ ) {
            $location.path('/account');
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidAccountProps() {
      if (!$scope.email) {
        $scope.err = 'Please enter an email address';
      } else if (!$scope.pass || !$scope.confirm) {
        $scope.err = 'Please enter a password';
      } else if ($scope.createMode && $scope.pass !== $scope.confirm) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.code ? err.code : err + '';
    }
  }
])

.controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
  function($scope, simpleLogin, fbutil, user, $location) {
    // create a 3-way binding with the user profile object in Firebase
    var profile = fbutil.syncObject(['users', user.uid]);
    profile.$bindTo($scope, 'profile');

    // expose logout function to scope
    $scope.logout = function() {
      profile.$destroy();
      simpleLogin.logout();
      $location.path('/login');
    };

    $scope.changePassword = function(pass, confirm, newPass) {
      resetMessages();
      if (!pass || !confirm || !newPass) {
        $scope.err = 'Please fill in all password fields';
      } else if (newPass !== confirm) {
        $scope.err = 'New pass and confirm do not match';
      } else {
        simpleLogin.changePassword(profile.email, pass, newPass)
          .then(function() {
            $scope.msg = 'Password changed';
          }, function(err) {
            $scope.err = err;
          })
      }
    };

    $scope.clear = resetMessages;

    $scope.changeEmail = function(pass, newEmail) {
      resetMessages();
      profile.$destroy();
      simpleLogin.changeEmail(pass, newEmail)
        .then(function(user) {
          profile = fbutil.syncObject(['users', user.uid]);
          profile.$bindTo($scope, 'profile');
          $scope.emailmsg = 'Email changed';
        }, function(err) {
          $scope.emailerr = err;
        });
    };

    function resetMessages() {
      $scope.err = null;
      $scope.msg = null;
      $scope.emailerr = null;
      $scope.emailmsg = null;
    }
  }
])

.controller('ShowsCtrl', ['$scope', '$firebase',
  function($scope, $firebase) {
    var ref = new Firebase("https://torid-fire-4332.firebaseio.com");
    var showsSync = $firebase(ref.child("shows"));
    $scope.shows = showsSync.$asArray();

    $scope.sound = {};

    $scope.streamTrack = function(show) {
      SC.stream(show.properties.stream_url, function(sound) {
        $scope.sound = sound;
        sound.play();
      });

      show.visible = false;
    };

    $scope.pauseTrack = function(show) {
      $scope.sound.pause();
      show.visible = true;
    };
  }
])

.controller('MapController', ['$scope', '$firebase',
  function($scope, $firebase) {
    angular.extend($scope, {
      center: {
        lat: 37.7577,
        lng: -122.4376,
        zoom: 12
      },
      defaults: {
        scrollWheelZoom: false
      }
    });

    var defaultMarker = L.AwesomeMarkers.icon({
      icon: 'play',
      markerColor: 'darkblue'
    });

    var mouseoverMarker = L.AwesomeMarkers.icon({
      icon: 'play',
      markerColor: 'blue'
    });

    var layers = {};

    $scope.hoveritem = {};

    function pointMouseover(leafletEvent) {
      var layer = leafletEvent.target;
      layer.setIcon(mouseoverMarker);

      $scope.$apply(function() {
        $scope.hoveritem = layer.feature.properties.id;
      })
    }

    function pointMouseout(leafletEvent) {
      var layer = leafletEvent.target;
      layer.setIcon(defaultMarker);

      $scope.$apply(function() {
        $scope.hoveritem = {};
      })
    }

    $scope.menuMouse = function(show) {
      var layer = layers[show.properties.id];
      //console.log(layer);
      layer.setIcon(mouseoverMarker);
    }

    $scope.menuMouseout = function(show) {
      var layer = layers[show.properties.id];
      layer.setIcon(defaultMarker);
    }

    var ref = new Firebase("https://torid-fire-4332.firebaseio.com");
    var mapShowsSync = $firebase(ref.child("shows"));
    $scope.mapShows = mapShowsSync.$asArray();
    $scope.mapShows.$loaded(function() {
      angular.extend($scope, {
        geojson: {
          data: $scope.mapShows[0],
          onEachFeature: function(feature, layer) {
            layer.setIcon(defaultMarker);
            layer.on({
              mouseover: pointMouseover,
              mouseout: pointMouseout
            });
            layers[feature.properties.id] = layer;
          }
        }

      });
    });
  }
])

.controller('StarredCtrl', ['$scope', '$firebase', 'simpleLogin',
  function($scope, $firebase, simpleLogin) {
    var ref = new Firebase("https://torid-fire-4332.firebaseio.com");

    simpleLogin.getUser().then(function(user) {

      var loggedInUserFavoritesSync = $firebase(ref.child("users").child(user.uid).child("favorites"));

      $scope.loggedInUserFavorites = loggedInUserFavoritesSync.$asObject();

      $scope.toggleStarred = function(show) {

        //console.log(show);
        if ($scope.loggedInUserFavorites[show.properties.id] === true) {
          $scope.loggedInUserFavorites[show.properties.id] = false;
          
        } else if ($scope.loggedInUserFavorites.$value === undefined || null) {             
          $scope.loggedInUserFavorites[show.properties.id] = true;
             
        } else { 
          $scope.loggedInUserFavorites[show.properties.id] = true; 
        }

      console.log($scope.loggedInUserFavorites);

        $scope.loggedInUserFavorites.$save();

        
      };

      }) //user promise

  }
]);

