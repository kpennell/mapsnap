

/*  EXTRA STUFF


// .controller('AccountCtrl', ['$scope', 'simpleLogin', 'fbutil', 'user', '$location',
//    function($scope, simpleLogin, fbutil, user, $location) {



  .controller('ShowsCtrl', ['$scope', '$http','$firebase', 
    function ($scope, $http, $firebase) {
      $http.get('/app/json/shows.geojson').
      success(function (data, status, headers, config) {
      $scope.shows = data;

      console.log($scope.shows);

      }).
      error(function (data, status, headers, config) {
          // log error
      });

      $scope.sound = {};

//      var ref = new Firebase("https://torid-fire-4332.firebaseio.com/");
//      var showsSync = $firebase(ref.child("shows"));
//      data = showsSync.$asArray();

      $scope.streamTrack = function (show) {
          SC.stream(show.properties.stream_url, function (sound) {
              $scope.sound = sound;
              sound.play();
          });

          show.visible = false;
      };

      $scope.pauseTrack = function (show) {
          $scope.sound.pause();
          show.visible = true;
      };

  }
  ])


.controller("StarredCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://torid-fire-4332.firebaseio.com/");
  var starredSync = $firebase(ref.child("starred"));
  $scope.starred = starredSync.$asArray();
  //console.log($scope.starred);
  
   $scope.toggleStarred = function(show) {
    show.isStarred = !show.isStarred;

    console.log(show);

    // if id is part of the array, call save, if not, call add

    if ($scope.starred.$indexFor(show) > -1) {
      $scope.starred.$save(angular.copy(show))
    }
    else {
      $scope.starred.$add(angular.copy(show)).then(function(ref) {
        var id = ref.name();
        console.log($scope.starred.$indexFor(id));
  })
}

}
});


$scope.starred.$save(angular.copy(show));
  }).then( function(ref) {
    $scope.starred.$add(angular.copy(show));
 


 $scope.toggleStarred = function(show) {
    show.isStarred = !show.isStarred;
    $scope.starred.$add(angular.copy(show)).then(function(ref) {
      console.log(ref);
      
      console.log("added record with id: " + id);
      console.log($scope.starred.$indexFor(id));
});



$scope.starred.$save(angular.copy(show)).then(function(ref) {
      var id = ref.name();
      console.log("added record with id: " + id);
      console.log($scope.starred.$indexFor(id));
});


$scope.starred.$loaded()
  .then(function(ref) {
    var id = ref.name();
    var indexnum = $scope.starred.$indexFor(id)
    if(indexnum > -1){
      $scope.starred.$save(angular.copy(show))
    }
    else {
      $scope.starred.$add(angular.copy(show))
    }
 });


    var list = $firebase(ref).$asArray();
list.$add({foo: "bar"}).then(function(ref) {
   var id = ref.name();
   console.log("added record with id " + id);
   list.$indexFor(id); // returns location in the array
});

if (starred.$indexFor(show) > -1) {
      //$scope.starred.$save(angular.copy(show));
      console.log(show);
    }
    else
    {
      //$scope.starred.$add(angular.copy(show));
    } */

//  next I shall work on the logic for only adding to $scope.shows (which should be called $scope.starred) when the item isn't already in there.  Otherwise, remove it.
//  then, get the toggle set for the star (full or empty)

/* To do

rename shows -> starred
Remove if already in there.
Toggle starred.


show.isStarred = !show.isStarred;
    console.log(show);
    $scope.shows.$add(angular.copy(show));

*/