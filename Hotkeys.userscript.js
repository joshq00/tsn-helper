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

    if ($('a[href="/sessions/login"]').length > 0) {
        $('a[href="/sessions/login"]')[0].click()
    }

})();