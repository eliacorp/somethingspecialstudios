'use strict'
var jQuery = require('jquery');

/* Services */
var Service = angular.module('myApp');

Service.factory("transformRequestAsFormPost", [function() {
        // I prepare the request data for the form post.
        function transformRequest( data, getHeaders ) {
            var headers = getHeaders();
            headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
            return( serializeData( data ) );
        }
        // Return the factory value.
        return( transformRequest );
        // ---
        // PRVIATE METHODS.
        // ---
        // I serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an atered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
        function serializeData( data ) {
            // If this is not an object, defer to native stringification.
            if ( ! angular.isObject( data ) ) {
                return( ( data == null ) ? "" : data.toString() );
            }
            var buffer = [];
            // Serialize each key in the object.
            for ( var name in data ) {
                if ( ! data.hasOwnProperty( name ) ) {
                    continue;
                }
                var value = data[ name ];
                buffer.push(
                    encodeURIComponent( name ) +
                    "=" +
                    encodeURIComponent( ( value == null ) ? "" : value )
                );
            }
            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                .join( "&" )
                .replace( /%20/g, "+" )
            ;
            return( source );
        }
    }]);




Service.service('anchorSmoothScroll', ['$location','$rootScope', function($location, $rootScope){

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





  this.scrollHorizontally = function(section) {

       var element = $rootScope.retrieveElement("weare-slider");

       var toElement = $rootScope.retrieveElement(section);

       var number = toElement[0].offsetLeft;

       console.log(toElement);
       console.log(number);

      // event.preventDefault();

        //
        element.stop().animate({
          scrollLeft: number
        },500,
          'linear'
          // function() {
          //   // $location.path(section, false);
          //   // console.log($location.path());
          // }
        );


    };

    this.scrollHorizontallyFast = function(number, section) {


           var element = $rootScope.retrieveElement("shop");

          // event.preventDefault();

            element.stop().animate({
              scrollLeft: number
            }, 300,
              'easeInOutQuart'
              // function() {
              //   // $location.path(section, false);
              //   // console.log($location.path());
              // }
            );

      };




    this.scrollToZero = function(id) {


           var element = jQuery(id);

          event.preventDefault();

          element.stop().animate({
            scrollTop: 0
          },1000,
            'easeInOutQuart'
            // function() {
            //   // $location.path(section, false);
            //   // console.log($location.path());
            // }
          );

      }


      this.scrollOneViewport = function() {



              setTimeout(function(){
                var number, element, scroll, scrollPosition, windowheight;
                       element = jQuery('.world-detail-wrapper');
                       windowheight = window.innerHeight;
                       if ($rootScope.isMobile && $rootScope.isDevice){
                          windowheight = $window.innerHeight + 130;
                       }


                        element.stop().animate({
                          scrollTop: windowheight
                        },1000,
                          'easeInOutQuart'
                          // function() {
                          //   // $location.path(section, false);
                          //   // console.log($location.path());
                          // }
                        );
                      }, 100);

            }




}]);






Service.service('check', ['$location', '$rootScope', function($location, $rootScope){
  this.size = function() {


        //..............................................................................mobile
        //....this is the function that checks the header of the browser and sees what device it is
        var test = navigator.userAgent.match('GSA');

        if (test == 'GSA'){
          $rootScope.isChrome = true;
        }


        $rootScope.isMobile, $rootScope.isDevice, $rootScope.isMobileDevice;
        $rootScope.checkSize = function(){

            $rootScope.checkDevice = {
                  Android: function() {
                      return navigator.userAgent.match(/Android/i);
                  },
                  BlackBerry: function() {
                      return navigator.userAgent.match(/BlackBerry/i);
                  },
                  iOS: function() {
                      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                  },
                  Opera: function() {
                      return navigator.userAgent.match(/Opera Mini/i);
                  },
                  Windows: function() {
                      return navigator.userAgent.match(/IEMobile/i);
                  },
                  any: function() {
                      return ($rootScope.checkDevice.Android() || $rootScope.checkDevice.BlackBerry() || $rootScope.checkDevice.iOS() || $rootScope.checkDevice.Opera() || $rootScope.checkDevice.Windows());
                  },
                  chromeMobile: function(){
                    return navigator.userAgent.match('CriOS');
                  }
              };

            //........checks the width

              $rootScope.mobileQuery=window.matchMedia( "(max-width: 767px)" );
              $rootScope.isMobile=$rootScope.mobileQuery.matches;


            //.........returning true if device

              if ($rootScope.checkDevice.any()){
                $rootScope.isDevice= true;
              }else{
                  $rootScope.isDevice=false;
              }
              if (($rootScope.isDevice==true)&&($rootScope.isMobile==true)){
                $rootScope.isMobileDevice= true;
              }else{
                  $rootScope.isMobileDevice=false;
              }

                if ($rootScope.isDevice){
                $rootScope.mobileLocation = function(url){
                  $location.path(url).search();
                }
                $rootScope.mobileExternalLocation = function(url){
                  $window.open(url, '_blank');
                }
                } else if (!$rootScope.isDevice){
                  $rootScope.mobileLocation = function(url){
                    return false;
                  }
                  $rootScope.mobileExternalLocation = function(url){
                    return false;
                  }
                }

          }//checkSize

         $rootScope.checkSize();
         $rootScope.landscapeView = false;
         $rootScope.pageLoading = false;


         //function removing website if landscape
          $rootScope.landscapeFunction = function(){
            if ($rootScope.isMobile==true){
                if(window.innerHeight < window.innerWidth){
                  $rootScope.landscapeView = true;
                  $rootScope.pageLoading = true;
                  jQuery(".landscape-view-wrapper").css({
                    "width":"100vw",
                    "height": "100vh",
                    "display": "block"
                });
                }else{
                  $rootScope.landscapeView = false;
                  $rootScope.pageLoading = false;
                }
            }
          }
        $rootScope.landscapeFunction();
    };
}])
