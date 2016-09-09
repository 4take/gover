///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import md = angular.material


export default class Dialog {
    static $inject = ['$document', '$mdDialog']
    constructor(
        private document: ng.IDocumentService,
        private mdDialog: md.IDialogService) {
    }

    showAlert(title: string, content: string) {
        this.mdDialog.show(
            this.mdDialog.alert()
                .parent(angular.element(this.document[0].querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .htmlContent(content)
                .ariaLabel('Alert Dialog')
                .ok('Ok')
        );
    }

    showConfirm(title: string, content: string, okAction?: (promiseValue: any) => void, cancelAction?: (reason: any) => void) {
        // コールバックが無い場合は空を代入しておく
        if (typeof (okAction) != 'function') { okAction = ()=> { } }
        if (typeof (cancelAction) != 'function') { cancelAction = ()=> { } }

        let confirm = this.mdDialog.confirm()
            .title(title)
            .htmlContent(content)
            .ariaLabel('Lucky day')
            .ok('Ok')
            .cancel('Cancel')

        this.mdDialog.show(confirm).then(okAction, cancelAction)
    }

    // template : 表示htmlをつっこむ。

    // options
    // locals : 引数、連想配列
    show(title: string, template: string, okAction?: Function, cancelAction?: Function, options?: DialogOptions) {
        this.mdDialog.show({
            controller: DialogCtrl,
            controllerAs: 'dialog',
            bindToController: true,
            template:
            `'<md-dialog aria-label="dialog">
              <md-toolbar>
                <div class="md-toolbar-tools">
                  <h2> ${title} </h2>
                  <span flex></span>
                  <md-button class="md-icon-button" ng-click="dialog.cancel()" aria-label="close">
                    <ng-md-icon class="icon-white" icon="clear"></ng-md-icon>
                  </md-button>
                </div>
              </md-toolbar>
              <md-dialog-content>
                <md-content>
                 ${template}
                </md-content>
              </md-dialog-content>
            </md-dialog>'`,
            locals: {
                options: options && options.locals ? options.locals : {}
            },
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
            .then((answer)=> {
                if (typeof (okAction) == 'function') okAction(answer)
            }, ()=> {
                if (typeof (cancelAction) == 'function') cancelAction()
            });
    }

    hide(answer?: any) {
        this.mdDialog.hide(answer)
    }

    cancel() {
        this.mdDialog.cancel()
    }
}
let app = angular.module('App');
app.service('dialog', Dialog);

export class DialogOptions {
    locals: any
}

class DialogCtrl {
    static $inject = ['$mdDialog', 'options']
    constructor(
        private mdDialog: ng.material.IDialogService,
        private options: any) {
        // 引数が存在する場合スコープに移し替える。
        // DialogControllerのスコープ経由で子Directiveに渡す
        if (this.options) {
            for (let l in this.options) {
                // 表示テンプレートHtmlにコントロール名を書かなくて済むようここではscopeを使用
                (<any>this)[l] = this.options[l]
            }
        }
    }

    cancel = () => { this.mdDialog.cancel() }
}
