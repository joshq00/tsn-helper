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
    else if ( type == 'asyncdefer' ) {
        script.setAttribute('async', '');
        script.setAttribute('defer', '');
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

injectScript('', 'html', 'script', 'var onloadCallback = function() { alert("grecaptcha is ready"); };')
injectScript('https://www.gstatic.com/recaptcha/api2/v1554100419869/recaptcha__en.js?onload=onloadCallback&render=explicit', 'html', 'asyncdefer');
injectScript(chrome.runtime.getURL('CommunityMarketHelper.userscript.js'), 'html', 'module');
