import { Autotacking, tracked, updateAction, type Autotrackable } from "$lib/svelte-autotracking";

@Autotacking
class Named {

	@tracked
	name = 'The Counter';

	otherName: string = 'The Counter other name';

	changeName(name: string) {
		this.name = name;
	}

	@updateAction
	resetOtherName() {
		console.log('resetOtherName');
		this.otherName = 'The Counter other name has changed.';
	}
}

interface Named extends Autotrackable<Named> { }

export default Named;