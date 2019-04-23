import md5 from './lib/md5.js'
import {settings, schema} from './lib/settings.js'
import brutusin from './lib/brutusinForms.js'
import { inIframe, inExtensionIframe, show, hide, toggle } from './lib/helpers.js'

function tsnGo() {
    'use strict';
    if(typeof $ !== "undefined" &&  $('.header-logo a').length > 0){
    
    var doc = document;
    // Add hidden settings div
    var logo = $('.header-logo')[0];
    logo.style.display = 'flex';
    var outerStubsDiv = doc.createElement('div');
    outerStubsDiv.style.color = 'white';
    outerStubsDiv.style.display = 'inline-block';
    outerStubsDiv.style.marginLeft = '5px';
    var stubsDiv = doc.createElement('div');
    stubsDiv.id = 'helperStubsDiv';
    stubsDiv.style.display = 'flex';
    stubsDiv.style.flexDirection = 'column';
    var stubsSubDiv = doc.createElement('div');
    stubsSubDiv.id = 'helperStubsSubDiv';
    stubsSubDiv.style.display = 'flex';
    stubsSubDiv.style.flexDirection = 'column';
    outerStubsDiv.append(stubsDiv);
    outerStubsDiv.append(stubsSubDiv);
    
    var stubsDiv2 = doc.createElement('div');
    stubsDiv2.id = 'helperStubsDiv2';
    stubsDiv2.style.color = 'white';
    stubsDiv2.style.display = 'inline-block';
    stubsDiv2.style.marginLeft = '5px';
    logo.append(outerStubsDiv);
    logo.append(stubsDiv2);
    var header = doc.getElementsByClassName('header-container')[0];
    var headerFragment = doc.createDocumentFragment();
    var settingsDiv = doc.createElement('div');
      settingsDiv.id = 'tm-settings';
      settingsDiv.classList.add('header-inner');
      settingsDiv.classList.add('toggle-content');
      var settingsHeader = doc.createElement('h2');
      settingsHeader.innerHTML = 'TSN Helper Settings';
      settingsDiv.appendChild(settingsHeader);
      var settingsForm = doc.createElement('form');
      //settingsForm.id = 'tm-settings-form';
         // Create the settings form programatically
         var BrutusinForms = brutusin["json-forms"];
         var bf = BrutusinForms.create(schema);
         console.log(bf);
         BrutusinForms.addDecorator(function (element, schema) {
             if(element.tagName)
             {
                 var tag = element.tagName.toLowerCase();
                 if (tag == 'input') {
                     var elementTitle = element.title.toLowerCase();
                     if (elementTitle == "tsn url for card"){
                         element.classList.add("card-url-input");
                     }
                     if (elementTitle == "card name") {
                         element.classList.add("card-name-input");
                         
                     }
                     if (elementTitle == "search for cards"){
                         $(element).autocomplete({
                             source: "community_market/quick_search.json",
                             minLength: 2
                         }).autocomplete("instance")._renderItem = function(ul, item) {
                             var itemName = item.template.match(/name'>([^<]+)/)[1];
                             var itemUrl = item.template.match(/href=['"]([^'"?]+)/)[1];
                             item.template = item.template.replace('<a href','<span');
                             item.template = item.template.replace('href','data-href');
                             var itemLi = doc.createElement('li');
                             itemLi.innerHTML = item.template;
                             itemLi.addEventListener('click', function(e){
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-name-input').value = itemName;
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-name-input').onchange();
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-url-input').value = itemUrl;
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-url-input').onchange();
    
                             });
    
                             return $(itemLi).appendTo(ul);
                         };
                     }
                 }
                 
             }
         });
         BrutusinForms.postRender = function(instance){
             var form = instance.getRenderingContainer();
             form.querySelectorAll('input.card-name-input').forEach(function(element){
                 var parentTr = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                 /*var par = element;
                 for(var i=0;i<=10;i++){
                     par = par.parentNode;
                     console.log(i, par);
                 }*/
                 //console.log(parentTr);
                         var cardName = element.value;
                 if(cardName != ""){
                 parentTr.querySelector('.item-value').classList.add('toggle-content');
                     parentTr.querySelector('.item-action').classList.add('toggle-content');
                 }
                         var td = document.createElement('td');
                         td.classList.add("toggle-content");
                         td.classList.add("is-visible");
                         td.classList.add("item-description");
                         td.innerHTML = cardName;
                 var span = document.createElement('span');
                 span.innerHTML = cardName;
                 span.classList.add("toggle-content");
                 span.classList.add("is-visible");
                 parentTr.querySelector('.item-index').appendChild(span);


                 td.addEventListener('click',function(){
                             toggle(parentTr.querySelector('.item-value'));
                             toggle(parentTr.querySelector('.item-action'));
                             toggle(span);
                             toggle(td);
                         });
                 parentTr.querySelector('.item-index').addEventListener('click',function(){
                             toggle(parentTr.querySelector('.item-value'));
                             toggle(parentTr.querySelector('.item-action'));
                             toggle(span);
                             toggle(td);
                 });

                 parentTr.insertBefore(td,parentTr.querySelector('.item-value'));



             });
         };
         bf.render(settingsDiv, settings);
      var saveButton = doc.createElement('button');
       saveButton.innerHTML = 'Save';
    saveButton.style.margin = '4px';
       saveButton.id = 'tsn-settings-save';
      settingsDiv.appendChild(saveButton);
      saveButton.addEventListener('click', function(e){
          settings = bf.getData();
          settings.superSecretMd5 = md5(settings.superSecret);
          // console.log(settings);
          localStorage.setItem('tsn-settings', JSON.stringify(settings));
          toastr["success"]("TSN Helper Settings Updated","Saved");

      //console.log();
      });
    var saveReloadButton = doc.createElement('button');
       saveReloadButton.innerHTML = 'Save &amp; Refresh';
       saveReloadButton.id = 'tsn-settings-save-refresh';
       saveReloadButton.style.margin = '4px';
      settingsDiv.appendChild(saveReloadButton);
      saveReloadButton.addEventListener('click', function(e){
          settings = bf.getData();
          settings.superSecretMd5 = md5(settings.superSecret);
          // console.log(settings);
          localStorage.setItem('tsn-settings', JSON.stringify(settings));
          toastr["success"]("TSN Helper Settings Updated","Saved");
          window.location.reload()

      //console.log();
      });
    var closeButton = doc.createElement('button');
       closeButton.innerHTML = 'Cancel';
       closeButton.id = 'tsn-settings-close';
    closeButton.style.margin = '4px';
      settingsDiv.appendChild(closeButton);
      closeButton.addEventListener('click', function(e){

          toggle(settingsDiv);
          hide(doc.getElementById('tsn-settings-save-button0'));
          hide(doc.getElementById('tsn-settings-save-button1'));

      //console.log();
      });
      //settingsDiv.appendChild(settingsForm);
      headerFragment.appendChild(settingsDiv);


    var contentContainer = document.getElementsByClassName("layout-wrapper")[0];
    contentContainer.prepend(headerFragment);

    // Add settings icon to navigation
	var menus = doc.getElementsByClassName('menu-site');
    $(menus).each(function(menu){
        var buttonFragment = doc.createDocumentFragment();
        var li = doc.createElement('li');
        var a = doc.createElement('a');
        a.href="#";
        var settingsButton = doc.createElement('span');
        settingsButton.classList.add('settings-icon');
        settingsButton.classList.add('icon');
        // settingsButton.classList.add('button-small');
          settingsButton.id = 'tm-settings-button'+menu;
          
          a.appendChild(settingsButton);
          li.appendChild(a);
          li.addEventListener('click', function(){
           toggle(doc.getElementById('tm-settings'));
              toggle(doc.getElementById('tsn-settings-save-button'+menu));
              menu == 1 ? $('.site-offcanvas-controls-close')[0].click(): true;
          doc.getElementById('tm-settings').focus();
          });





          buttonFragment.appendChild(li);
        var li2 = doc.createElement('li');
         var saveButton2 = doc.createElement('span');
           saveButton2.classList.add('check-icon');
            saveButton2.classList.add('icon');
           saveButton2.id = 'tsn-settings-save-button'+menu;
        saveButton2.classList.add('toggle-content');
            a = doc.createElement("a");
            a.href="#";
            a.appendChild(saveButton2);
          li2.appendChild(a);
          saveButton2.addEventListener('click', function(e){
              settings = bf.getData();
              // console.log(settings);
              localStorage.setItem('tsn-settings', JSON.stringify(settings));
              toastr["success"]("TSN Helper Settings Updated","Saved");

          //console.log();
          });
        buttonFragment.appendChild(li2);
           // console.log(menu);
        menus[menu].appendChild(buttonFragment);
    });

    

    // add patreon div to footer
    if (!inIframe()){

        function waitForToastr(){
            if(typeof toastr !== "undefined"){
               
            // hijack toastr.warning to be able to intercept it for recaptcha crap
            let toastrJack = Object.assign({}, toastr);

            Object.defineProperty(toastr, "options", {
              get : function () {
                return {"closeButton": true,
                      "timeOut": 10000,
                      "extendedTimeOut": 5000,
                      "hideDuration":20,
                      "preventDuplicates": true,
                      "positionClass": "toast-top-right",
                     };
              }
            });

            toastr.success = function(e = undefined, t = undefined, n = undefined) {
                console.log(e, t, n);
                toastrJack.success(e, t, n);
            }
            toastr.info = function(e = undefined, t = undefined, n = undefined ) {
                var splitE = e.split('||');
                e = splitE[0];
                console.log(splitE);
                if ( typeof marketHelper !== "undefined") {
                    marketHelper(false, "/community_market/listings/"+splitE[1])
                }
                toastrJack.info(e,t,n);
            }
            toastr.warning = function(e = undefined, t = undefined, n = undefined) {
                
                if(e != "Safe")
                {
                        document.getElementById('helperFrame').style.height = '100%';
                        document.getElementById('helperFrame').style.transform = 'scale(1.5,1.5)';

                    toastrJack.warning(e,t,n);
                }
                else
                {
                    document.getElementById('helperFrame').style.transform = '';
                    if (!settings.showBuyFrame ) {
                        document.getElementById('helperFrame').style.height = '1px';
                    }
                    else {
                        document.getElementById('helperFrame').style.height = '300px';

                    }
                }
            };
            
        }
        else{
            console.log("Still not set");
            setTimeout(waitForToastr, 250);
        }
    }
    waitForToastr();

        //Object.assign(toastrJack, window.toastr);


        var patreonDiv = document.createElement('div');
        patreonDiv.innerHTML = 'Using MLBTSN Helper by sreyemnayr. Unlock more features by saying thanks! <a href="https://www.patreon.com/bePatron?u=18905935" data-patreon-widget-type="become-patron-button">Become a Patron</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>';
        $('footer').prepend(patreonDiv);

        // Display update dialog
        


    }
    }
    else {
        setTimeout(tsnGo, 250);
    }

}

tsnGo();

// TODO: Modularize these out of the settings Framework.

var topOrderHashPageOne = '';

function completedOrdersCheck(page=1) {
    if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' || md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
    if ( typeof $ !== "undefined" && typeof toastr !== "undefined") {
var url = 'https://mlb19.theshownation.com/community_market/orders/completed';
if ( page > 1 ) {
    url += '?page='+page;
}
var foundLast = false;

let lastCompletedOrderHash = '';

if(localStorage.hasOwnProperty('tsn-completedHash')){
    lastCompletedOrderHash = localStorage.getItem('tsn-completedHash');
    }
    else{
        lastCompletedOrderHash =  md5('');
        localStorage.setItem('tsn-completedHash', lastCompletedOrderHash );
    }
            var localDataBuys = {};
                if(localStorage.hasOwnProperty('tsn-purchaseHistory')){
                    localDataBuys = JSON.parse(localStorage.getItem('tsn-purchaseHistory'));
                    }
                 
                 localStorage.setItem('tsn-purchaseHistory',JSON.stringify(localDataBuys));

        // console.log(url);

        $.ajax({url:url}).done(function(b){
            b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
           // console.log(b);
            b = b.replace(/<script>[^<]+<\/script>/gi, "");
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
            b = $.parseHTML(b);

            

            var topOrder = $(b).find('.completed-orders-table tbody tr')[0];
            const topOrderHash = md5(topOrder.innerHTML);
            
            console.log(topOrderHash, lastCompletedOrderHash);

            if (topOrderHash != lastCompletedOrderHash)
            {
                if(page == 1) { topOrderHashPageOne = topOrderHash;  }

                console.log("new order");

                var foundLast = false;

            $(b).find('.completed-orders-table tbody tr').each(function(i){
                if (md5(this.innerHTML) == lastCompletedOrderHash ) {
                    foundLast = true;
                    localStorage.setItem('tsn-completedHash', topOrderHashPageOne );
                }
                if (!foundLast) {
                    var item = $(this).find('a')[0];
                    var itemName = item.text;
                    var itemId = item.href.match(/[^\/]+$/g);

                    var itemBuyOrSell = $(this).find('td')[1].innerText.match(/([^\s]+)\sfor/)[1];
                    var itemPrice = parseInt($(this).find('td')[1].innerText.replace(/,/,'').match(/\d+/)[0]);

                    var saleDateTd = $(this).find('td')[2];
                    var dateStringTemplate = "M/D/YYYY h:mmA Z";
                    var thisDate = moment(saleDateTd.textContent.replace(/PDT/g,"-0700"), dateStringTemplate);

                    

                    if (itemBuyOrSell != 'Sold'){
                    
                        if(!localDataBuys[itemId]){
                            localDataBuys[itemId] = {'date': thisDate, 'amount': itemPrice };
                        }
                        else if (moment(localDataBuys[itemId]['date']).isBefore(thisDate) ) {
                            localDataBuys[itemId] = {'date': thisDate, 'amount': itemPrice };
                        }
                        
                    }
                    if ( thisDate.isSame(moment(), 'day') ) {
                        if(settings.chromeNotifications) {
                        chrome.runtime.sendMessage(extensionId, {"itemName": itemName, "itemBuyOrSell": itemBuyOrSell, "itemPrice": itemPrice, "itemId": itemId}, function(response) {
                            console.log(response.msg);
                        });
                        }
                        if(settings.webNotifications) {
                        toastr.info(`${itemName} ${itemBuyOrSell} for ${itemPrice}||${itemId}`);
                        }
                    }
                }

                //var sellable = parseInt($($(this).parent().parent().find('.owned')[1]).text().match(/\d+/g));
                //links.push({'team': team, 'sellable': sellable, 'url': $(this).attr('href'), 'name':$($(this).parent().parent().find('.name')[0]).text(), 'rating':$($(this).parent().parent().find('.overall')[0]).text()});
                });
                localStorage.setItem('tsn-purchaseHistory',JSON.stringify(localDataBuys));
                if(!foundLast &&  lastCompletedOrderHash !=  md5('') && page <= 10) {
                    completedOrdersCheck(page+1);
                }
                else {
                    localStorage.setItem('tsn-completedHash', topOrderHashPageOne );
                    openOrdersInterval = setInterval(openOrdersCheck,5000);
                }

            }
            else
            {
                console.log("No new order")
                openOrdersInterval = setInterval(openOrdersCheck,5000);
            }

            
            

        });
        }
        else {
            setTimeout(completedOrdersCheck, 200);
        }
    }
}

var buyAmount = 0;
var sellAmount = 0;
var balanceAmt = 0;
var balancePlusBuysAmt = 0;

function openOrdersCheck() {
    clearInterval(openOrdersInterval);
    // https://mlb19.theshownation.com/community_market/orders/open
    if ( typeof $ !== "undefined" && $('#helperStubsDiv2').length > 0) {
        
        var url = 'https://mlb19.theshownation.com/community_market/orders/open';
        $.ajax({url:url}).done(function(b){
            b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
           // console.log(b);
            b = b.replace(/<script>[^<]+<\/script>/gi, "");
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
            b = $.parseHTML(b);
            var numBuys = $(b).find('.buy-orders-table tbody tr').length;
            var numSells = $(b).find('.sell-orders-table tbody tr').length;
            buyAmount = 0;
            sellAmount = 0;

            if ( numBuys > 0 ) {
                $(b).find('.buy-orders-table tbody tr td:nth-child(2)').each( function(i) {
                    
                    buyAmount = buyAmount + parseInt($(this)[0].textContent.replace(/[^\d]/gi, ''));
                });
                
            }
            if ( numSells > 0 ) {
                $(b).find('.sell-orders-table tbody tr td:nth-child(2)').each( function(i) {
                    sellAmount = sellAmount + parseInt($(this)[0].textContent.replace(/[^\d]/gi, ''));
                });
                
            }

            completedOrdersCheck();
            initialStubsCheck();

            $('#helperStubsDiv2')[0].innerHTML = `<small style="display:flex; flex-direction:column">${numBuys} open buys @ ${buyAmount}</small><small style="display:flex; flex-direction:column">${numSells} open sells @ ${sellAmount}</small>`;
            chrome.runtime.sendMessage(extensionId, {"openBuys": numBuys, "openSells": numSells}, function(response) {
                console.log(response.msg);
             });
        });

    }
    else{
        setTimeout(openOrdersCheck, 200)
    }

}
var openOrdersInterval = setInterval(openOrdersCheck,20000);

var doneInitial = false;
function initialStubsCheck() {
    if (typeof $ !== "undefined" && $('#helperStubsDiv').length > 0) {
        var url = 'https://mlb19.theshownation.com/dashboard';
        $.ajax({url:url}).done(function(b){
            b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
           // console.log(b);
            b = b.replace(/<script>[^<]+<\/script>/gi, "");
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
            b = $.parseHTML(b);
            balanceAmt = parseInt($(b).find('.currency-widget-amount')[0].textContent.replace(/[^\d]/gi,''));
            balancePlusBuysAmt = balanceAmt + buyAmount;
            document.getElementById('helperStubsDiv').innerHTML = '<span><img class="inline-icon-sm" src="https://s3.amazonaws.com/the-show-websites/mlb19_portal/5/img/shared/stubs.png">'+balanceAmt.toLocaleString()+'</span>';
            document.getElementById('helperStubsSubDiv').innerHTML = '<small style="font-style:italic; color:#a55a5a">'+balancePlusBuysAmt.toLocaleString()+"</small>";

        });
        if(!doneInitial){
            doneInitial = true;
            openOrdersCheck();
        }

    }
    else {
        setTimeout(initialStubsCheck, 200)
    }

}
initialStubsCheck();
