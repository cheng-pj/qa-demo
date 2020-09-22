export default {
	setLocalStorage(key, value) {
		if (value != null) {
			let val = JSON.stringify(value)
			localStorage.setItem(key, val)
		}
	},
	getLocalStorage(key) {
		if (!key) {
			return ''
		}
		let value = localStorage.getItem(key)
		return JSON.parse(value)
	},
}
