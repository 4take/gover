///<reference path="../typings/bundle.d.ts"/>
let Clipboard: any = require('clipboard')
import angular = require('angular')
import {Address} from '../models/address'
import AddressResource from '../resources/address-resource'
import Dialog from '../services/dialog'
import {Toast} from '../services/toast'

class MyPage {
	private prefectures = [
		{code: '01', name: '北海道'}
		,{code: '02', name: '青森県'}
		,{code: '03', name: '岩手県'}
		,{code: '04', name: '宮城県'}
		,{code: '05', name: '秋田県'}
		,{code: '06', name: '山形県'}
		,{code: '07', name: '福島県'}
		,{code: '08', name: '茨城県'}
		,{code: '09', name: '栃木県'}
		,{code: '10', name: '群馬県'}
		,{code: '11', name: '埼玉県'}
		,{code: '12', name: '千葉県'}
		,{code: '13', name: '東京都'}
		,{code: '14', name: '神奈川県'}
		,{code: '15', name: '新潟県'}
		,{code: '16', name: '富山県'}
		,{code: '17', name: '石川県'}
		,{code: '18', name: '福井県'}
		,{code: '19', name: '山梨県'}
		,{code: '20', name: '長野県'}
		,{code: '21', name: '岐阜県'}
		,{code: '22', name: '静岡県'}
		,{code: '23', name: '愛知県'}
		,{code: '24', name: '三重県'}
		,{code: '25', name: '滋賀県'}
		,{code: '26', name: '京都府'}
		,{code: '27', name: '大阪府'}
		,{code: '28', name: '兵庫県'}
		,{code: '29', name: '奈良県'}
		,{code: '30', name: '和歌山県'}
		,{code: '31', name: '鳥取県'}
		,{code: '32', name: '島根県'}
		,{code: '33', name: '岡山県'}
		,{code: '34', name: '広島県'}
		,{code: '35', name: '山口県'}
		,{code: '36', name: '徳島県'}
		,{code: '37', name: '香川県'}
		,{code: '38', name: '愛媛県'}
		,{code: '39', name: '高知県'}
		,{code: '40', name: '福岡県'}
		,{code: '41', name: '佐賀県'}
		,{code: '42', name: '長崎県'}
		,{code: '43', name: '熊本県'}
		,{code: '44', name: '大分県'}
		,{code: '45', name: '宮崎県'}
		,{code: '46', name: '鹿児島県'}
		,{code: '47', name: '沖縄県'}

	]

	private address: Address = {
		id: null,
		zip_code: '',
		prefecture_code: '',
		city: '',
		address1: '',
		address2: '',
		user_id: null,
	}
	static $inject = ['$rootScope', '$scope', '$element', '$timeout', '$cookies', 'dialog', 'toast', 'addressResource']

	constructor(
		private rootScope: ng.IRootScopeService,
		private scope: ng.IScope,
		private element: ng.IRootElementService,
		private timeout: ng.ITimeoutService,
		private cookies: any,
		private dialog: Dialog,
		private toast: Toast,
		private addressResource: AddressResource) {

		let userId = this.cookies.get('goverUserId')
		if(userId) {
			this.addressResource.getByUser(userId, (address)=> {
				if('id' in address) {
					this.address = address
				}
			})
		}

		new Clipboard('.btn-copy').on('success',()=> {
			this.toast.show('コピーできたで！')
		})
	}

	private save() {
		if(this.address.user_id) {
			this.addressResource.update(this.address, (address)=> {
				this.toast.show('登録できたで！')
			})
		} else {
			this.address.user_id = this.cookies.get('goverUserId')
			this.addressResource.save(this.address, (address)=> {
				this.toast.show('登録できたで！')
			})
		}
	}
}

let app = angular.module('App')
app.component('myPage', {
	controller: MyPage,
	bindings: {},
	template:
		`
		<div layout="row" layout-align="center center">
			<md-content class="container-address md-whiteframe-7dp">
				<input id="token" value="{{$ctrl.address.token}}" readonly/>
				<div layout="row" layout-align="center center" ng-if="$ctrl.address.token" class="container-token">
					<ng-md-icon icon="vpn_key" style="fill: #fff; margin-right: 10px;"></ng-md-icon>
					{{$ctrl.address.token}}
					<!--<button data-clipboard-target="#token">-->
						<!--<ng-md-icon icon="content_copy" style="fill: #fff; margin-left: 10px;"></ng-md-icon>-->
					<!--</button>-->
					<md-button class="btn-copy" data-clipboard-target="#token">
						<ng-md-icon icon="content_copy" style="fill: #fff;"></ng-md-icon>
						<md-tooltip md-direction="bottom">
							Copy to clipboard!
						</md-tooltip>
					</md-button>
				</div>
				
				<div style="height:5px"></div>
				
				<md-input-container class="md-block">
					<label>郵便番号</label>
					<input required ng-model="$ctrl.address.zip_code" />
				</md-input-container>
				<md-input-container class="md-block">
					<label>都道府県</label>
					<md-select name="type" ng-model="$ctrl.address.prefecture_code" required>
						<md-option value=""></md-option>
						<md-option ng-repeat="prefecture in $ctrl.prefectures" value="{{prefecture.code}}">{{prefecture.name}}</md-option>
					</md-select>
				</md-input-container>
				<md-input-container class="md-block">
					<label>市区町村</label>
					<input required ng-model="$ctrl.address.city" />
				</md-input-container>
				<md-input-container class="md-block">
					<label>番地</label>
					<input required ng-model="$ctrl.address.address1" />
				</md-input-container>
				<md-input-container class="md-block">
					<label>建物名・部屋番号</label>
					<input required ng-model="$ctrl.address.address2" />
				</md-input-container>
				<div layout="row" layout-align="center center">
					<md-button class="md-raised md-accent" ng-click="$ctrl.save()">Save</md-button>
				</div>
			</md-content>
		</div>
		`
})
