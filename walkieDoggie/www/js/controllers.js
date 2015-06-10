angular.module('starter.controllers', [])

.controller('AuthCtrl', function($scope, $state, Auth, User) {

  $scope.auth = {};

  $scope.login = function() {
    Auth.login($scope.auth);
  };

  $scope.facebookConnect = function() {
    Auth.facebook();
  };

  $scope.register = function() {
    Auth.register($scope.auth).then(function(userData) {
      User.create($scope.auth, userData);
      Auth.login($scope.auth);
    });
  };

})

.controller('MitgliederCtrl', function($scope, $stateParams, User) {
  $scope.allUsers = User.all();
  if($stateParams.userId){
    $scope.user = User.get($stateParams.userId);
  }
})

// .controller('MitgliederDetailCtrl', function($scope, $stateParams, User) {
// 	$scope.mitglied = User.get($stateParams.mitgliedId);
// })

.controller('ProfilCtrl', function($scope, $stateParams, User, Dog, $ionicActionSheet, $cordovaCamera, $cordovaDatePicker, $timeout) {

  // Rudel
  $scope.allDogs = Dog.all();

  // Hunde Profil
  $scope.dogDetail = function(dogId) {
    $scope.dog = Dog.get(dogId);
  }

  $scope.edit = function(originScope) {
    $scope.editScope = {};
    angular.forEach(originScope, function(value, key) {
      this[key] = value;
    }, $scope.editScope);
  }

  $scope.save = function(originScope) {
    // Unterscheidung zwischen Bearbeitung oder Erstellung (nur existentes hat $id)
    if($scope.editScope.$id === undefined){
      Dog.add($scope.editScope);
      $timeout(function() {
        $scope.allDogs = Dog.all(); 
      }, 300);
    } else {
      angular.forEach($scope.editScope, function(value, key) {
        this[key] = value;
      }, originScope);
    
    // Unterscheidung Hund <-> Mensch (nur Hund hat Rasse)
    if($scope.editScope.name === undefined){
      User.save(originScope);
    } else {
      Dog.save(originScope);      
      }
    }
  }

  $scope.remove = function(originScope) {
    Dog.remove(originScope);
    $timeout(function() {
      $scope.allDogs = Dog.all(); 
    }, 300);
  }

  $scope.changePhoto = function() {

    var sourceType;
    
    $ionicActionSheet.show({
      buttons: [
        { text: 'Neues Bild aufnehmen' },
        { text: 'Bild auswählen' }
      ],
      titleText: 'Profilbild ändern',
      cancelText: 'Abbrechen',
      buttonClicked: function(index) {
        switch (index) {
          case 0 :
            sourceType = Camera.PictureSourceType.CAMERA;
            getPicture(sourceType);
            return true;
          case 1 :
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            getPicture(sourceType);
            return true;
          }
      }
    });
    
    function getPicture(sourceType) {
      var options = {
        quality : 70,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : sourceType,
        allowEdit : true,
        correctOrientation: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 100,
        targetHeight: 100,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.editUser.image = imageData;
      });
    };
  }

  $scope.datePicker = function() {
    var options = {
      date: new Date($scope.editUser.geburtsdatum),
      mode: 'date', // or 'time' // TIME HERE
      minDate: new Date() - 10000,
      allowOldDates: true,
      allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

   $cordovaDatePicker.show(options).then(function (date) {
       $scope.editUser.geburtsdatum = date.toJSON();
   });
  }

})


.controller('MapCtrl', function($scope, $ionicLoading) {

        var myLatlng = new google.maps.LatLng(49.3716253, 9.1489621);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.SATELLITE
			/*mapTypeId: google.maps.MapTypeId.ROADMAP*/
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
		
		//some dummy markers
		var marker_1 = new google.maps.Marker({position: new google.maps.LatLng(49.1550,9.2220),map: map,type: "location",title: "Location 1"});
		var marker_2 = new google.maps.Marker({position: new google.maps.LatLng(49.1553,9.2223),map: map,type: "location",title: "Location 2"});
		var marker_3 = new google.maps.Marker({position: new google.maps.LatLng(49.1550,9.2223),map: map,type: "location",title: "Location 3"});
		var marker_4 = new google.maps.Marker({position: new google.maps.LatLng(49.1540,9.2212),map: map,type: "user",title: "User 1"});
		var marker_5 = new google.maps.Marker({position: new google.maps.LatLng(49.1540,9.2215),map: map,type: "user",title: "User 2"});
		var marker_6 = new google.maps.Marker({position: new google.maps.LatLng(49.1538,9.2215),map: map,type: "user",title: "User 3"});
		var marker_7 = new google.maps.Marker({position: new google.maps.LatLng(49.1540,9.2230),map: map,type: "poison",title: "Poisonbait 1"});
		var marker_8 = new google.maps.Marker({position: new google.maps.LatLng(49.1540,9.2228),map: map,type: "poison",title: "Poisonbait 2"});
		var marker_9 = new google.maps.Marker({position: new google.maps.LatLng(49.1538,9.2228),map: map,type: "poison",title: "Poisonbait 3"});
 
        $scope.map = map;
})

.controller('LocationCtrl', function($scope, $stateParams, Location){
    $scope.allLocations = Location.all();
    if($stateParams.locationId){
        $scope.location = Location.get($stateParams.locationId);
    }
})

.controller('LocationCreateCtrl', function($scope, $state, $stateParams, Location){
    $scope.location = {};
    var location = {};
    location.type = $scope.type;
    location.title = $scope.title;
    location.langitude = $scope.langitude;
    location.longitude = $scope.longitude;
    $scope.create = function(){
        Location.create(location);
    };
});








