///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')

export default class ProgressService {
	private ids: Array<number> = []
	static $inject = ['$rootScope', '$timeout', '$compile']

	constructor(private rootScope: ng.IRootScopeService,
				private timeout: ng.ITimeoutService,
				private compile: ng.ICompileService) {

		let template = `
        <div class="progress-overlay">
          <div class="progress">
            <md-progress-circular md-mode="indeterminate"></md-progress-circular>
            <div class="progress-message"></div>
          </div>
        </div>`
		let progress = this.compile(template)(this.rootScope)
		angular.element(document.body)[0].appendChild(angular.element(progress)[0])
	}

	show(id: number, message?: string) {
		if (this.ids.length == 0) {
			let progress = this.getProgress()
			this.changeMessage(message)
			progress.css('display', 'flex')
			console.log(progress)
			this.timeout(() => {
				progress.addClass('progress-overlay-show')
			})
		}
		this.ids.push(id)
	}

	changeMessage(message: string) {
		let progress = this.getProgress()
		let progressMessage = progress[0].getElementsByClassName('progress-message')
		progressMessage[0].textContent = message
	}

	hide(id: number) {
		this.ids.splice(this.ids.indexOf(id), 1)

		if (this.ids.length == 0) {
			let progress = this.getProgress()
			progress.css('display', 'none')
			this.timeout(() => {
				progress.removeClass('progress-overlay-show')
			}, 1000)
		}
	}

	getProgress(): angular.IAugmentedJQuery {
		return angular.element(document.body.getElementsByClassName('progress-overlay'))
	}
}
let app = angular.module('App');
app.service('progress', ProgressService)
