///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import {User} from '../models/user'
import UserResource from '../resources/user-resource'
import Dialog from '../services/dialog'

class Signup {
	private user: User = {id: null, mail: '', password: ''}
	private mail: string
	private password: string
	static $inject = ['$rootScope', '$scope', '$element', '$timeout', 'dialog', 'userResource']

	constructor(
		private rootScope: ng.IRootScopeService,
		private scope: ng.IScope,
		private element: ng.IRootElementService,
		private timeout: ng.ITimeoutService,
		private dialog: Dialog,
		private userResources: UserResource) {
	}

	private signup() {
		this.userResources.signup(this.user, (user)=> {
			this.rootScope.$broadcast('logedIn', user)
			this.dialog.hide()
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
