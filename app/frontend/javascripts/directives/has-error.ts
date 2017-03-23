///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

class HasError {
	static $inject = ['$scope', '$element']

	constructor(private scope: ng.IScope, private element: ng.IRootElementService) {
		this.scope.$watch('hasError', (newValue) => {
			console.log(true)
			newValue ? this.element.addClass('has-error') : this.element.removeClass('has-error')
		})
	}
}

angular.module('App').directive('hasError', () => {
	return {
		restrict: 'A',
		scope: {
			hasError: '='
		},
		controller: HasError,
		controllerAs: 'hasError'
	}
})