///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import {User} from '../models/user'
import UserResource from '../resources/user-resource'
import Dialog from '../services/dialog'

class Login {
	private user: User = {id: null, mail: '', password: ''}
	static $inject = ['$rootScope', '$scope', '$element', '$timeout', 'dialog', 'userResource']

	constructor(
		private rootScope: ng.IRootScopeService,
		private scope: ng.IScope,
		private element: ng.IRootElementService,
		private timeout: ng.ITimeoutService,
		private dialog: Dialog,
		private userResource: UserResource) {
	}

	private login() {
		this.userResource.login(this.user, (user)=> {
			this.rootScope.$broadcast('logedIn', user)
			this.dialog.hide()
		})
	}
}

let app = angular.module('App')
app.component('login', {
	controller: Login,
	bindings: {},
	template: `
		<md-content class="container-login">
			<md-input-container class="md-block">
				<label>mail</label>
				<input ng-model="$ctrl.user.mail" type="mail" placeholder="Mail (required)" ng-required="true" has-error="$ctrl.user.mail == 'わさわーさ'">
			</md-input-container>
			<md-input-container class="md-block">
				<label>password</label>
				<input ng-model="$ctrl.user.password" type="password" placeholder="Password (required)" ng-required="true">
			</md-input-container>
			<div layout="row" layout-align="center center">
				<md-button class="md-raised md-accent" ng-click="$ctrl.login()">Sign me in!</md-button>
			</div>
		</md-content>
		`
})
