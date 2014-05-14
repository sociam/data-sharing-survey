/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global angular, d3, FB, require, exports, console, process, module, describe, it, expect, jasmine*/

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
	          var conditions = ['c1', 'c2'];
	          $scope.condition = utils.chooseRandom(conditions);
	        }
	      }).state('survey', {
	      	url:'/survey',
	      	resolve: { 
	      		survey: function(utils) { 
		          var u = utils, d = u.deferred();
		          d3.csv('survey.csv').get(function(err, rows) { 
		          	if (err) { 
		          		d.reject();		
		          		console.error('could not load ', err);
		          		return;
		          	}
		          	d.resolve(rows);
		          });
		          return d.promise();
		        }
	      	},
	      	templateUrl:'tmpl/survey.html',
	      	controller:function($scope, $state, $stateParams, survey) { 
	      		console.log('stateParams >> ', $stateParams);
	      		$scope.survey = survey;
	      	}     	
	      }).state('survey.question', {
	      	url:'/:userID/:condition/:qid',
	      	views: {
	      		sharingbox: {
	      			templateUrl:function($state) { 
	      				return 'tmpl/'+$state.condition+'.html';
	      			},
	      			controller:function($scope, $stateParams) { 
	      				console.log('question > ', $scope.survey);
			      		$scope.qid = $stateParams.qid;
		   				var hits = $scope.survey.filter(function(x) { return x.qid === $stateParams.qid; });
		   				$scope.q = hits && hits[0];
		   			}
	      		},
	      		question: {
			      	templateUrl:'tmpl/question.html',
			      	controller:function($scope, $stateParams, $state) {
			      		var survey = $scope.survey;
			      		$scope.qid = $stateParams.qid;
		   				var hits = $scope.survey.filter(function(x) { return x.qid === $stateParams.qid; });
		   				$scope.q = hits && hits[0];
			      		console.log('survey controller >> question :: ', $scope.q);
		   				$scope.next = function() {
		   					// todo : save progress
							var nlogical = parseInt($stateParams.qid) + 1;
							if (survey[nlogical]) {
								$state.go('survey.question', { 
									userID: $stateParams.userID,
									qid:nlogical,
									condition:$stateParams.condition
								});
							} else {
								$state.go('done');
							}
		   				};
		   				$scope.prev = function() { 
							var nlogical = Math.max(0,parseInt($stateParams.qid) - 1);
							if (survey[nlogical]) {
								$state.go('survey.question', { 
									userID: $stateParams.userID,
									qid:nlogical,
									condition:$stateParams.condition
								});
							}		   					
		   				};
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