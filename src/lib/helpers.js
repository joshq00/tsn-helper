export function inIframe () {  try { return window.self !== window.top; } catch (e) { return true; } };
export function inExtensionIframe() { try { return window.top.location.href === 'undefined' } catch(e) { return true; } };

// Show an element
export function show(el) {
	var className = 'is-visible';
	if (el.classList)
  el.classList.add(className);
else
  el.className += ' ' + className;
};

// Hide an element
export function hide(el) {
	var className = 'is-visible';
	if (el.classList)
  el.classList.remove(className);
else
  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
};

// Toggle element visibility
export function toggle (el) {
	var className = 'is-visible';
	if (el.classList) {
		el.classList.toggle(className);
	  } else {
		var classes = el.className.split(' ');
		var existingIndex = classes.indexOf(className);
	  
		if (existingIndex >= 0)
		  classes.splice(existingIndex, 1);
		else
		  classes.push(className);
	  
		el.className = classes.join(' ');
	  }
};
