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
                window.location.href = 'https://mlb19.theshownation.com/community_market/orders/open';
                break;
            case 67: // c goes to completed orders
                window.location.href = 'https://mlb19.theshownation.com/community_market/orders/completed';
                break;
            case 77: // m goes to market
                window.location.href = 'https://mlb19.theshownation.com/community_market';
                break;
            case 84: // t goes to choice packs
                window.location.href = 'https://mlb19.theshownation.com/choice_packs';
                break;
            case 73: // i goes to inventory
                window.location.href = 'https://mlb19.theshownation.com/inventory?type=players';
                break;
            case 80: // p goes to packs
                window.location.href = 'https://mlb19.theshownation.com/packs';
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

    
    //https://mlb19.theshownation.com/mlb_fetch_community_psn_token_failed#
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

function iconizeMenu() {
    if (document.querySelectorAll('.header-navigation .menu-site').length > 0) {

        var cmLink = document.querySelector('.header-navigation .menu-site a[href="/community_market"')
        cmLink.innerHTML = '';
        cmLink.classList.add('community-market-icon', 'white-icon', 'header-icon');
        cmLink.setAttribute('title', 'Community Market');
        cmLink.parentNode.classList.add('has-submenu', 'top-level', 'open');
        var subMenu = document.createElement('ul');
        subMenu.classList.add('submenu');
        var openLi = document.createElement('li');
        var openLink = document.createElement('a');
        openLink.href = 'https://mlb19.theshownation.com/community_market/orders/open';
        openLink.classList.add('open-orders-icon', 'header-icon', 'white-icon');
        openLink.setAttribute('title', 'Open Orders');
        openLi.append(openLink);
        var completedLi = document.createElement('li');
        var completedLink = document.createElement('a');
        completedLink.href = 'https://mlb19.theshownation.com/community_market/orders/completed';
        completedLink.classList.add('completed-orders-icon', 'header-icon', 'white-icon');
        completedLink.setAttribute('title', 'Completed Orders');
        completedLi.append(completedLink);
        var inventoryLi = document.createElement('li');
        var inventoryLink = document.createElement('a');
        inventoryLink.href = 'https://mlb19.theshownation.com/inventory?type=players';
        inventoryLink.classList.add('inventory-icon', 'header-icon', 'white-icon');
        inventoryLink.setAttribute('title', 'Inventory');
        inventoryLi.append(inventoryLink);
        cmLink.parentNode.parentNode.insertBefore(inventoryLi, cmLink.parentNode.nextSibling);
        /* subMenu.append(openLi);
        subMenu.append(completedLi);
        var toggleSpan = document.createElement('span');
        toggleSpan.classList.add('submenu-toggle');
        var toggleButton = document.createElement('span');
        toggleButton.classList.add('submenu-toggle-icon');
        toggleSpan.append(toggleButton);
        cmLink.parentNode.append(toggleSpan);
        
        cmLink.parentNode.append(subMenu); */
        cmLink.parentNode.parentNode.insertBefore(completedLi, cmLink.parentNode.nextSibling);
        cmLink.parentNode.parentNode.insertBefore(openLi, cmLink.parentNode.nextSibling);

        cmLink = document.querySelector('.header-navigation .menu-site a[href="/roster_updates"');
        cmLink.innerHTML = '';
        cmLink.classList.add('roster-updates-icon', 'white-icon', 'header-icon');
        cmLink.setAttribute('title', 'Roster Updates');

        cmLink = document.querySelector('.header-navigation .menu-site a[href="https://theshownation.com/bugs/new"');
        cmLink.innerHTML = '';
        cmLink.classList.add('bug-report-icon', 'white-icon', 'header-icon');
        cmLink.setAttribute('title', 'Bug Report');

        cmLink = document.querySelector('.header-navigation .menu-site a[href="/leaderboards/online_rated"');
        cmLink.innerHTML = '';
        cmLink.classList.add('leaderboard-icon', 'white-icon', 'header-icon');
        cmLink.setAttribute('title', 'Leaderboards');

        cmLink = document.querySelector('.header-navigation .menu-site a[href="https://theshownation.com/faqs"');
        cmLink.innerHTML = '';
        cmLink.classList.add('faq-icon', 'white-icon', 'header-icon');
        cmLink.setAttribute('title', 'FAQs');

        cmLink = document.querySelector('.header-navigation .menu-site a[href="https://theshownation.com"');
        cmLink.innerHTML = '';
        cmLink.href = 'https://theshownation.com/forums/latest_activity';
        cmLink.classList.add('community-icon', 'white-icon', 'header-icon');
        cmLink.setAttribute('title', 'Community Forums');

        cmLink = document.querySelector('.header-navigation .menu-site a[href="/shop/stubs"');
        var cmParent = cmLink.parentNode;
        cmParent.classList.remove('has-submenu','top-level','open');
        cmParent.innerHTML = '';

        
        inventoryLink = document.createElement('a');
        inventoryLink.href = '/shop/stubs';
        inventoryLink.classList.add('buy-stubs-icon', 'header-icon', 'white-icon');
        inventoryLink.setAttribute('title', 'Buy Stubs');
        
        cmParent.append(inventoryLink);

        inventoryLi = document.createElement('li');
        inventoryLink = document.createElement('a');
        inventoryLink.href = '/shop/packs';
        inventoryLink.classList.add('buy-packs-icon', 'header-icon', 'white-icon');
        inventoryLink.setAttribute('title', 'Buy Packs');
        inventoryLi.append(inventoryLink);
        cmParent.parentNode.insertBefore(inventoryLi, cmParent.nextSibling);
        

        

        
        

    }
    else {
        setTimeout(iconizeMenu, 200);
    }
}
iconizeMenu();


