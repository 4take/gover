/// <reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import Dialog from '../services/dialog'

export default class AppCtrl {
    static $inject = ['$rootScope', '$scope', '$cookies', '$window', '$timeout', '$location', 'dialog']
    constructor(
        private rootScope: ng.IRootScopeService,
        private scope: ng.IScope,
        private cookies: ng.cookie.CookieService,
        private window: ng.IWindowService,
        private timeout: ng.ITimeoutService,
        private location: ng.ILocationService,
        private dialog: Dialog) {

        angular.element(window).scroll(()=> {
            this.switchHeaderStyle()
        })

        this.timeout(()=> {
            this.switchHeaderStyle()
        })
    }

    login() {
        this.dialog.show('Sign In', '<login></login>')
    }

    signup() {
        this.dialog.show('Sign Up', '<signup></signup>')
    }

    private switchHeaderStyle() {
        document.body.scrollTop ? $('header').addClass('is-scroll') : $('header').removeClass('is-scroll')
    }
}

let app = angular.module('App');
app.controller('AppCtrl', AppCtrl)
