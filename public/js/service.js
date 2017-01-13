angular.module('applicationService.services', [])
    .factory('API', function ($http) 
    {
	  	var base = "http://localhost:8080/";
        //   var base = "http://139.59.11.3:3500/";
        return  {
				getDetails : function (url,params) {
					return $http.get(base+url,
                    {
                        method : 'GET',  
                        headers:{'Content-Type': 'application/json'},
                        params: params
                    });
				},
				postDetails : function (form,url) {
					return $http.post(base+url,
                    form,
                    {
                        method : 'POST',  
                        headers:{'Content-Type': 'application/json'}
                    });
				},
                
			}
    })    



    