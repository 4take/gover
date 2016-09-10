///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import {Address} from '../models/address'

let path: string = '/addresses'

export default class AddressResource {
	static $inject = ['$resource']
	get resourcePost(): ng.resource.IResourceClass<any> { return this.resource(path) }
	get resourceId(): ng.resource.IResourceClass<any> { return this.resource(`${path}/:id`, {}, { update: { method: 'PUT' }}) }
	get resourceUserId(): ng.resource.IResourceClass<any> { return this.resource(`${path}/user/:id`) }

	constructor(private resource: ng.resource.IResourceService) {
	}

	query(success: (v: Array<Address>) => void) {
		var res: any
		return res = this.resourcePost.query({
			},
			() => {
				success(res);
			})
	}

	get(id: number, success: (v: Address) => void) {
		var res: any
		return res = this.resourceId.get({
			id: id,
		}, () => {
			success(res);
		})
	}

	getByUser(userId: number, success: (v: Address) => void) {
		var res: any
		return res = this.resourceUserId.get({
			id: userId,
		}, () => {
			success(res);
		})
	}

	save(address: Address, success: (v: Address) => void) {
		var res: any
		return res = this.resourcePost.save({
			},
			address,
			() => {
				success(res);
			})
	}

	update(address: Address, success: (v: Address) => void) {
		var res: any
		return res = (<any>this.resourceId).update({
			id: address.id
			},
			address,
			() => {
				success(res);
			})
	}

}

let app = angular.module('App');
app.service('addressResource', AddressResource);
