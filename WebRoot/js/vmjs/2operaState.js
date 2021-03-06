var app = angular
		.module(
				'test',
				[ 'ngRoute' ],
				function($httpProvider) {// ngRoute引入路由依赖
					$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
					$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

					// Override $http service's default transformRequest
					$httpProvider.defaults.transformRequest = [ function(data) {
						/**
						 * The workhorse; converts an object to
						 * x-www-form-urlencoded serialization.
						 * 
						 * @param {Object}
						 *            obj
						 * @return {String}
						 */
						var param = function(obj) {
							var query = '';
							var name, value, fullSubName, subName, subValue, innerObj, i;

							for (name in obj) {
								value = obj[name];

								if (value instanceof Array) {
									for (i = 0; i < value.length; ++i) {
										subValue = value[i];
										fullSubName = name + '[' + i + ']';
										innerObj = {};
										innerObj[fullSubName] = subValue;
										query += param(innerObj) + '&';
									}
								} else if (value instanceof Object) {
									for (subName in value) {
										subValue = value[subName];
										fullSubName = name + '[' + subName
												+ ']';
										innerObj = {};
										innerObj[fullSubName] = subValue;
										query += param(innerObj) + '&';
									}
								} else if (value !== undefined
										&& value !== null) {
									query += encodeURIComponent(name) + '='
											+ encodeURIComponent(value) + '&';
								}
							}

							return query.length ? query.substr(0,
									query.length - 1) : query;
						};

						return angular.isObject(data)
								&& String(data) !== '[object File]' ? param(data)
								: data;
					} ];
				});
app.run([ '$rootScope', '$location', function($rootScope, $location) {
	$rootScope.$on('$routeChangeSuccess', function(evt, next, previous) {
		console.log('路由跳转成功');
		$rootScope.$broadcast('reGetData');
	});
} ]);

// 路由配置
app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/testIndex', {
		templateUrl : '/GVM/jsp/2operaState/operaState.html',
		controller : 'operaStateController'
	})
	$routeProvider.when('/qingyuan', {
		templateUrl : '/GVM/jsp/2operaState/operaState.html',
		controller : 'operaStateController'
	})
	$routeProvider.when('/guangming', {
		templateUrl : '/GVM/jsp/2operaState/operaState.html',
		controller : 'operaStateController'
	})
} ]);

app.constant('baseUrl', '/GVM/');
app.factory('services', [ '$http', 'baseUrl', function($http, baseUrl) {
	var services = {};
	
	services.getoperaState = function(data) {
		return $http({
			method : 'post',
			url : baseUrl + 'operaState/getOperaState.do',
			data : data
		});
	};

	return services;
} ]);
app.controller('operaStateController', [ '$scope', 'services', '$location',
		function($scope, services, $location) {
			var operaState = $scope;

			operaState.selectEquipList=function(state){
				services.getoperaState({
					facility : state,
					project: sessionStorage.getItem("project")
				}).success(function(data) {
					if(data.size == 0){
						$("#nolist").show();
					}else{
						$("#nolist").hide();
					}
					console.log(data.alert);
					console.log(data.operation);
					//TODO
				});
			}

			// zq初始化
			function initPage() {
				console.log("初始化页面信息");
				if ($location.path().indexOf('/testIndex') == 0) {
					sessionStorage.setItem("project", 1);
					services.getoperaState({
						facility : 1,
						project: 1
					}).success(function(data) {
						if(data.size == 0){
							$("#nolist").show();
						}else{
							$("#nolist").hide();
						}
						console.log(data.alert);
						
					});
				} else if ($location.path().indexOf('/qingyuan') == 0) {
					sessionStorage.setItem("project", 2);
				} else if ($location.path().indexOf('/guangming') == 0) {
					sessionStorage.setItem("project", 3);
				}
			}
			initPage();
		} ]);


// 时间的格式化的判断
app.filter('isOrNotNull', function() {
	return function(input) {
		var type = "";
		if (input) {
			type = input;
		} else {
			type = "无";
		}

		return type;
	}
});
