'use strict';

var transformRequest = function(data) {
  if (data === undefined)
    return data;

  var fd = new FormData();
  angular.forEach(data, function(value, key) {
    if (value instanceof FileList) {
      if (value.length === 1) {
        fd.append(key, value[0]);
      } else {
        angular.forEach(value, function(file, index) {
          fd.append(key + '_' + index, file);
        });
      }
    } else {
      fd.append(key, value);
    }
  });
  return fd;
};

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('products/:productId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      save: { 
        method: 'POST', 
        transformRequest: transformRequest,
        headers: {'Content-Type': undefined }
      } 
		});
	}
]);
