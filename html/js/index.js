/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global angular, FB, require, exports, console, process, module, describe, it, expect, jasmine*/

var app = angular.module('sharing', ['indx', 'ui.router'])
	.config(function($stateProvider, $urlRouterProvider) { 
	    $urlRouterProvider.otherwise('/home');
	    // Now set up the states
	    $stateProvider
	      .state('home', { 
	        url:'/home',
	        templateUrl:'tmpl/home.html',
	        controller:function($scope, $stateParams, utils) { 
	          console.log('stateparams >> ', $scope.error, $stateParams.error);
	          if ($stateParams.error) { $scope.error = $stateParams.error; }
	          $scope.uid = utils.guid(16);
	        }
	      }).state('survey', {
	      	url:'/survey',
	      	templateUrl:'tmpl/survey.html',	      	
	      }).state('survey.views', {
	      	url:'/:userID/:condition/:qid',
	      	views: {
	      		instructions: {
	      			templateUrl:function($state) { 
	      				console.log("$state >> ", $state, '->', 'tmpl/'+$state.condition+'.html');
	      				return 'tmpl/'+$state.condition+'.html';
	      			}
	      		},
	      		question: {
			      	templateUrl:'tmpl/question.html',
			      	controller:function($scope, $stateParams) {
			      		$scope.qid = $stateParams.qid;
			      	}
	      		}
	      	},
	      	controller:function($scope, $state) {
	      		console.log('stateParams >> ', $state);
	      		$scope.userid = $state.userID;
	      		$scope.condition = $state.condition;	      		
	      	}
	      }).state('done', { url:'/done',  
	      	templateUrl:'tmpl/done.html',
	      	controller:function($scope) {
	      		console.log('all done');
	      	}
	      });

	}).controller('main', function($scope, utils) {
		var u = utils, sa = function(f) { u.safeApply($scope, f); };
		console.log('hello main starting');
	});