angular.module('adminController', ['applicationService.services'])
.controller('user_admin', function($scope,$http,$routeParams,$location,$localStorage,$rootScope,API,APPLICATION_CONSTANT)
{
	//$scope.user_type 			= localStorage.getItem('user_type');
	//$scope.user_name 			= localStorage.getItem('csr_name');
	$scope.edit_user_Details 	= {};
	$scope.add_user 		 	= {};
	$rootScope.authenticateUser();
	$scope.show_loader 			= true;
	$scope.add_user.token  		= localStorage.getItem('token');
	$scope.page_title 			= APPLICATION_CONSTANT.page_user_admin;
//	$scope.add_user.user_role   = "CSR";
	$scope.Active_Status = [{
							"name" : "ACTIVE",
							"value" : "ACTIVE"
						},
						{
							"name" : "INACTIVE",
							"value" : "INACTIVE"
						},
						{
							"name" : "DISABLED",
							"value" : "DISABLED"
						},
						{
							"name" : "LOCKED",
							"value" : "LOCKED"
						},
						{
							"name" : "CLOSED",
							"value" : "CLOSED"
						}];
	$scope.Active_Status_reason = [{"name" :'Locked due to unsuccessful login',
									"value":'Locked due to unsuccessful login'},
								   {"name" :'Inactive new user',
 									"value":'Inactive new user'},
								   {"name" :'Activated new user',
 									"value":'Activated new user'},
								   {"name" :'Disabled as unused for long time',
 									"value":'Disabled as unused for long time'},
								   {"name" :'Disabled due to other reason',
 									"value":'Closed as user account'}];


 	$scope.add_user.Active_Status = $scope.Active_Status[0].name;
 	$scope.add_user.Active_Status_reason = $scope.Active_Status_reason[2].name;
	$scope.details = { "token" 		: localStorage.getItem('token')};
	API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
		$scope.show_loader = false;
		$scope.user_list = response.data.response_data.details;
	}, function errorCallback(response) {
	});
	API.getDetails("api/getEmpList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		
		if(response.status == 200)
		{    
		    $scope.Emp_id_List		= response.data.response_data.details;
			$scope.Manager_id_List  = response.data.response_data.details;
				
		}
		else
		{
			$scope.show_loader = false;
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

	$scope.EditUserData = function(data)
	{
		console.log('data :',data)
		$scope.error = '';
		$scope.edit_user_Details = data;
		console.log('$scope.edit_user_Details :',$scope.edit_user_Details)

		$scope.edit_user_Details.token = localStorage.getItem('token');
	}
	$scope.AddNewUser = function()
	{
		$scope.error = '';
	}
	$scope.addNewUser = function()
	{
		$scope.error = '';
		console.log('add_user :',$scope.add_user)
		if(typeof $scope.add_user.add_user_id =='undefined' || $scope.add_user.add_user_id =='' || $scope.add_user.add_user_id == null)
		{
			$scope.error = "Please enter the user id.";
			return false;
		}
		if(typeof $scope.add_user.password =='undefined' || $scope.add_user.password =='' || $scope.add_user.password == null)
		{
			$scope.error = "Please enter user password.";
			return false;
		}
		if(typeof $scope.add_user.email_id =='undefined' || $scope.add_user.email_id =='' || $scope.add_user.email_id == null)
		{
			$scope.error = "Please enter user emailId.";
			return false;
		}
		if(typeof $scope.add_user.user_Manager =='undefined' || $scope.add_user.user_Manager =='' || $scope.add_user.user_Manager == null)
		{
			$scope.error = "Please select the user Manager.";
			return false;
		}
		$scope.show_add_user_loader = true;
		API.postDetails($scope.add_user,"userAdmin/addNewUser").then(function successCallback(response) {
			$scope.show_add_user_loader = false;
			if(response.status == 200)
			{
				API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
					$scope.show_loader = false;
					$scope.user_list = response.data.response_data.details;
				}, function errorCallback(response) {
				});
				document.getElementById("close_add_user").click();
				alert("added successfully");

			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		}, function errorCallback(response) {
		});
	}

	$scope.updateUserDetail = function()
	{
		$scope.error = '';

		/*
		if(typeof $scope.edit_user_Details.userName =='undefined' || $scope.edit_user_Details.userName =='' || $scope.edit_user_Details.userNameedit_user_Details == null)
		{
			$scope.error = "Please enter the username.";
			return false;
		}
		*/
		if(typeof $scope.edit_user_Details.user_pwd =='undefined' || $scope.edit_user_Details.user_pwd =='' || $scope.edit_user_Details.user_pwd == null)
		{
			$scope.error = "Please enter user password.";
			return false;
		}
		if(typeof $scope.edit_user_Details.email_id =='undefined' || $scope.edit_user_Details.email_id =='' || $scope.edit_user_Details.email_id == null)
		{
			$scope.error = "Please enter user emailId.";
			return false;
		}
		if(typeof $scope.edit_user_Details.active_status =='undefined' || $scope.edit_user_Details.active_status =='' || $scope.edit_user_Details.active_status == null)
		{
			$scope.error = "Please select the user active status.";
			return false;
		}
		if(typeof $scope.edit_user_Details.active_status_reason =='undefined' || $scope.edit_user_Details.active_status_reason =='' || $scope.edit_user_Details.active_status_reason == null)
		{
			$scope.error = "Please select user active status reason.";
			return false;
		}
		$scope.show_edit_user_loader = true;
		API.postDetails($scope.edit_user_Details,"userAdmin/updateUserDetails").then(function successCallback(response) {
			$scope.show_edit_user_loader = false;
			if(response.status == 200)
			{
				API.postDetails($scope.details,"api/getUserDetails").then(function successCallback(response) {
					$scope.user_list = response.data.response_data.details;
				}, function errorCallback(response) {
				});
				document.getElementById("close_edit_model").click();
				alert("user details updated successfully");
			}
			else
			{
				$scope.error = response.data.message;
			}
		}, function errorCallback(response) {
		});
	}
})