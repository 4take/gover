///<reference path="../typings/bundle.d.ts"/>

import angular = require('angular')
import {User} from '../models/user'

let path: string = '/user'

export default class UserResource {
	static $inject = ['$resource']
	get resourcePost(): ng.resource.IResourceClass<any> {
		return this.resource(path)
	}

	get resourceId(): ng.resource.IResourceClass<any> {
		return this.resource(`${path}/:id`)
	}

	constructor(private resource: ng.resource.IResourceService) {
	}

	signup(user: User, success: (v: User) => void) {
		var res: any
		return res = this.resourcePost.save({
		},
		user,
		() => {
			success(res);
		})
	}

	get(id: string, success: (v: User) => void) {
		var res: any
		return res = this.resourceId.get({
			id: id,
		}, () => {
			success(res);
		})
	}
}

let app = angular.module('App');
app.service('userResource', UserResource);
