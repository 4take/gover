/// <reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

export default class AppCtrl {
    static $inject = ['$rootScope', '$scope', '$cookies', '$window', '$timeout', '$location']
    constructor(
        private rootScope: ng.IRootScopeService,
        private scope: ng.IScope,
        private cookies: ng.cookie.CookieService,
        private window: ng.IWindowService,
        private timeout: ng.ITimeoutService,
        private location: ng.ILocationService) {

        angular.element(window).scroll(()=> {
            this.switchHeaderStyle()
        })

        this.timeout(()=> {
            this.switchHeaderStyle()
        })
    }

    private switchHeaderStyle() {
        document.body.scrollTop ? $('header').addClass('is-scroll') : $('header').removeClass('is-scroll')
    }
}

let app = angular.module('App');
app.controller('AppCtrl', AppCtrl)
