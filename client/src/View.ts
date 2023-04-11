export default class View {
	element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;
	}

	show(): void {
		this.element.classList.remove('hidden');
	}

	hide(): void {
		this.element.classList.add('hidden');
	}
}
