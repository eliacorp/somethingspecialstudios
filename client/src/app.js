'use strict'


// import jQuery from "jquery";
import angular from 'angular'
import 'angular-route'
import 'angular-animate'
import 'angular-resource'





angular.module('myApp', ["ngRoute", "ngAnimate", "ngResource"])
.run(['$rootScope', '$location','$route', '$templateCache', function($rootScope, $location, $route, $templateCache){

    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        else if (reload === true){

          var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);

        var un = $rootScope.$on('$locationChangeSuccess', function () {
              $route.current = '/';
              un();
              $route.reload();
          });
        }
        return original.apply($location, [path]);
    };

}])

.service('anchorSmoothScroll', [function(){

    this.scrollTo = function(eID) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };

}])


.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
  $routeProvider

  .when('/case', {
    templateUrl: 'views/case.html',
    controller: 'caseCtrl'
  })

  .when('/case/:case', {
    templateUrl: 'views/case.html',
    controller: 'caseCtrl'
  })

    .when('/:id', {
      templateUrl: 'views/home.html',
      controller: 'appCtrl'
    })



    /*............................. Take-all routing ........................*/


    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'appCtrl'
    })


    // put your least specific route at the bottom
    .otherwise({redirectTo: '/'})



}]) //config


.filter('trustUrl', ['$sce', function($sce) {
  return function(url) {
    // if (url){
      var trusted = $sce.trustAsResourceUrl(url);
      return trusted;
    // }
  };
}])

.controller('appCtrl', ['$rootScope', '$location', '$window', '$timeout', '$http', 'anchorSmoothScroll', '$scope', '$interval', 'check', function($rootScope, $location, $window, $timeout, $http, anchorSmoothScroll, $scope, $interval, check){

  check.size();
  $rootScope.token;
  $rootScope.currentLocation;
  $rootScope.docLength;
  $rootScope.backgroundColor = '#FFFFFF';
  $rootScope.scroll=0;
  $rootScope.opacity1=80;
  $rootScope.hint = {
    show: true,
    text: "scroll or click",
    beenForward: false
  };

  $rootScope.retrieveElement = function(id){
    var element = angular.element(document.querySelectorAll("#"+id)[0]);
    return element
  }


  $rootScope.noRefresh = function(page, boolean){
    for (var i in pages){
      if(pages[i].name == page){
        console.log(pages[i].name);
        $rootScope.page = pages[i];
        $rootScope.scroll = ((pages[i].index)*$rootScope.windowHeight +10)
        if($rootScope.page.name=='contact'){$rootScope.scroll = $rootScope.scroll + ($rootScope.windowHeight * (3/4))}
        return false;
      }
    }
  }






$rootScope.windowHeight= $window.innerHeight;
$rootScope.half_windowHeight = $window.innerHeight/2;
jQuery($window).resize(function(){
  $rootScope.windowHeight = $window.innerHeight;
  $rootScope.half_windowHeight = $window.innerHeight/2;
  $scope.$apply();
});




var pages = new Array();
 pages = [
  {
    url:'/',
    name:'intro',
    index: 0,
    backgroundColor: '#FFFFFF',
    textColor:'#000000'
  },
  {
    url:'/special',
    name:'special',
    index: 1,
    backgroundColor: '#000000',
    textColor:'#FFFFFF'
  },
  {
    url:'/vision',
    name:'vision',
    index: 2,
    backgroundColor: '#FFFFFF',
    textColor:'#000000'
  },
  // {
  //   url:'/weare',
  //   name:'weare',
  //   index: 3,
  //   backgroundColor: '#000000',
  //   textColor:'#FFFFFF'
  // },
  {
    url:'/whatwedo',
    name:'whatwedo',
    index: 3,
    backgroundColor: '#000000',
    textColor:'#FFFFFF'
  },
  {
    url:'/clients',
    name:'clients',
    index: 4,
    backgroundColor: '#FFFFFF',
    textColor:'#000000'
  },
  {
    url:'/contact',
    name:'contact',
    index: 5,
    backgroundColor: '#000000',
    textColor:'#FFFFFF'
  }
];

// setTimeout(function(){
//   for (var i in pages){
//     var element = jQuery('#'+pages[i].name);
//     var thisOff = element[0].offsetTop;
//     pages[i].offset = thisOff;
//   }
//   $rootScope.docLength = document.documentElement.innerHTML.length;
// }, 600);
//

var myVar;

function myFunction() {
    myVar = setInterval(myTimer, 0.02);
}

var myTimer = function() {
   $rootScope.scroll += 1.5
   $rootScope.$apply();
}

$scope.myStopFunction = function() {
  console.log("should have stopped");
  clearInterval(myVar);
}








if(!$rootScope.isDevice){

  jQuery(function() {



      jQuery('.home').bind('mousedown', function(event){
        console.log("holdin");
        switch (event.which) {
            case 1:
                myFunction();
                break;
            case 2:
                console.log('Middle Mouse button pressed.');
                break;
            case 3:
                console.log('Right Mouse button pressed.');
                break;
            default:
                console.log('You have a strange Mouse!');
        }
      });
      jQuery('.home').bind('touchstart', function(event){
        console.log("holdin");
        switch (event.which) {
            case 1:

                break;
            case 2:
                console.log('Middle Mouse button pressed.');
                break;
            case 3:
                console.log('Right Mouse button pressed.');
                break;
            default:
                myFunction();
                console.log('You have a strange Mouse!');
        }
      });

      jQuery('.home').bind('touchend', function(event){
        console.log("holdin no mmo");
        $scope.myStopFunction();
      });

      jQuery(".home").bind('mouseup', function(e){
        $scope.myStopFunction();
        console.log("holdin no mo");
      });


     jQuery(".home").mousewheel(function(event, delta) {
        // console.log(event.deltaX, event.deltaY, event.deltaFactor);
        if($rootScope.scroll>=0){
          $rootScope.scroll -= (delta * event.deltaFactor *0.1);
        }else{
          if(delta<0){
            $rootScope.scroll -= (delta * event.deltaFactor *0.1);
          }
        }
        event.preventDefault();
        $rootScope.$apply();
     });


  });//jquery fn




  $scope.$on('$destroy', function() {
      $interval.cancel($rootScope.promise);
      $rootScope.scroll=0;
  });







  $scope.$watch('scroll', function(newValue, oldValue) {

    var division = ($rootScope.scroll)/($rootScope.windowHeight)
    // console.log(($rootScope.scroll-) *(+1));
    var max = 70

      if(($rootScope.opacity1<=max) && ($rootScope.opacity1>=0)){
        $rootScope.opacity1 = max - (max*(division))
      }else if($rootScope.opacity1>max){
        $rootScope.opacity1 =max

      }else if($rootScope.opacity1<=0){
        $rootScope.opacity1 =0
      }




    $scope.scrollModule = (division %1)*100
    $scope.scrollModuleOpposite = 100 - (division %1)*100


    //changing pages
    if (($rootScope.scroll < ($rootScope.windowHeight))){
      if(pages[0].url){
        $rootScope.page = pages[0];
      }

    }else if(($rootScope.scroll >= ($rootScope.windowHeight)) && ($rootScope.scroll < ($rootScope.windowHeight*2))){
      $rootScope.page = pages[1];
      $rootScope.hint.beenForward = true;
    }else if(($rootScope.scroll >= ($rootScope.windowHeight*2)) && ($rootScope.scroll < ($rootScope.windowHeight*3))){
      $rootScope.page = pages[2];
      $rootScope.hint.beenForward = true;
    // }else if(($rootScope.scroll >= ($rootScope.windowHeight*3)) && ($rootScope.scroll < ($rootScope.windowHeight*4))){
    //   $rootScope.page = pages[3];
    //   $scope.weare_slider();
  }else if(($rootScope.scroll >= ($rootScope.windowHeight*3)) && ($rootScope.scroll < ($rootScope.windowHeight*4))){
      $rootScope.page = pages[3];
      $rootScope.hint.beenForward = true;

  }else if(($rootScope.scroll >= ($rootScope.windowHeight*4)) && ($rootScope.scroll < ($rootScope.windowHeight*5))){
      $rootScope.page = pages[4];
      $rootScope.hint.beenForward = true;
  }

  else if(($rootScope.scroll >= ($rootScope.windowHeight*5)) && ($rootScope.scroll < ($rootScope.windowHeight*6))){
    $rootScope.page = pages[5];
    if($scope.scrollModule>98){
      $rootScope.scroll = 98;
      // $location.path('/case', true);
    }
  }

    //hiding hint
    if(($rootScope.scroll>100)&& ($rootScope.hint.beenForward == false)){
      $rootScope.hint.show = false;
      console.log($rootScope.hint.beenForward);
      setTimeout(function(){
        if($rootScope.scroll<$rootScope.windowHeight){
          $rootScope.hint = {
            show: true,
            text: "keep going",
            beenForward: false
          };
        }
        $rootScope.$apply();
      }, 2000);
    }

  });


 }//if desktop






  $scope.weare_data = [
    {
      "index":0,
      "text":"one",
      "img":"assets/weare/SSS_Images_001.jpg"
    },
    {
      "index":1,
      "text":"two",
      "img":"assets/weare/SSS_Images_002.jpg"
    },
    {
      "index":2,
      "text":"three",
      "img":"assets/weare/SSS_Images_003.jpg"
    },
    {
      "index":3,
      "text":"four",
      "img":"assets/weare/SSS_Images_004.jpg"
    },
    {
      "index":4,
      "text":"four",
      "img":"assets/weare/SSS_Images_005.jpg"
    },
    {
      "index":5,
      "text":"four",
      "img":"assets/weare/SSS_Images_006.jpg"
    },
    {
      "index":6,
      "text":"four",
      "img":"assets/weare/SSS_Images_007.jpg"
    }
  ]


var number =0;
var stop;

$scope.weare_slider = ()=>{
  if ( angular.isDefined(stop) ) return;
  stop = $interval(function() {
    if (number==($scope.weare_data.length-1)){
      number = 0;
    }else{
      number = number+1;
    }

    var id= "weare-slider-"+number
    anchorSmoothScroll.scrollHorizontally(id);

  }, 2000);
}





$scope.stop_scroll = function() {
  if (angular.isDefined(stop)) {
    $interval.cancel(stop);
    stop = undefined;
  }
};



}]) // end of appCtrl



.directive('logoDirective', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/components/logo.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
})

.directive('logotypeDirective',[function() {
  return {
    restrict: 'E',
    templateUrl: 'views/components/logotype.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
}])

.directive('whatwedoDirective', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/components/whatwedo.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
}])


.directive('weareDirective', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/components/weare.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
}])

.directive('clienticonsDirective', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/components/client-icons.html',
    replace: true,
    link: function(scope, elem, attrs) {

    }
  };
}])

.directive('navDirective', ['$rootScope', function($rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'views/components/nav.html',
    replace: true,
    link: function(scope, elem, attrs) {

      if(!$rootScope.isDevice){
        scope.isNav = false;
        scope.showNav = () => {
          scope.isNav = !scope.isNav
        }
        scope.isActive = (page) => {
          if ($rootScope.page.name == page){
            return true
          }
        }
      }

    }
  };
}]);



// var jqueryUI = require('./vendor/jquery-ui.min.js');
var jQuery = require('jquery');
var jquerymousewheel = require('./vendor/jquery.mousewheel.js')(jQuery);
var work = require("./work.js");
var service = require("./service.js");
