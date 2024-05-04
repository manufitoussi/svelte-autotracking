import { Autotracked, tracked, updateAfter, type IAutotrackable } from "$lib";

class Base {
	anyField = 'anyField';

	anyMethod() {
		console.log('anyMethod');
	}
}

/**
 * Named class with autotracking capabilities from decorator.
 */
@Autotracked
class Named extends Base {

	@tracked
	name = 'The name';

	otherName: string = 'The Counter other name';

	changeName(name: string) {
		this.name = name;
	}

	@updateAfter
	resetOtherName() {
		console.log('resetOtherName');
		this.otherName = 'The Counter other name has changed.';
	}
}

interface Named extends IAutotrackable<Named> { }

export default Named;