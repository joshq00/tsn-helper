function injectScript(file_path, tag='html', type='script', text='') {
    
    var node = document.getElementsByTagName(tag)[0];
    var tag_type = type == 'link' ? 'link' : 'script';
    var script = document.createElement(tag_type);
    if(type == 'script') {
    script.setAttribute('type', 'text/javascript');
    }
    else if ( type == 'module' ) {
    script.setAttribute('type', 'module');
    }
    else {
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('media', 'screen');
        
    }
    if (text == '') {
        script.setAttribute(tag_type == 'script' ? 'src': 'href', file_path);
    }
    else {
        script.innerHTML = text;
    }
    node.appendChild(script);
}

function injectCss() {
    if ( document.getElementsByTagName('head').length > 0 ) {
        injectScript(chrome.runtime.getURL('css/extraCss.css'), 'head', 'link');
    } else {
        setTimeout(injectCss, 200);
    }
}


// Extension ID for notifications stuff
injectScript('', 'html', 'script', 'var extensionId = "'+chrome.runtime.id+'";');

// Libraries
//injectScript(chrome.runtime.getURL('lib/md5.js'));
injectScript(chrome.runtime.getURL('lib/versionCompare.js'));
injectScript(chrome.runtime.getURL('lib/tableSort.js'));
//injectScript(chrome.runtime.getURL('lib/brutusinForms.js'));

// Settings Framework
injectScript(chrome.runtime.getURL('MLBTamperSettingsFramework.library.js'), 'html', 'module');

// Card Data Framework
injectScript(chrome.runtime.getURL('MLBTSNCardData.library.js'), 'html', 'module');

// Hotkeys
injectScript(chrome.runtime.getURL('Hotkeys.userscript.js'));

// CSS
injectCss();


