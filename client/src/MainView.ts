import View from './View';

export default class MainView extends View {
	selectedColor: string = 'red';

	loginForm: HTMLFormElement;
	nameInput: HTMLInputElement;
	scoreLink: HTMLAnchorElement;

	constructor(element: HTMLDivElement) {
		super(element);

		const colorPicker = this.element.querySelectorAll(
			'.color-picker'
		) as NodeListOf<HTMLSpanElement>;
		this.setUpColorPicker(colorPicker);

		this.loginForm = element.querySelector('.loginForm') as HTMLFormElement;
		this.nameInput = this.loginForm.querySelector(
			'input[type=text]'
		) as HTMLInputElement;

		this.scoreLink = element.querySelector('.scoreLink') as HTMLAnchorElement;
	}

	setUpColorPicker(colorPicker: NodeListOf<HTMLSpanElement>) {
		colorPicker.forEach(c => {
			c.style.backgroundColor = c.getAttribute('color') || 'red';
			c.addEventListener('click', event => {
				event.preventDefault();
				colorPicker.forEach(element =>
					element.classList.remove('color-selected')
				);
				c.classList.add('color-selected');
				this.selectedColor = c.getAttribute('color') || 'red';
			});
		});
	}
}
