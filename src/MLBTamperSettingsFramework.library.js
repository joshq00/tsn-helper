import md5 from './lib/md5.js'
import {settings, schema, saveSettings} from './lib/settings.js'
import brutusin from './lib/brutusinForms.js'
import { inIframe, inExtensionIframe, show, hide, toggle } from './lib/helpers.js'
import moment from './lib/moment.js'

function tsnGo() {
    'use strict';
    if(typeof $ !== "undefined" &&  $('.global-logo a').length > 0 && document.getElementsByTagName('footer').length > 0){

        var doc = document;
        // Add hidden settings div

        var header = document.getElementsByClassName('global-topbar')[0];
        var headerFragment = document.createDocumentFragment();
        var settingsDiv = document.createElement('div');
        settingsDiv.id = 'tm-settings';
        settingsDiv.classList.add('header-inner');
        settingsDiv.classList.add('toggle-content');
        var settingsHeader = document.createElement('h2');
        settingsHeader.innerHTML = 'TSN Helper Settings';
        settingsDiv.appendChild(settingsHeader);
        var settingsForm = document.createElement('form');
        //settingsForm.id = 'tm-settings-form';
        // Create the settings form programatically
        var BrutusinForms = brutusin["json-forms"];
        var bf = BrutusinForms.create(schema);
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
                            var itemLi = document.createElement('li');
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
        var saveButton = document.createElement('button');
        saveButton.innerHTML = 'Save';
        saveButton.style.margin = '4px';
        saveButton.id = 'tsn-settings-save';
        settingsDiv.appendChild(saveButton);
        saveButton.addEventListener('click', function(e){
            saveSettings(bf.getData());
            // console.log(settings);
            //localStorage.setItem('tsn-settings', JSON.stringify(settings));
            toastr["success"]("TSN Helper Settings Updated","Saved");

            //console.log();
        });
        var saveReloadButton = document.createElement('button');
        saveReloadButton.innerHTML = 'Save &amp; Refresh';
        saveReloadButton.id = 'tsn-settings-save-refresh';
        saveReloadButton.style.margin = '4px';
        settingsDiv.appendChild(saveReloadButton);
        saveReloadButton.addEventListener('click', function(e){
            saveSettings(bf.getData());
            //settings.superSecretMd5 = md5(settings.superSecret);
            // console.log(settings);
            //localStorage.setItem('tsn-settings', JSON.stringify(settings));
            toastr["success"]("TSN Helper Settings Updated","Saved");
            window.location.reload()

            //console.log();
        });
        var closeButton = document.createElement('button');
        closeButton.innerHTML = 'Cancel';
        closeButton.id = 'tsn-settings-close';
        closeButton.style.margin = '4px';
        settingsDiv.appendChild(closeButton);
        closeButton.addEventListener('click', function(e){

            toggle(settingsDiv);
            hide(document.getElementById('tsn-settings-save-button0'));


            //console.log();
        });

        ;(() => {
            // clear buy and sell instructions
            var clearBuyButton = document.createElement('button');
            clearBuyButton.innerHTML = 'Clear Buy';
            clearBuyButton.style.margin = '4px';
            clearBuyButton.id = 'tsn-settings-clearBuy';
            settingsDiv.appendChild(clearBuyButton);
            clearBuyButton.addEventListener('click', function(e){
                localStorage.removeItem('buy')
                localStorage.removeItem('buyquantity')
                localStorage.removeItem('buyfor')
                // console.log(settings);
                //localStorage.setItem('tsn-settings', JSON.stringify(settings));
                toastr["success"]("Buy Cleared","clearBuyd");

                //console.log();
            });

            var clearSellButton = document.createElement('button');
            clearSellButton.innerHTML = 'Clear Sell';
            clearSellButton.style.margin = '4px';
            clearSellButton.id = 'tsn-settings-clearBuy';
            settingsDiv.appendChild(clearSellButton);
            clearSellButton.addEventListener('click', function(e){
                localStorage.removeItem('sellall')
                localStorage.removeItem('sellfor')
                // console.log(settings);
                //localStorage.setItem('tsn-settings', JSON.stringify(settings));
                toastr["success"]("Sell Cleared","clearSelld");

                //console.log();
            });
        })();

        //settingsDiv.appendChild(settingsForm);
        headerFragment.appendChild(settingsDiv);

        var contentContainer

        try {
            contentContainer = document.getElementsByClassName("page-wrap")[0];
        } catch(e) {
            contentContainer = document.getElementsByClassName("page-body-items-inner")[0];
        }
        console.log(contentContainer)

        try {
            contentContainer.prepend(headerFragment);
        } catch (e) {
            console.log("Settings framework error");
            contentContainer = document.querySelector("body");
            contentContainer.prepend(headerFragment);
        }

        // Add settings icon to navigation
        var menus = document.querySelectorAll('.global-menu .global-menu-links');
        for (var menu = 0; menu < menus.length; menu++){
            //$(menus).each(function(menu){
            var buttonFragment = document.createDocumentFragment();
            var li = document.createElement('li');
            var a = document.createElement('div');
            a.href="#";
            a.classList.add('header-icon', 'white-icon', 'settings-icon');
            var settingsButton = document.createElement('span');
            a.setAttribute('title', 'MLBTSN Helper Settings')
            //settingsButton.classList.add('settings-icon');
            settingsButton.classList.add('icon');
            // settingsButton.classList.add('button-small');
            settingsButton.id = 'tm-settings-button'+menu;

            a.appendChild(settingsButton);
            li.appendChild(a);
            var saveButtonId = 'tsn-settings-save-button'+menu;
            var menuIsOne = menu == 1;
            li.addEventListener('click', function(){
                toggle(document.getElementById('tm-settings'));


                document.getElementById('tm-settings').focus();
                toggle(document.getElementById(saveButtonId));

            });





            buttonFragment.appendChild(li);
            var li2 = document.createElement('li');
            var saveButton2 = document.createElement('span');
            saveButton2.classList.add('check-icon');
            saveButton2.classList.add('icon');
            saveButton2.id = 'tsn-settings-save-button'+menu;
            saveButton2.classList.add('toggle-content');
            a = document.createElement("a");
            a.href="#";
            a.appendChild(saveButton2);
            li2.appendChild(a);
            saveButton2.addEventListener('click', function(e){
                saveSettings(bf.getData());
                // console.log(settings);
                // localStorage.setItem('tsn-settings', JSON.stringify(settings));
                toastr["success"]("TSN Helper Settings Updated","Saved");

                //console.log();
            });
            buttonFragment.appendChild(li2);
            // console.log(menu);
            menus[menu].appendChild(buttonFragment);
        }



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
                                "escapeHtml": false,
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
                    console.log("Waiting to hijack toastr...");
                    setTimeout(waitForToastr, 250);
                }
            }
            waitForToastr();

            //Object.assign(toastrJack, window.toastr);


            var patreonDiv = document.createElement('div');
            patreonDiv.innerHTML = 'Using MLBTSN Helper by sreyemnayr. Unlock more features by saying thanks! <a href="https://www.patreon.com/bePatron?u=18905935" data-patreon-widget-type="become-patron-button">Become a Patron</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>';
            document.getElementsByTagName('footer')[0].insertBefore(patreonDiv, document.getElementsByTagName('footer')[0].firstChild);
            // $('footer').prepend(patreonDiv);

            // Display update dialog



        }
    }
    else {
        console.log("Waiting...");
        setTimeout(tsnGo, 250);
    }

}

tsnGo();

// TODO: Modularize these out of the settings Framework.

