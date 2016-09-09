///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

class AutoDivider {
	private height: any
	static $inject = ['$scope', '$element', '$timeout']
	constructor(
		private scope: ng.IScope,
		private element: ng.IRootElementService,
		private timeout: ng.ITimeoutService) {

		//let header = angular.element(document.getElementsByTagName('header'))
		//document.getElementsByTagName('header').item(0).siz
		$('header').resize(()=> {
			this.setDividerHeight()
		})
		$(window).resize(()=> {
			this.setDividerHeight()
		})
		this.setDividerHeight()
	}

	private setDividerHeight() {
		this.timeout(()=> {
			this.height = $('header').height() || 64
		})
	}
}

let app = angular.module('App')
app.component('autoDivider', {
	controller: AutoDivider,
	bindings: {
	},
	template:
		`<div style="height:{{$ctrl.height}}"></div>`
})
