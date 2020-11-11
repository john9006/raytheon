function($scope,spUtil) {
  /* widget controller */
  var c = this;
	
	$scope.pageNo = 1;
	
	$scope.searching = false;
		
	//Retrieve initial tree list
	getPage($scope.pageNo,'');	
	
	//the form field wbs_items needs to be updated with the selected items	
	$scope.$watch('dep.currentNode', function( newObj, oldObj ) {
    if( $scope.dep && angular.isObject($scope.dep.currentNode)) {
			var id = $scope.dep.currentNode.id;
			var depID = $scope.dep.currentNode.depID;
			var selected = $scope.page.g_form.getValue('u_wbs');
			var sysIDs = '';
			var labels = '';
		
			
			//Get server to build new value/label pairs to insert into list collector
			c.server.get({id:id,selected:selected}).then(function(r) {				
				sysIDs = r.data.sys_ids;
				labels = r.data.labels;
				$scope.page.g_form.setValue('u_wbs',sysIDs,labels);
			});			
    }
	}, false);
	
	$scope.$watch(function () {    
	return $scope.page.g_form.getValue('u_project');    
	}, function (value) {
	  //console.log('>> u_project has changed to + u_project ' + value );
		$scope.u_project = value;
		// launch the tree construction for the selected project
		getPage($scope.pageNo,'',$scope.u_project);	
		
	});
	
	//$scope.getPage = function(pageNumber) {
	$scope.getPage = function(pageNumber,u_project) {
		$scope.pageNo = pageNumber;
		//getPage($scope.pageNo,$scope.data.filter);
		//console.log('in $scope.getPage u_project value is ' + u_project);
		getPage($scope.pageNo,$scope.data.filter, u_project);
	}
	
	$scope.nextPage = function() {
		$scope.pageNo++;
		$scope.newPageNumber = $scope.pageNo;
		getPage($scope.pageNo,$scope.data.filter);	
		
	}
	
	// triggered by change in filter input in html template if > 1 char
	$scope.getFilter = function() {
		var filter = $scope.data.filter;
		if (filter.length == 1) //Dont search for only 1 character
			return;
		$scope.pageNo = 1;
		$scope.searching = true;
		getPage($scope.pageNo,filter,$scope.u_project);	
	}	
	
	function getPage(page,filter,u_project) {
		//used to build the initial tree
		console.log('in function getPage(page,filter,u_project u_project is  ' + u_project);
		c.server.get({page:page,filter:filter,u_project:u_project}).then(function(r) {			
			$scope.searching = false;
			$scope.data.treedata = r.data.treedata;
			$scope.data.count = r.data.count;
			$scope.data.pageSize = r.data.pageSize;
		});	
	}
}