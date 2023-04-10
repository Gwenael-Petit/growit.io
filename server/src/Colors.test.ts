import Colors from './Colors';

describe('color generator', () => {
	it('should return a random color', () => {
		const randomColor: string = Colors.randomColor();
		expect(Colors.colors).toContain(randomColor);
	});
});
