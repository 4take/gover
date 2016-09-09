/// <reference path="./typings/bundle.d.ts"/>

enum QueryType {
	NONE,
	ID,
	CLASS,
	TAG,
	SELECTOR
}

class Data {
	private element: Element
	private data: {[key: string]: any} = {}

	constructor(element: Element) {
		this.element = element
	}

	equals(element: Element): boolean {
		return this.element == element
	}

	get(key: string): any {
		return this.data[key]
	}

	set(key: string, value: any): void {
		return this.data[key] = value
	}

	delete(): void
	delete(key: string): void
	delete(key?: string): void {
		if (Check.isDefined(key)) {
			delete this.data[key]
		} else {
			this.data = {}
		}
	}
}

export class Q {
	private static datas: Array<Data> = []

	static getDatas(): Array<Data> {
		return this.datas
	}

	constructor(param: any){
		if (param instanceof Function) {
			document.addEventListener('DOMContentLoaded', ()=> {
				param()
			})
		} else {
			return new HQuery(param)
		}
	}

	static each<T>(array: Array<T>, each: (t: T, index: number)=> void): void {
		if (Check.isUndefined(array)) {
			return
		}

		array.forEach((a, index)=> {
			each(a, index)
		})
	}

	//static extend<T>(deep: boolean, obj1: T, obj2: T): T {
	//	let obj: any = {}
	//	this.extends(deep, obj, obj1, obj2)
	//	return obj
	//}
	//
	//private static extends(deep: boolean, obj: any, obj1: any, obj2: any): any {
	//	let keys = Object.keys(obj1)
	//	let isObject = keys.length
	//	if(isObject) {
	//		if(deep) {
	//			for(let key in obj1) {
	//				obj[key] = this.extends(deep, obj, obj1[key], obj2[key])
	//			}
	//			return this.extends(deep, obj, obj1, obj2)
	//		}
	//	} else {
	//		return Check.isDefined(obj2) ? obj2 : obj1
	//	}
	//}
}

export default class HQuery implements Query {
	elements: Array<HTMLElement>

	constructor(param?: any) {
		if (Check.isArray(param)) {
			this.elements = (<Array<any>>param).map((e)=> <HTMLElement>e)
		} else if (Check.isString(param)) {
			this.elements = this.getElements(param, <any>document)
		} else if (Check.isElement(param)) {
			this.elements = [<HTMLElement>param]
		} else if (param instanceof HTMLCollection) {
			this.elements = this.toArray(<HTMLCollection>param)
		} else {
			this.elements = []
		}
	}

	get(): Array<HTMLElement>
	get(index: number): HTMLElement
	get(index?: number): HTMLElement | Array<HTMLElement> {
		return Check.isUndefined(index) ? this.elements : this.toE(this.elements[index])
	}

	remove(): Array<HTMLElement>
	remove(index: number): HTMLElement
	remove(index?: number): HTMLElement | Array<HTMLElement> {
		if (Check.isUndefined(index)) {
			let elements = this.elements
			elements.forEach((e)=> {
				e.remove()
			})
			return elements
		} else {
			let e = this.elements[index]
			e.parentNode.removeChild(e)
			return e
		}
	}

	first(): HTMLElement {
		return this.get(0)
	}

	size(): number {
		return this.some() ? this.elements.length : 0
	}

	query(selector: string): Query {
		return new HQuery(this.getElements(selector))
	}

	parent(selector?: string): Query {
		if (this.empty()) {
			return new HQuery()
		}
		let parent = this.first().parentElement
		if(selector) {
			if(!parent) {
				return new HQuery()
			}
			if(this.match(selector, parent)) {
				return new HQuery(parent)
			} else {
				return new HQuery(parent).parent(selector)
			}
		} else {
			return new HQuery(parent)
		}
	}

	children(): Query {
		if (this.empty()) {
			return new HQuery()
		}
		return new HQuery(this.toArray(this.first().children))
	}

	index(): number {
		if (this.empty()) {
			return undefined
		}
		return this.parent().children().get().indexOf(this.first())
	}

	next(): Query
	next(selector: string): Query
	next(selector?: string): Query {
		if (this.empty()) {
			return new HQuery()
		}

		let children = this.parent().children().get()
		let index = children.indexOf(this.first())

		if (Check.isDefined(selector)) {
			let targets = this.getElements(selector, <any>document).filter((e)=> {
				return children.indexOf(e) > index
			})
			return new HQuery(targets.length > 0 ? targets[0] : undefined)
		} else {
			return new HQuery(children.length > index + 1 ? children[index + 1] : undefined)
		}
	}

	prev(): Query
	prev(selector: string): Query
	prev(selector?: string): Query {
		if (this.empty()) {
			return new HQuery()
		}

		let children = this.parent().children().get()
		let index = children.indexOf(this.first())

		if (Check.isDefined(selector)) {
			let targets = this.getElements(selector, <any>document).filter((e)=> {
				let i = children.indexOf(e);
				return i > -1 && index > i
			})
			return new HQuery(targets.length > 0 ? targets[0] : undefined)
		} else {
			return new HQuery(0 >= index - 1 ? children[index - 1] : undefined)
		}
	}

	filter(selector: string): Query {
		return new HQuery(this.getElements(selector, <any>document).filter((e)=> {
			return this.elements.indexOf(e) > -1
		}))
	}

	has(element: HTMLElement): boolean {
		return this.getElements('*').indexOf(element) > -1 || this.elements.indexOf(element) > -1
	}

	clone(deep?: boolean): Query {
		return new HQuery(this.elements.map((e)=> {
			return <HTMLElement>e.cloneNode(deep || false)
		}))
	}

	empty(): boolean {
		return !this.some() || this.elements.every((e)=> Check.isUndefined(e))
	}

	some(): boolean {
		return this.elements && this.elements.length > 0
	}

	width(): number
	width(value: string): Query
	width(value: number): Query
	width(value?: string | number): Query | number {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}
		if (isGetter) {
			return this.first().getBoundingClientRect().width
		} else {
			this.css('width', Check.isNumber(value) ? `${value}px` : value)
		}
	}

	height(): number
	height(value: string): Query
	height(value: number): Query
	height(value?: string | number): Query | number {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}
		if (isGetter) {
			return this.first().getBoundingClientRect().height
		} else {
			this.css('height', Check.isNumber(value) ? `${value}px` : value)
		}
	}

	css(property: {[key: string]: string | number}): Query
	css(property: string): string
	css(property: string, value: string|number): Query
	css(property: string | {[key: string]: string | number}, value?: string|number): Query|string {
		let PX_TARGETS = ['width', 'height', 'top', 'bottom', 'right', 'left']
		if (Check.isString(property)) {
			let isGetter: boolean = Check.isUndefined(value)
			if (this.empty()) {
				return isGetter ? undefined : this
			}
			if (isGetter) {

				if (this.empty() || Check.isUndefined(property)) {
					return undefined
				}

				return this.first().style.getPropertyValue(property.toString())
			} else {

				if (Check.isUndefined(property) || Check.isUndefined(value)) {
					return this
				}

				let px = PX_TARGETS.indexOf(property.toString()) > -1 && Check.isNumber(value)
				this.elements.forEach((e)=> {
					e.style.setProperty(property.toString(), `${value.toString()}${px ? 'px' : ''}`)
				})
				return this
			}
		} else {
			if (this.empty()) {
				return this
			}
			for (let key in <{[key: string]: string | number}>property) {
				let value = property[key]

				if (Check.isUndefined(key) || Check.isUndefined(value)) {
					continue
				}

				let px = PX_TARGETS.indexOf(key) > -1 && Check.isNumber(value)
				this.elements.forEach((e)=> {
					e.style.setProperty(key, `${value.toString()}${px ? 'px' : ''}`)
				})
			}
			return this
		}
	}

	addClass(className: string): Query {
		if (this.empty()) {
			return this
		}
		this.elements.forEach((e)=> {
			className.split(' ').forEach((c)=> {
				if(c) e.classList.add(c)
			})
		})
		return this
	}

	removeClass(className?: string): Query {
		if (this.empty()) {
			return this
		}
		this.elements.forEach((e)=> {
			className.split(' ').forEach((c)=> {
				if(c) e.classList.remove(c)
			})
		})
		return this
	}

	hasClass(className?: string): boolean {
		if (this.empty()) {
			return false
		}
		return className ? this.first().classList.contains(className) : this.first().classList.length > 0
	}

	attr(attributeName: string): string
	attr(attributeName: string, value: string|number): Query
	attr(attributeName: string, value?: string|number): Query|string {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}
		if (isGetter) {
			return this.first().getAttribute(attributeName)
		} else {
			this.elements.forEach((e)=> {
				e.setAttribute(attributeName, value.toString())
			})
			return this
		}
	}

	removeAttr(attributeName?: string): Query {
		if (this.empty()) {
			return this
		}
		return this
	}

	visible(): boolean {
		return Check.isVisible(this.first())
	}

	show(value?: string): Query {
		this.css('display', value || 'block')
		return this
	}

	hide(): Query {
		this.css('display', 'none')
		return this
	}

	toggle(): Query {
		this.css({'display': this.visible() ? 'none' : 'block'})
		return this
	}

	checked(): boolean
	checked(value: boolean): Query
	checked(value?: boolean): boolean | Query {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}
		if (isGetter) {
			return Check.isChecked(this.first())
		} else {
			(<HTMLInputElement>this.first()).checked = value
			return this
		}
	}

	append(param: Element | HTMLElement | Query): Query {
		if (this.empty()) {
			return this
		}
		if (param instanceof HTMLElement || param instanceof Document) {
			this.first().appendChild(<HTMLElement>param)
		} else if (param) {
			(<Query>param).get().forEach((e)=> {
				this.first().appendChild(e)
			})
		}
		return new HQuery(<HTMLElement>param)
	}

	each(l: (index: number, element: HTMLElement)=> void): void {
		this.elements.forEach((e, index)=> {
			l(index, e)
		})
	}

	before(element: HTMLElement): Query {
		if (this.empty()) {
			return this
		}
		this.parent().first().insertBefore(element, this.first())
		return this
	}

	after(element: HTMLElement): Query {
		if (this.empty()) {
			return this
		}
		this.parent().first().insertBefore(element, this.first().nextSibling)
		return this
	}

	data(): any
	data(key: string): any
	data(key: string, value: any): Query
	data(key?: string, value?: any): any {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}

		let data = Q.getDatas().filter((d)=> d.equals(this.first()))

		if (isGetter) {
			return data.length > 0 ? Check.isDefined(key) ? data[0].get(key) : data[0] : undefined
		} else {
			if (data.length > 0) {
				data[0].set(key, value)
			} else {
				let d = new Data(this.first())
				d.set(key, value)
				Q.getDatas().push(d)
			}
			return this
		}
	}

	removeData(): Query
	removeData(key: string): Query
	removeData(key?: string): Query {

		let data = Q.getDatas().filter((d)=> d.equals(this.first()))
		if (data.length == 0) {
			return this
		}

		if (Check.isDefined(key)) {
			delete data[0].delete(key)
		} else {
			delete data[0].delete()
		}
		return this
	}

	val(): any
	val(value: any): Query
	val(value?: any): any {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}

		if(isGetter) {
			return (<HTMLInputElement>this.first()).value
		} else {
			this.elements.forEach((e)=> {
				if (Check.isHTMLInput(e) || Check.isHTMLTextarea(e)) {
					(<HTMLInputElement>e).value = value
				} else if (Check.isHTMLSelect(e)) {
					let options = this.toArray((<HTMLSelectElement>e).options)
					if (Check.isArray(value)) {
						options.forEach((e)=> {
							let option = (<HTMLOptionElement>e)
							option.selected = (<Array<string>>value).some((v)=> {
								return v == option.value
							})
						})
					} else {
						options.forEach((e)=> {
							let option = (<HTMLOptionElement>e)
							option.selected = value == option.value
						})
					}
				}
			})
			return this
		}
	}

	text(): string
	text(value: string): Query
	text(value?: string): Query | string {
		let isGetter: boolean = Check.isUndefined(value)
		if (this.empty()) {
			return isGetter ? undefined : this
		}
		if (isGetter) {
			return this.first().textContent
		} else {
			this.first().textContent = value
			return this
		}
	}

	options(): Query {
		if (this.empty()) {
			return new HQuery()
		}
		return new HQuery(this.getElements('option'))
	}

	selectedOptions(): Query {
		return new HQuery(this.options().get().filter((e)=> {
			return (<HTMLOptionElement>e).selected
		}))
	}

	innerHTML(): string
	innerHTML(html: string): Query
	innerHTML(html?: string): string | Query {
		let isGetter: boolean = Check.isUndefined(html)
		if(this.empty()) {
			return isGetter ? undefined : this
		}
		if (isGetter) {
			return this.first().innerHTML
		} else {
			this.first().innerHTML = html
			return this
		}
	}

	//detach(): Query {
	//	this.elements.forEach((e)=> {e.de})
	//}

	click(): Query
	click(handler: (event: Event)=> void): Query
	click(handler?: (event: Event)=> void): Query {
		if (handler) {
			this.on('click', handler)
		} else {
			this.elements.forEach((e)=> e.click())
		}
		return this
	}

	dblclick(): Query
	dblclick(handler: (event: Event)=> void): Query
	dblclick(handler?: (event: Event)=> void): Query {
		if (handler) {
			this.on('dblclick', handler)
		} else {
			this.elements.forEach((e)=> e.ondblclick(null))
		}
		return this
	}

	focus(): Query
	focus(handler: (event: Event)=> void): Query
	focus(handler?: (event: Event)=> void): Query {
		if (handler) {
			this.on('focus', handler)
		} else {
			this.elements.forEach((e)=> e.focus())
		}
		return this
	}

	blur(): Query
	blur(handler: (event: Event)=> void): Query
	blur(handler?: (event: Event)=> void): Query {
		if (handler) {
			this.on('blur', handler)
		} else {
			this.elements.forEach((e)=> e.blur())
		}
		return this
	}

	keydown(): Query
	keydown(handler: (event: KeyboardEvent)=> void): Query
	keydown(handler?: (event: KeyboardEvent)=> void): Query {
		if (handler) {
			this.on('keydown', handler)
		} else {
			this.elements.forEach((e)=> e.onkeydown(null))
		}
		return this
	}

	keypress(): Query
	keypress(handler: (event: KeyboardEvent)=> void): Query
	keypress(handler?: (event: KeyboardEvent)=> void): Query {
		if (handler) {
			this.on('keypress', handler)
		} else {
			this.elements.forEach((e)=> e.onkeypress(null))
		}
		return this
	}

	keyup(): Query
	keyup(handler: (event: KeyboardEvent)=> void): Query
	keyup(handler?: (event: KeyboardEvent)=> void): Query {
		if (handler) {
			this.on('keyup', handler)
		} else {
			this.elements.forEach((e)=> e.onkeyup(null))
		}
		return this
	}

	mousedown(): Query
	mousedown(handler: (event: MouseEvent)=> void): Query
	mousedown(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mousedown', handler)
		} else {
			this.elements.forEach((e)=> e.onmousedown(null))
		}
		return this
	}

	mouseenter(): Query
	mouseenter(handler: (event: MouseEvent)=> void): Query
	mouseenter(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mouseenter', handler)
		} else {
			this.elements.forEach((e)=> e.onmouseenter(null))
		}
		return this
	}

	mouseleave(): Query
	mouseleave(handler: (event: MouseEvent)=> void): Query
	mouseleave(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mouseleave', handler)
		} else {
			this.elements.forEach((e)=> e.onmouseleave(null))
		}
		return this
	}

	mousemove(): Query
	mousemove(handler: (event: MouseEvent)=> void): Query
	mousemove(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mousemove', handler)
		} else {
			this.elements.forEach((e)=> e.onmousemove(null))
		}
		return this
	}

	mouseout(): Query
	mouseout(handler: (event: MouseEvent)=> void): Query
	mouseout(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mouseout', handler)
		} else {
			this.elements.forEach((e)=> e.onmouseout(null))
		}
		return this
	}

	mouseover(): Query
	mouseover(handler: (event: MouseEvent)=> void): Query
	mouseover(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mouseover', handler)
		} else {
			this.elements.forEach((e)=> e.onmouseover(null))
		}
		return this
	}

	mouseup(): Query
	mouseup(handler: (event: MouseEvent)=> void): Query
	mouseup(handler?: (event: MouseEvent)=> void): Query {
		if (handler) {
			this.on('mouseup', handler)
		} else {
			this.elements.forEach((e)=> e.onmouseup(null))
		}
		return this
	}

	change(): Query
	change(handler: (event: Event)=> void): Query
	change(handler?: (event: Event)=> void): Query {
		if (handler) {
			this.on('change', handler)
		} else {
			this.elements.forEach((e)=> {
				var evt = document.createEvent("MouseEvents")
				evt.initEvent("change", false, true)
				e.dispatchEvent(evt)
			})
		}
		return this
	}

	select(): Query {
		this.elements.forEach((e)=> {
			if (e instanceof HTMLInputElement) {
				(<HTMLInputElement>e).select()
			}
		})
		return this
	}


	on(events: string, handler: (eventObject: Event, ...args: any[]) => any): Query {
		this.elements.forEach((e)=> {
			events.split(' ').forEach((event)=> {
				e.addEventListener(event, handler)
			})
		})
		return this
	}

	isHTMLInput(): boolean {
		return Check.isHTMLInput(this.first())
	}

	isHTMLInputText(): boolean {
		return Check.isHTMLInputText(this.first())
	}

	isHTMLInputNumber(): boolean {
		return Check.isHTMLInputNumber(this.first())
	}

	isHTMLInputCheckbox(): boolean {
		return Check.isHTMLInputCheckbox(this.first())
	}

	isHTMLInputRadio(): boolean {
		return Check.isHTMLInputRadio(this.first())
	}

	isHTMLTextarea(): boolean {
		return Check.isHTMLTextarea(this.first())
	}

	isHTMLSelect(): boolean {
		return Check.isHTMLSelect(this.first())
	}

	isHTMLMultipleSelect(): boolean {
		return Check.isHTMLMultipleSelect(this.first())
	}

	private toE(element: Element): HTMLElement {
		return <HTMLElement>element
	}

	private queryType(query: string): QueryType {
		if (!query) {
			return QueryType.NONE
		}

		if (query.split(' ').length > 1 || query.split(',').length > 1 || query.split('>').length > 1 || query.split(':').length > 1) {
			return QueryType.SELECTOR
		}

		switch (query.substring(0, 1)) {
			case '#':
				return QueryType.ID
			case '.':
				return QueryType.CLASS
			default:
				return QueryType.TAG
		}
	}

	private getElements(query: string, target?: Element): Array<HTMLElement> {
		// セレクトtarget
		target = target || this.elements[0]

		let elements: Array<Element> = []
		if (!query || !target) {
			return []
		}

		query = query.split(':').join('\\:')

		let queryType = this.queryType(query)
		switch (queryType) {
			case QueryType.SELECTOR:
				elements = this.toArray(target.querySelectorAll(query))
				break
			case QueryType.ID:
				let e = document.getElementById(query.substr(1, query.length - 1))
				elements = e ? [e] : []
				break
			case QueryType.CLASS:
				elements = this.toArray(target.getElementsByClassName(query.substr(1, query.length - 1)))
				break
			case QueryType.TAG:
				elements = this.toArray(target.getElementsByTagName(query))
				break
			default:
				break
		}
		return elements.map((e)=> <HTMLElement>e)
	}

	private match(query: string, target: Element): boolean {
		query = query.split(':').join('\\:')
		let queryType = this.queryType(query)
		switch (queryType) {
			//case QueryType.SELECTOR:
			//	elements = this.toArray(target.querySelectorAll(query))
			//	break
			case QueryType.ID:
				return target.id == query.substr(1, query.length - 1)
			case QueryType.CLASS:
				return new HQuery(target).hasClass(query.substr(1, query.length - 1))
			case QueryType.TAG:
				target.tagName == query
			default:
				return false
		}
	}

	private toArray(list: NodeListOf<Element> | NodeListOf<HTMLElement> | HTMLCollection): Array<HTMLElement> {
		return Array.prototype.slice.call(list)
	}
}

class Check {

	// 値有効判定。0、空文字はスルー。nullを含めるかはお好みで
	static isDefined(value: any): boolean {
		return value != undefined && value != null
	}

	// 値無効判定。0、空文字はスルー。nullを含めるかはお好みで
	static isUndefined(value: any): boolean {
		return value == undefined || value == null
	}

	// 数値判定。数値に見えるが型が文字列の場合はスルー
	static isNumber(value: any): boolean {
		return typeof (value) == 'number'
	}

	// 文字列判定。
	static isString(value: any): boolean {
		return typeof (value) == 'string'
	}

	// Element判定。"Document"・"Window"を含めるかはお好みで。
	static isElement(value: any): boolean {
		return value instanceof Element || value instanceof HTMLElement || value instanceof Document || value instanceof Window
	}

	// 配列判定。
	static isArray(value: any): boolean {
		return Array.isArray(value)
	}

	// Elementの表示状態。class属性の"display:none"の指定を考慮
	static isVisible(element: HTMLElement): boolean {
		return !(element.offsetWidth <= 0 && element.offsetHeight <= 0 && !element.getClientRects().length)
	}

	// Elementの選択状態。checkboxとoptionに対応
	static isChecked(element: HTMLElement): boolean {
		let eCheck = <HTMLInputElement>element
		let eOption = <HTMLOptionElement>element
		return (this.isHTMLInput(eCheck) && eCheck.checked) || (this.isHTMLOption(eOption) && eOption.selected)
	}

	// Input判定。
	static isHTMLInput(element: HTMLElement): boolean {
		return element instanceof HTMLInputElement
	}

	// Input[type="text"]判定。
	static isHTMLInputText(element: HTMLElement): boolean {
		return this.isHTMLInput(element) && [null, undefined, '', 'text'].indexOf((<HTMLInputElement>element).type) > -1
	}

	// Input[type="number"]判定。
	static isHTMLInputNumber(element: HTMLElement): boolean {
		return this.isHTMLInput(element) && (<HTMLInputElement>element).type == 'number'
	}

	// Input[type="checkbox"]判定。
	static isHTMLInputCheckbox(element: HTMLElement): boolean {
		return this.isHTMLInput(element) && (<HTMLInputElement>element).type == 'checkbox'
	}

	// Input[type="radio"]判定。
	static isHTMLInputRadio(element: HTMLElement): boolean {
		return this.isHTMLInput(element) && (<HTMLInputElement>element).type == 'radio'
	}

	// Textarea判定。
	static isHTMLTextarea(element: HTMLElement): boolean {
		return element instanceof HTMLTextAreaElement
	}

	// Select判定。
	static isHTMLSelect(element: HTMLElement): boolean {
		return element instanceof HTMLSelectElement
	}

	// Select[multiple="multiple"]判定。
	static isHTMLMultipleSelect(element: HTMLElement): boolean {
		if (element instanceof HTMLSelectElement) {
			return (<HTMLSelectElement>element).multiple
		}
		return false
	}

	// Option判定。
	static isHTMLOption(element: HTMLElement): boolean {
		return element instanceof HTMLOptionElement
	}
}