///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

class ScrollOpacityChanger {
	static $inject = ['$scope', '$compile', '$element', '$attrs']
	constructor(
		private scope: ng.IScope,
		private compile: ng.ICompileService,
		private element: ng.IRootElementService,
		private attrs: ng.IAttributes) {

		let from = this.scope.$eval(this.attrs['from']) || 0
		let to = this.scope.$eval(this.attrs['to']) || 1

		this.element.css({opacity: document.body.scrollTop ? to : from })

		angular.element(window).scroll(()=> {
			this.element.css({opacity: document.body.scrollTop ? to : from })
		})
	}
}

let app = angular.module('App')
app.directive('scrollOpacityChanger', () => {
	return {
		restrict: 'A',
		scope: false,
		controller: ScrollOpacityChanger,
		bindToController: true
	}
})
