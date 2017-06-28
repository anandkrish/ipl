var premLeag = angular.module("premierLeague",['ui','ui.filters']);


premLeag.controller('baseController', ['$scope', 'saveCsv',function($scope,saveCsv){
	var allMatches=[];
	$scope.iplHisYear=false;
	
	$scope.liveMatches=[];
	$scope.iplYearList=[];

	saveCsv.loadCsv().then(
		function(vals){
				var allTextLines = vals.split(/\r\n|\n/);
				var headers = allTextLines[0].split(',');
				for(var i=1;i<allTextLines.length;i++){
					var values=allTextLines[i].split(',');
					var obj={};
					if(headers.length == values.length){
						for(var j=0;j<headers.length;j++){
							obj[headers[j]]=values[j];
							
							
						}
						allMatches.push(obj);

					}
				}
				
				localStorage.setItem("savedData", JSON.stringify(allMatches));
				//console.log(localStorage.getItem("savedData"));
				loadLiveMatches();
				loadIplHistory();
				
			});

	function loadLiveMatches(){
		var matchesArr= JSON.parse(localStorage.getItem("savedData"));
				for (var i=0;i<5;i++){
					$scope.liveMatches.push(matchesArr[i]);
				}

	}

	function loadIplHistory(){
		var iplYear=JSON.parse(localStorage.getItem("savedData"));
			for(var i=0;i<iplYear.length;i++){
				$scope.iplYearList.push(iplYear[i].season);
			}
	}
	
	
	$scope.loadIplHistoryOfYear=function (){
		//console.log(this.iplYear);
		$scope.iplHisYear= true;
		$scope.matchOfSeason=[];
		$scope.selectedYear=this.iplYear;
		$scope.matchOfSeason=filterArray(JSON.parse(localStorage.getItem("savedData")),{season:this.iplYear});



	}	
				
	function filterArray(obj,param){
		return obj.filter(function(obj){
			return Object.keys(param).every(function(c){
				return obj[c] == param[c];
			})
		})
	}
	
	
}]);

premLeag.factory('saveCsv', ['$http', function($http){
	
	return {
		loadCsv:function(){
			return $http({
				method: 'GET',
				url :'/data/matches.csv'
			}).then(function(response){
					return response.data;
			});
		}
	};
}])

