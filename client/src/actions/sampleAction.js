export const actionFunc = () => {
	return {
		type: 'CHANGE_STORE',
		payload: {
			newState: 'New state',
			anotherState: 'something'
		}
	}
}