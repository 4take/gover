/// <reference path="./typings/bundle.d.ts"/>

let win = (<any>window)
win.jQuery = win.$ = require('jquery')

// frontend
import angular = require('angular')
require('angular-material')
require('angular-cookies')
require('angular-resource')
require('angular-sanitize')
require('angular-route')
require('angular-animate')
require('angular-material-icons')
require('es5-shim')

let app = angular.module('App', [
    'ngMaterial',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngMdIcons',
    'ngAnimate'
]);

//stylesheet
require('../stylesheets/application')

//controller
import './controllers/app-controller'

//directive
import './directives/scroll-opacity-changer'

//component
import './components/auto-divider'
import './components/login'
import './components/signup'

//services
import './services/dialog'
import './services/progress'

//resources
import './resources/user-resource'

//models


app.config(($mdThemingProvider) => {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '100'
        })
        .accentPalette('pink', {
            'default': '700'
        });
});
