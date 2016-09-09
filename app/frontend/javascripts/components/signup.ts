///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import {User} from '../models/user'
import UserResource from '../resources/user-resource'

class Signup {
	private user: User = {mail: '', password: ''}
	private mail: string
	private password: string
	static $inject = ['$scope', '$element', '$timeout', 'userResource']

	constructor(private scope: ng.IScope,
		private element: ng.IRootElementService,
		private timeout: ng.ITimeoutService,
		private userResources: UserResource) {
	}

	private signup() {
		console.log('きたよ')
		this.userResources.signup(this.user, ()=> {
			console.log('きたよ')
		})
	}
}

let app = angular.module('App')
app.component('signup', {
	controller: Signup,
	bindings: {},
	template: `
		<md-content class="container-signup">
			<md-input-container class="md-block">
				<label>mail</label>
				<input ng-model="$ctrl.user.mail" type="mail" placeholder="Mail (required)" ng-required="true">
			</md-input-container>
			<md-input-container class="md-block">
				<label>password</label>
				<input ng-model="$ctrl.user.password" type="password" placeholder="Password (required)" ng-required="true">
			</md-input-container>
			<div layout="row" layout-align="center center">
				<md-button class="md-raised md-accent" ng-click="$ctrl.signup()">Sign me up!</md-button>
			</div>
		</md-content>
		`
})
