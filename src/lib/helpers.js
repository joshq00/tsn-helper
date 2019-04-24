export function inIframe () {  try { return window.self !== window.top; } catch (e) { return true; } };
export function inExtensionIframe() { try { return window.top.location.href === 'undefined' } catch(e) { return true; } };

// Show an element
export function show(elem) {
	elem.classList.add('is-visible');
};

// Hide an element
export function hide(elem) {
	elem.classList.remove('is-visible');
};

// Toggle element visibility
export function toggle (elem) {
	elem.classList.toggle('is-visible');
};
