///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import md = angular.material

var app = angular.module('App');

export class Toast {
	static $inject = ['$document', '$mdToast']
	constructor(
		private document: ng.IDocumentService,
		private mdToast: md.IToastService) {
	}

	// options
	// hideDelay    : 非表示になるまでの時間(ms)
	// position     : 表示位置 フォーマットは'vertical horizontal' vertical : top or bottom, horizontal : left or right
	// okAction     : Okボタン押下時のコールバック 無い場合ばokボタン非表示
	// cancelAction : cancelボタン押下時のコールバック 無い場合ばcancelボタン非表示
	// status       : warn or error
	show(message: string, options?: ToastOptions) {
		var defaultHideDelay: number = 4000
		var defaultPotision: string = 'top right'
		if (options) {
			this.mdToast.show(
				{
					controller: ToastCtrl,
					controllerAs: 'toastCtrl',
					templateUrl: 'toast.html',
					parent: this.document[0].querySelector('#toastBounds'),
					hideDelay: options.hideDelay ? options.hideDelay : defaultHideDelay,
					position: options.position ? options.position : defaultPotision,
					bindToController: true,
					locals: { message: message, options: options },
				})
		}
		else {
			this.mdToast.show(
				this.mdToast.simple()
					.textContent(message)
					.position(defaultPotision)
					.hideDelay(defaultHideDelay)
			);
		}
	}

	hide() {
		this.mdToast.hide();
	}
}
app.service('toast', Toast);

export class ToastOptions {
	hideDelay: number
	position: string
	okAction: Function
	cancelAction: Function
	status: string
}

class ToastCtrl {
	private message: string
	private options: ToastOptions
	private showOk: boolean
	private showCencel: boolean

	static $inject = ['toast']
	constructor(private toast: Toast) {

		// ボタン表示判定
		this.showOk = typeof (this.options.okAction) == 'function'
		this.showCencel = typeof (this.options.cancelAction) == 'function'
	}

	ok() {
		this.options.okAction()
		this.toast.hide()
	}

	cancel() {
		this.options.cancelAction()
		this.toast.hide()
	}
}
app.controller('ToastCtrl', ToastCtrl);
