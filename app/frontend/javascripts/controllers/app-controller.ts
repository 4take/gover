/// <reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import Dialog from '../services/dialog'
import {User} from '../models/user'

export default class AppCtrl {
    get logedIn(): boolean {
        return this.cookies.get('goverUserId') != null
    }
    static $inject = ['$rootScope', '$scope', '$cookies', '$window', '$timeout', '$location', 'dialog']
    constructor(
        private rootScope: ng.IRootScopeService,
        private scope: ng.IScope,
        private cookies: any,
        private window: ng.IWindowService,
        private timeout: ng.ITimeoutService,
        private location: ng.ILocationService,
        private dialog: Dialog
        ) {

        angular.element(window).scroll(()=> {
            this.switchHeaderStyle()
        })

        this.timeout(()=> {
            this.switchHeaderStyle()
        })

        this.scope.$on('logedIn',(event: ng.IAngularEvent, user: User)=> {
            this.cookies.put('goverUserId', user.id)
            this.cookies.put('goverUserMail', user.mail)
        })
    }

    login() {
        this.dialog.show('Sign In', '<login></login>')
    }

    signup() {
        this.dialog.show('Sign Up', '<signup></signup>')
    }

    logout() {
        this.cookies.remove('goverUserId')
        this.cookies.remove('goverUserMail')
    }

    private switchHeaderStyle() {
        document.body.scrollTop ? $('header').addClass('is-scroll') : $('header').removeClass('is-scroll')
    }
}

let app = angular.module('App');
app.controller('AppCtrl', AppCtrl)
