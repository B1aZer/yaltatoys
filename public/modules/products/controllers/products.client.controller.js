'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', '$upload',
	function($scope, $stateParams, $location, Authentication, Products, $upload) {
		$scope.authentication = Authentication;

    $scope.onFileSelect = function(image) {
      if (angular.isArray(image)) {
        image = image[0];
      }

      // This is how I handle file types in client side
      if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
        alert('Only PNG and JPEG are accepted.');
        return;
      }

      $scope.uploadInProgress = true;
      $scope.uploadProgress = 0;

      $scope.upload = $upload.upload({
        url: '/upload/image',
        method: 'POST',
        file: image
      }).progress(function(event) {
        $scope.uploadProgress = Math.floor(event.loaded / event.total);
        $scope.$apply();
      }).success(function(data, status, headers, config) {
        $scope.uploadInProgress = false;
        // If you need uploaded file immediately
        $scope.uploadedImage = JSON.parse(data);
      }).error(function(err) {
        $scope.uploadInProgress = false;
        console.log('Error uploading file: ' + err.message || err);
      });
    };

		// Create new Product
		$scope.create = function() {
			// Create new Product object
      console.log(this);
			var product = new Products ({
				name: this.name,
				description: this.description,
        file: this.file
			});

			// Redirect after save
			product.$save(function(response) {
				$location.path('products/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Product
		$scope.remove = function(product) {
			if ( product ) {
				product.$remove();

				for (var i in $scope.products) {
					if ($scope.products [i] === product) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({
				productId: $stateParams.productId
			});
		};
	}
]);
