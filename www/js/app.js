angular.module("bangun_ruang", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","bangun_ruang.controllers", "bangun_ruang.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Bangun Ruang" ;
		$rootScope.appLogo = "" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_menu_utama = false ;
		$rootScope.hide_menu_petunjuk = false ;
		$rootScope.hide_menu_ki_dan_kd = false ;
		$rootScope.hide_menu_materi = false ;
		$rootScope.hide_menu_quiz = false ;
		$rootScope.hide_menu_referensi = false ;
		$rootScope.hide_menu_profile = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "bangun_ruang",
				storeName : "bangun_ruang",
				description : "The offline datastore for Bangun Ruang app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				//StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("bangun_ruang.home");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("id-id");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("id-id");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("bangun_ruang",{
		url: "/bangun_ruang",
			abstract: true,
			templateUrl: "templates/bangun_ruang-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("bangun_ruang.about_us", {
		url: "/about_us",
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.balok", {
		url: "/balok",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-balok.html",
						controller: "balokCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("bangun_ruang.home", {
		url: "/home",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-home.html",
						controller: "homeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.ki", {
		url: "/ki",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-ki.html",
						controller: "kiCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("bangun_ruang.kubus", {
		url: "/kubus",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-kubus.html",
						controller: "kubusCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("bangun_ruang.materi", {
		url: "/materi",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-materi.html",
						controller: "materiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.menu", {
		url: "/menu",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-menu.html",
						controller: "menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.petunjuk", {
		url: "/petunjuk",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-petunjuk.html",
						controller: "petunjukCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("bangun_ruang.profile", {
		url: "/profile",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-profile.html",
						controller: "profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.quiz", {
		url: "/quiz",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-quiz.html",
						controller: "quizCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.quiz_balok", {
		url: "/quiz_balok",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-quiz_balok.html",
						controller: "quiz_balokCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.quiz_kubus", {
		url: "/quiz_kubus",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-quiz_kubus.html",
						controller: "quiz_kubusCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("bangun_ruang.referensi", {
		url: "/referensi",
		cache:false,
		views: {
			"bangun_ruang-side_menus" : {
						templateUrl:"templates/bangun_ruang-referensi.html",
						controller: "referensiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/bangun_ruang/home");
});
