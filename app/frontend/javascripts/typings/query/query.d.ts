interface Query {
	get(): Array<HTMLElement>
	get(index: number): HTMLElement
	remove(): Array<HTMLElement>
	remove(index: number): HTMLElement
	first(): HTMLElement
	size(): number
	query(selector: string): Query
	parent(): Query
	parent(selector: string): Query
	children(): Query
	next(): Query
	next(selector: string): Query
	prev(): Query
	prev(selector: string): Query
	filter(selector: string): Query
	has(element: HTMLElement): boolean
	clone(deep?: boolean): Query
	some(): boolean
	empty(): boolean
	width(): number
	width(value: number): Query
	width(value: string): Query
	height(): number
	height(value: number): Query
	height(value: string): Query
	css(propertyName: string): string
	css(propertyName: string, value: string|number): Query
	css(properties: {[key:string]: string | number}): Query
	addClass(className: string): Query
	removeClass(className?: string): Query
	hasClass(className?: string): boolean
	attr(attributeName: string): string
	attr(attributeName: string, value: string|number): Query
	removeAttr(attributeName?: string): Query
	show(value?: string): Query
	hide(): Query
	visible(): boolean
	toggle(): Query
	checked(): boolean
	checked(value: boolean): Query
	append(param: Element | HTMLElement | Query): Query
	//detach(): Query
	each(l: (index: number, element: HTMLElement)=> void): void
	before(element: HTMLElement): Query
	after(element: HTMLElement): Query
	data(): any
	data(key: string): any
	data(key: string, data: any): Query
	removeData(): Query
	removeData(key: string): Query
	val(): any
	val(value: any): Query
	text(): string
	text(value: string): Query
	options(): Query
	selectedOptions(): Query
	innerHTML(): string
	innerHTML(html: string): Query
	click(): Query
	click(handler: (event: Event)=> void): Query
	dblclick(): Query
	dblclick(handler: (event: Event)=> void): Query
	focus(): Query
	focus(handler: (event: Event)=> void): Query
	blur(): Query
	blur(handler: (event: Event)=> void): Query
	keydown(): Query
	keydown(handler: (event: KeyboardEvent)=> void): Query
	keypress(): Query
	keypress(handler: (event: KeyboardEvent)=> void): Query
	keyup(): Query
	keyup(handler: (event: KeyboardEvent)=> void): Query
	mousedown(): Query
	mousedown(handler: (event: MouseEvent)=> void): Query
	mouseenter(): Query
	mouseenter(handler: (event: MouseEvent)=> void): Query
	mouseleave(): Query
	mouseleave(handler: (event: MouseEvent)=> void): Query
	mousemove(): Query
	mousemove(handler: (event: MouseEvent)=> void): Query
	mouseout(): Query
	mouseout(handler: (event: MouseEvent)=> void): Query
	mouseover(): Query
	mouseover(handler: (event: MouseEvent)=> void): Query
	mouseup(): Query
	mouseup(handler: (event: MouseEvent)=> void): Query
	change(): Query
	change(handler: (event: Event)=> void): Query
	select(): Query
	on(events: string, handler: (eventObject: Event, ...args: any[]) => any): Query
	isHTMLInput(): boolean
	isHTMLInputText(): boolean
	isHTMLInputNumber(): boolean
	isHTMLInputCheckbox(): boolean
	isHTMLInputRadio(): boolean
	isHTMLTextarea(): boolean
	isHTMLSelect(): boolean
	isHTMLMultipleSelect(): boolean
}
interface QueryStatic {
	(): Query
	(selector: string): Query
	(element: Element | HTMLElement | EventTarget | Document | Window): Query
	(elements: Array<Element> | Array<HTMLElement>): Query
	(loaded: ()=> void): void
	each<T>(each: (array: Array<T>, index: number)=> void): void
	//extend<T>(deep: boolean, obj1: T, obj2: T): T
}
declare var Q: QueryStatic