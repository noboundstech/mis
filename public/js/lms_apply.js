angular.module('leaveController', ['applicationService.services'])
.controller('lms_apply', function($scope,$http,MyService,$routeParams,$location,$localStorage,$rootScope,API,APPLICATION_CONSTANT)
{
	$scope.user_emp_name = localStorage.getItem('user_emp_name');
	$scope.user_emp_id = localStorage.getItem('user_emp_id');
	$scope.edit_leave_Details 	= {};
	$scope.apply_leave 		 	= {};
	$scope.Holiday_List     	= {};
	$rootScope.authenticateUser();
	$scope.show_loader 			= true;
	$scope.apply_leave.token  	= localStorage.getItem('token');
	$scope.page_title 			= APPLICATION_CONSTANT.page_Leave_Apply;
//	$scope.add_user.user_role   = "CSR";
    $scope.show_edit_button = 'no';
	$scope.Half_Day = [{
							"name" : "Yes",
							"value" : "Y"
						},
						{
							"name" : "No",
							"value" : "N"
											
						}];
	$scope.Leave_Status = [{"name" :'APPLIED',
							"value":'APPLIED'},
						   {"name" :'APPROVED',
 							"value":'APPROVED'},
						   {"name" :'CANCEL',
 							"value":'CANCEL'},
						   {"name" :'DECLINED',
 							"value":'DECLINED'}
						   ];
	$scope.Leave_Type   = [{"name" :'CL',
							"value":'CL'},
						   {"name" :'FL',
 							"value":'FL'},
						   {"name" :'ML',
 							"value":'ML'},
 						   {"name" :'EL',
 							"value":'EL'},
						   {"name" :'OH',
 							"value":'OH'}
						   ];					   
    var current_date 	= new Date();
    $scope.curr_date=current_date.getMonth()+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.apply_leave.from_date = current_date.getFullYear() + "-" + ('0' + (current_date.getMonth() + 1)).slice(-2) + "-" + ('0' + current_date.getDate()).slice(-2);
	$scope.apply_leave.to_date 	 = current_date.getFullYear() + "-" + ('0' + (current_date.getMonth() + 1)).slice(-2) + "-" + ('0' + current_date.getDate()).slice(-2);
 	$scope.apply_leave.Leave_Status = $scope.Leave_Status[0].name;
 	$scope.apply_leave.Leave_Type   = $scope.Leave_Type[0].name;
 	$scope.apply_leave.half_day_flag =$scope.Half_Day[1].value;
 	$scope.apply_leave.nofdays= 1;
	$scope.details = { "token" 		: localStorage.getItem('token')};


	$scope.leaveDetailList = function()
	{
		API.postDetails($scope.details,"lms/getLeaveDetails").then(function successCallback(response) {
			$scope.show_loader = false;
			$scope.leave_list = response.data.response_data.details;
		    
			$scope.leave_bal_year = response.data.response_data.Leave_bal_year;
			$scope.leave_bal_today = response.data.response_data.Leave_bal_todate;
			if (response.data.response_data.details == $scope.Leave_Status[0].name)
			{
			    $scope.show_edit_button = 'yes';
			}
			else
			{
				$scope.show_edit_button = 'no';
			}
			    
		}, function errorCallback(response) {
		});
		API.getDetails("api/getEmpMgrList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
			
			if(response.status == 200)
			{    
			   
				$scope.Manager_id_Leave  = response.data.response_data.details;
					
			}
			else
			{
				$scope.show_loader = false;
				// show error message
			}
		}, function errorCallback(response) {
			$scope.show_loader = false;
		});
		API.getDetails("api/getHolidayList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
			
			if(response.status == 200)
			{    
			   
				$scope.Holiday_List  = response.data.response_data.details;
					
			}
			else
			{
				$scope.show_loader = false;
				// show error message
			}
		}, function errorCallback(response) {
			$scope.show_loader = false;
		});
	}

	$scope.leaveDetailList();
	$scope.ChangeFromToDate= function(f_date,t_date,l_type)
	{  $scope.error = '';
		if(MyService.compareTwoDate(f_date,t_date)== 'error')
		{
			$scope.error = "To date must be greater than From date";
			return false;
		}
	
		var str1=f_date.split("-");
		var str2=t_date.split("-");
		var float_leave_err = 'Y';
		var  m_from_date =new Date(str1[0],Math.abs(str1[1]) -1,str1[2]);
		var  m_to_date =new Date(str2[0],Math.abs(str2[1]) -1,str2[2]);
		var timeDiff  = Math.abs(m_to_date.getTime() - m_from_date.getTime());   
        var dayDiff   = Math.ceil(timeDiff / (1000 * 3600 * 24))+1;
        console.log('dayDiff1 :',dayDiff)	
		var h_list=[];
		    h_list=$scope.Holiday_List; 
		    var h_cnt=0 ,
		        sun_cnt =0;
		console.log('$scope.Holiday_List :',$scope.Holiday_List)        
			for(i=0;i<h_list.length;i++)
				{
                   if ((f_date == h_list[i].holiday_date ||
                   	    t_date == h_list[i].holiday_date) &&  holiday_type[i] != 'FLOATING' )
                    {	h_cnt++;
                    }
                    if (l_type == 'FL')
                    {
                    	if ((f_date == h_list[i].holiday_date &&
                   	         t_date == h_list[i].holiday_date) &&  holiday_type[i] == 'FLOATING' )
                    	{
                              float_leave_err = 'N';
                    	}

                    }
                    	
				}	
                    
			var nextDay = new Date(m_from_date);	
			for(j=0;j < dayDiff;j++ )
			 {
			 	nextDay.setDate(m_from_date.getDate()+j);
			 	var d = nextDay.getDay();
			 	if (d == 0)
			 	{
			 		sun_cnt ++;
			 	}
			 }	
		dayDiff = dayDiff - ( h_cnt + sun_cnt);
	
		$scope.apply_leave.nofdays= dayDiff;
         if (l_type == 'FL' && float_leave_err == 'Y')
         {
            $scope.error = "For Leave Type FL From date and To Date Not Floating Leave";
			return false;
         }

		return true		
	}
	
	$scope.CancelLeave = function(leave_data,status)
	{
	
		$scope.error = '';
		$scope.show_apply_leave_loader = true;
		$scope.edit_user_Details = leave_data;
		$scope.edit_user_Details.leave_status=status;
		$scope.edit_user_Details.token = localStorage.getItem('token');
		console.log('$scope.edit_user_Details :',$scope.edit_user_Details)
		API.postDetails($scope.edit_user_Details,"lms/cancelLeaveApply").then(function successCallback(response) {
			$scope.show_apply_leave_loader = false;
			if(response.status == 200)
			{
				$scope.leaveDetailList();
				alert("Leave Cancelled successfully");

			}
			else
			{    
				$scope.error = response.data.message;
			}
		}, function errorCallback(response) {
		});
	}
	$scope.initLeaveApply = function()
	{
		$scope.error = '';
	}
	$scope.applyNewLeave = function()
	{
		$scope.error = '';

		console.log('apply_leave :',$scope.apply_leave)
		if(typeof $scope.apply_leave.from_date =='undefined' || $scope.apply_leave.from_date =='' || $scope.apply_leave.from_date == null)
		{
			$scope.error = "Please select from date.";
			return false;
		}
		if(typeof $scope.apply_leave.to_date =='undefined' || $scope.apply_leave.to_date =='' || $scope.apply_leave.to_date == null)
		{
			$scope.error = "Please select to date.";
			return false;
		}
		
		if(typeof $scope.apply_leave.leave_Manager =='undefined' || $scope.apply_leave.leave_Manager =='' || $scope.apply_leave.leave_Manager == null)
		{
			$scope.error = "Please select the Approval employee Manager.";
			return false;
		}
	
		if(  $scope.apply_leave.half_day_flag =='Y' && $scope.apply_leave.nofdays > 1)
		{

			$scope.error = "For Half Day Yes Date range should be 1 day";
			return false;
		}
		
		if( MyService.compareTwoDate($scope.apply_leave.from_date,$scope.apply_leave.to_date)== 'error')
		{
			$scope.error = "To date must be greater than From date";
			return false;
		}

		$scope.show_apply_leave_loader = true;
		console.log('bef validateLeaveApply');
		API.postDetails($scope.apply_leave,"lms/validateLeaveApply").then(function successCallback(response) {
			$scope.show_apply_leave_loader = false;
			if(response.status == 200)
			{
			  	API.postDetails($scope.apply_leave,"lms/applyLeave").then(function successCallback(response) {
					$scope.show_apply_leave_loader = false;
					if(response.status == 200)
					{
					/*	API.postDetails($scope.details,"lms/getLeaveDetails").then(function successCallback(response) {
							$scope.show_loader = false;
							$scope.leave_list = response.data.response_data.details;
						}, function errorCallback(response) {
						});*/
						$scope.leaveDetailList();
						document.getElementById("close_apply_leave").click();
						alert("Leave applied successfully");

					}
					else
					{
						$scope.error = response.data.response_data.message;
					}
				}, function errorCallback(response) {

				});
			}
			else
			{
				$scope.error = response.data.response_data.message;
			}
		}, function errorCallback(response) {
		});
		
	}

	
})

.controller('lms_approve', function($scope,$http,MyService,$routeParams,$location,$localStorage,$rootScope,API,APPLICATION_CONSTANT)
{
	$scope.user_emp_name = localStorage.getItem('user_emp_name');
	$scope.user_emp_id = localStorage.getItem('user_emp_id');
	$scope.edit_leave_Details 	= {};
	$scope.apply_leave 		 	= {};
	$scope.Holiday_List     	= {};
	$rootScope.authenticateUser();
	$scope.show_loader 			= true;
	$scope.apply_leave.token  	= localStorage.getItem('token');
	$scope.page_title 			= APPLICATION_CONSTANT.page_Leave_Approve;
//	$scope.add_user.user_role   = "CSR";
	$scope.Half_Day = [{
							"name" : "Yes",
							"value" : "Y"
						},
						{
							"name" : "No",
							"value" : "N"
											
						}];
	$scope.Leave_Status = [{"name" :'APPLIED',
							"value":'APPLIED'},
						   {"name" :'APPROVED',
 							"value":'APPROVED'},
						   {"name" :'CANCEL',
 							"value":'CANCEL'},
						   {"name" :'DECLINED',
 							"value":'DECLINED'}
						   ];
	$scope.Leave_Type   = [{"name" :'CL',
							"value":'CL'},
						   {"name" :'FL',
 							"value":'FL'},
 						   {"name" :'EL',
 							"value":'EL'},
						   {"name" :'ML',
 							"value":'ML'},
						   {"name" :'OH',
 							"value":'OH'}
						   ];					   
    var current_date 	= new Date();
    $scope.curr_date=current_date.getMonth()+"-"+current_date.getDate()+"-"+current_date.getFullYear();
	$scope.apply_leave.from_date = current_date.getFullYear() + "-" + ('0' + (current_date.getMonth() + 1)).slice(-2) + "-" + ('0' + current_date.getDate()).slice(-2);
	$scope.apply_leave.to_date 	 = current_date.getFullYear() + "-" + ('0' + (current_date.getMonth() + 1)).slice(-2) + "-" + ('0' + current_date.getDate()).slice(-2);
 	$scope.apply_leave.Leave_Status = $scope.Leave_Status[0].name;
 	$scope.apply_leave.Leave_Type   = $scope.Leave_Type[0].name;
 	$scope.apply_leave.half_day_flag =$scope.Half_Day[1].value;
 	$scope.apply_leave.nofdays= 1;
	$scope.details = { "token" 		: localStorage.getItem('token')};

	$scope.leaveApproveDetailList = function()
	{
	API.postDetails($scope.details,"lms/getApproveDetails").then(function successCallback(response) {
		$scope.show_loader = false;
		$scope.leave_list = response.data.response_data.details;
	
		$scope.leave_bal_year = response.data.response_data.Leave_bal_year;
		$scope.leave_bal_today = response.data.response_data.Leave_bal_todate;
	}, function errorCallback(response) {
	});

	API.getDetails("api/getHolidayList",{token : localStorage.getItem('token')}).then(function successCallback(response) {
		
		if(response.status == 200)
		{    
		   
			$scope.Holiday_List  = response.data.response_data.details;
				
		}
		else
		{
			$scope.show_loader = false;
			// show error message
		}
	}, function errorCallback(response) {
		$scope.show_loader = false;
	});

    }
    $scope.leaveApproveDetailList();
	$scope.DeclineLeave = function(leave_data,status)
	{
	
		$scope.error = '';
		$scope.show_apply_leave_loader = true;
		$scope.edit_user_Details = leave_data;
		$scope.edit_user_Details.leave_status=status;
		$scope.edit_user_Details.token = localStorage.getItem('token');
		API.postDetails($scope.edit_user_Details,"lms/cancelLeaveApply").then(function successCallback(response) {
			$scope.show_apply_leave_loader = false;
			if(response.status == 200)
			{
			//	API.postDetails($scope.details,"lms/getApproveDetails").then(function successCallback(response) {
			//		$scope.show_loader = false;
			//		$scope.leave_list = response.data.response_data.details;
			//	}, function errorCallback(response) {
			//	});
				$scope.leaveApproveDetailList();
				alert("Leave Declined/Cancelled successfully");

			}
			else
			{
				$scope.error = response.data.message;
			}
		}, function errorCallback(response) {
		});
	}
	$scope.ApproveLeave = function(leave_data,status)
	{
	
		$scope.error = '';
		$scope.show_apply_leave_loader = true;
		$scope.edit_user_Details = leave_data;
		$scope.edit_user_Details.leave_status=status;
		$scope.edit_user_Details.token = localStorage.getItem('token');
		API.postDetails($scope.edit_user_Details,"lms//updateLeaveApply").then(function successCallback(response) {
			$scope.show_apply_leave_loader = false;
			if(response.status == 200)
			{
			//	API.postDetails($scope.details,"lms/getApproveDetails").then(function successCallback(response) {
			//		$scope.show_loader = false;
			//		$scope.leave_list = response.data.response_data.details;
			//	}, function errorCallback(response) {
			//	});
				$scope.leaveApproveDetailList();
				alert("Leave Approved successfully");

			}
			else
			{
				$scope.error = response.data.message;
			}
		}, function errorCallback(response) {
		});
	}
	})
