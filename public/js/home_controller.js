angular.module('homeController', ['applicationService.services'])
.controller('home', function($scope)
{
  $scope.details ="i am in home";
})
.controller('login', function($scope,API,$location,$rootScope)
{
	$scope.details ="Login to Your Account";
	$scope.login = {};
	 $scope.user_access =[];
	$scope.Loader = false;
	$rootScope.user_emp_name =' ';
	$scope.loginUser = function(){
		// doing validation of the form
		$scope.error = '';
		if(typeof $scope.login.username =='undefined' || $scope.login.username =='' || $scope.login.username ==null)
		{
			$scope.error = "Please enter the username";
			return false;
		}
		
		if(typeof $scope.login.password =='undefined' || $scope.login.password =='' || $scope.login.password ==null)
		{
			$scope.error = "Please enter your password";
			return false;
		}
		$scope.Loader = true;
		// calling api 
		API.postDetails($scope.login,"userLogin/login").then(function successCallback(response) {
			$scope.Loader = false;
			if(response.status == 200)
			{
				$rootScope.user_name = $scope.login.username;
			//	localStorage.setItem('csr_name', JSON.stringify(response.data.response_data.user_details[0].userName));
			//	localStorage.setItem('user_emp_id', JSON.stringify(response.data.response_data.user_details.emp_id));
				localStorage.setItem('token', response.data.response_data.token);
			  /*	if(response.data.response_data.user_details[0].userRole == 'Admin')
				{
					localStorage.setItem('user_role',"admin");
				}
				else
				{
					localStorage.setItem('user_role',"csr");
				}*/
				localStorage.setItem('last_login',response.data.response_data.user_details.last_signin_datetime);

            
				 $location.url("dashboard");
			
			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		    // this callback will be called asynchronously
		    // when the response is available
		}, function errorCallback(response) {
			console.log(response);
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
})
.controller('forget_password', function($scope,API,$location,$rootScope)
{
	$scope.login = {};
	$scope.Loader = false;
	$scope.forgetPassword = function()
	{
		$scope.error = '';
		if(typeof $scope.email =='undefined' || $scope.email =='' || $scope.email ==null)
		{
			$scope.error = "Please enter your Email Id.";
			return false;
		}
		$scope.Loader = true;
		API.postDetails({email : $scope.email},"userLogin/forget_password").then(function successCallback(response) {
			console.log(response);
			$scope.Loader = false;
			if(response.status == 200)
			{

				$scope.success = response.data.response_data.message;
			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		});
		
	}
})

.controller('dashboard', function($scope,$localStorage,$rootScope,API)
{
	$rootScope.authenticateUser();
	
	$scope.show_employee			= 'yes';
	$scope.show_hr_admin			= 'no';
	$scope.show_project_admin 		= 'no';
	$scope.show_system_admin		= 'no';
	$scope.disp_emp_name =' ';
    API.getDetails("userLogin/getUserAccess",{token : localStorage.getItem('token')}).then(function successCallback(response) {
        if(response.status == 200)
        {  
            if (response.data.response_data.length > 0)
            {
               for(i=0; i< response.data.response_data.length;i++)
               {
               		if(response.data.response_data[i].user_type == 'HRADMIN')
               		{
               			$scope.show_hr_admin = 'yes';
               		}
               		if(response.data.response_data[i].user_type == 'PRJADMIN')
               		{
               			$scope.show_project_admin = 'yes';
               		}
               		if(response.data.response_data[i].user_type == 'SYSADMIN')
               		{
               			$scope.show_system_admin = 'yes';
               		}
                  
               }
               	/* var login_user = {     user_emp_id : response.data.response_data[0].emp_id,
               	 						user_name  : response.data.response_data[0].emp_name
          						 	};*/
    				localStorage.setItem('user_emp_id', JSON.stringify(response.data.response_data[0].emp_id));
    				localStorage.setItem('user_emp_name', response.data.response_data[0].emp_name);

    				$scope.disp_emp_name = response.data.response_data[0].emp_name;
            }
            
        }	
        else 
        {  
           // error message
        }	
     });
	
})

.controller('work_in_progress', function($scope,$localStorage,$rootScope)
{
	$rootScope.authenticateUser();
	$location.url("work_in_progress");
	
})