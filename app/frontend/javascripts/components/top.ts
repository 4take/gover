///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

class Top {
	static $inject = ['$rootScope', '$scope', '$element', '$timeout', 'dialog', 'userResource']

	constructor(
		private rootScope: ng.IRootScopeService,
		private scope: ng.IScope,
		private element: ng.IRootElementService,
		private timeout: ng.ITimeoutService) {
	}
}

let app = angular.module('App')
app.component('top', {
	controller: Top,
	bindings: {},
	template:
		`
	<section>
		<img src="main.png" class="img-main"/>
	</section>
	<section>
		<div layout="row" layout-align="center center">
			<h2>住所の変更にはもう飽きたろう？</h2>
		</div>
	</section>
		`
})
