// ==UserScript==
// @name         MLB The Show Nation - Hotkeys
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.4.5.1
// @description  Provides hotkeys for The Show Nation (Described in code)
// @author       sreyemnayr
// @match        https://*.theshownation.com/*
// @match        http://*.theshownation.com/*
// @grant        none
// ==/UserScript==

function doc_keyUp(e) {
    console.log(e.keyCode);
    if (e.target.tagName.toUpperCase() != 'INPUT')
    {
        console.log(e.keyCode);
        switch(e.keyCode)
        {
            case 79: // o goes to orders
                window.location.href = 'https://theshownation.com/mlb20/orders/open_orders';
                break;
            case 67: // c goes to completed orders
                window.location.href = 'https://theshownation.com/mlb20/orders/completed_orders';
                break;
            case 77: // m goes to market
                window.location.href = 'https://theshownation.com/mlb20/community_market';
                break;
            case 84: // t goes to choice packs
                window.location.href = 'https://theshownation.com/mlb20/packs/choice_packs';
                break;
            case 73: // i goes to inventory
                window.location.href = 'https://theshownation.com/mlb20/inventory';
                break;
            case 80: // p goes to packs
                window.location.href = 'https://theshownation.com/mlb20/packs';
                break;
            case 82: // r refreshes
                window.location.reload();
                break;

            default:
                break;
        }
  }
}
(function() {
    'use strict';
    document.addEventListener('keyup', doc_keyUp, false);

    
    function checkLogin() {
        if ( typeof $ !== "undefined" && $('a').length > 0 ) {
            if ($('a[href="/sessions/login"]').length > 0) {
                $('a[href="/sessions/login"]')[0].click()
            }
        
        }
        else {
            setTimeout(checkLogin, 100);
        }
    }
    checkLogin();

})();

function disableConfirmations() {
    if (document.getElementsByTagName('footer').length > 0) {
        for ( var button of document.querySelectorAll("button[data-confirm='Are you sure?'") ) { button.dataset["confirm"] = false }
    }
    else {
        setTimeout(disableConfirmations, 200);
    }
}
disableConfirmations();

function makeIcon(title,href) {
    var iconLi = document.createElement('li');
    var iconA = document.createElement('a');

    iconA.classList.add(title.toLowerCase().replace(' ','-')+'-icon', 'white-icon', 'header-icon');
    iconA.setAttribute('title', title);
    iconA.href = href;
    iconLi.appendChild(iconA);

    return iconLi;
}

function iconizeMenu() {
    if (document.querySelectorAll('.global-menu .global-menu-links').length > 0) {

        var headerLinks = document.querySelector('.global-menu .global-menu-links');
        headerLinks.innerHTML = '';
        
        headerLinks.appendChild(makeIcon('Community Market', 'https://theshownation.com/mlb20/community_market'));
        headerLinks.appendChild(makeIcon('Open Orders', 'https://theshownation.com/mlb20/orders/open_orders'));
        headerLinks.appendChild(makeIcon('Completed Orders', 'https://theshownation.com/mlb20/orders/completed_orders'));
        headerLinks.appendChild(makeIcon('Inventory', 'https://theshownation.com/mlb20/inventory'));
        headerLinks.appendChild(makeIcon('Squads', 'https://theshownation.com/mlb20/squads'));
        headerLinks.appendChild(makeIcon('Roster Updates', 'https://theshownation.com/mlb20/roster_updates'));
        headerLinks.appendChild(makeIcon('Buy Stubs', 'https://theshownation.com/mlb20/shop/stubs'));
        headerLinks.appendChild(makeIcon('Buy Packs', 'https://theshownation.com/mlb20/shop/packs'));
        
        
        headerLinks.appendChild(makeIcon('FAQs', 'https://theshow.sonysandiegostudio.games/hc/en-us/sections/360007584713-MLB-The-Show-20'));
        
        headerLinks.appendChild(makeIcon('Community Forums', 'https://theshownation.com/forums/latest_activity'));
        headerLinks.appendChild(makeIcon('Bug Report', 'https://theshow.sonysandiegostudio.games/hc/en-us/requests/new?ticket_form_id=360003007534'));
        
        
       
        

        

        
        

    }
    else {
        console.log("Waiting to iconize");
        setTimeout(iconizeMenu, 200);
    }
}
iconizeMenu();


