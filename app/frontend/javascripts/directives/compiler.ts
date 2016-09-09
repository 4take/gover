///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

class Compiler {
    private content: string
    static $inject = ['$scope', '$compile', '$element', '$attrs']
    constructor(
        private scope: ng.IScope,
        private compile: ng.ICompileService,
        private element: ng.IRootElementService,
        private attrs: ng.IAttributes) {

        this.content = this.scope.$eval(this.attrs['content'])
        if (this.content) {
            let element = angular.element(this.element[0])
            element.html(this.content)
            this.compile(element.children())(this.scope)
        }
    }
}

let app = angular.module('App')
app.directive('compiler', () => {
    return {
        restrict: 'A',
        scope: false,
        controller: Compiler,
        controllerAs: 'compiler',
        bindToController: true
    }
})
