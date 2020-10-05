import md5 from './lib/md5.js'
import settings from './lib/settings.js'
import showUpdates from './lib/showUpdates.js'
import cardData from './MLBTSNCardData.library.js'
import moment from './lib/moment.js'


var topOrderHashPageOne = '';

function completedOrdersCheck(page=1, topOrderHashPageOne = '') {
    if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' || md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
        if ( typeof $ !== "undefined" && typeof toastr !== "undefined") {
            var url = 'https://theshownation.com/mlb20/orders/completed_orders';
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

            fetch(url).
                then( function(response) {
                    if (response.ok) {
                        return response.text()
                    } else {
                        var error = new Error(response.statusText)
                        error.response = response
                        throw error
                    }
                } ).
                then( function (text) {
                    text = text.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
                    text = text.replace(/<script>[^<]+<\/script>/gi, "");
                    text = text.replace(/<link[^>]+>/gi, "");
                    var frag = document.createRange().createContextualFragment(text);
                    var allOrders = frag.querySelectorAll('.section-block tbody tr');
                    var topOrder = allOrders[0];
                    const topOrderHash = md5(topOrder.innerHTML);

                    if ( page == 1 ) { topOrderHashPageOne = topOrderHash; }

                    console.log(topOrderHash, topOrderHashPageOne, lastCompletedOrderHash);

                    if (topOrderHash != lastCompletedOrderHash) {



                        var foundLast = false;

                        for ( const orderTr of allOrders ) {
                            if ( !foundLast ) {
                                if ( md5(orderTr.innerHTML) == lastCompletedOrderHash  ) {
                                    foundLast = true;
                                    localStorage.setItem('tsn-completedHash', topOrderHashPageOne);
                                }
                                else {
                                    var item = orderTr.querySelector('a');
                                    var itemName = item.textContent;
                                    var itemId = item.href.match(/[^\/]+$/g)[0];

                                    var itemBuySellInfo =orderTr.querySelector('td:nth-child(2)')
                                    var itemBuyOrSell = itemBuySellInfo.innerText.match(/([^\s]+)\sfor/)[1];
                                    var itemPrice = parseInt( itemBuySellInfo.innerText.replace(/,/,'').match(/\d+/)[0] );

                                    var saleDateTd = orderTr.querySelector('td:nth-child(3)');
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

                                        chrome.runtime.sendMessage(extensionId, {"notifyChrome": settings.chromeNotifications, "notifyWeb": settings.webNotifications, "itemName": itemName, "itemBuyOrSell": itemBuyOrSell, "itemPrice": itemPrice, "itemId": itemId}, function(response) {
                                            console.log(response.msg);
                                        });



                                    }
                                }

                            }
                            else {
                                localStorage.setItem('tsn-completedHash', topOrderHashPageOne );
                            }

                        }
                        localStorage.setItem('tsn-purchaseHistory',JSON.stringify(localDataBuys));
                        if(!foundLast &&  lastCompletedOrderHash !=  md5('') && page <= 10) {
                            completedOrdersCheck(page+1, topOrderHashPageOne);
                        }
                        else {
                            localStorage.setItem('tsn-completedHash', topOrderHashPageOne );
                            openOrdersInterval = setInterval(openOrdersCheck,5000);
                        }
                    }
                    else {
                        localStorage.setItem('tsn-completedHash', topOrderHashPageOne );
                        openOrdersInterval = setInterval(openOrdersCheck,5000);

                    }
                }).catch( function(e) {
                    console.log(e);
                });
            /*
        $.ajax({url:url}).done(function(b){
            b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
            // console.log(b);
            b = b.replace(/<script>[^<]+<\/script>/gi, "");
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
            b = $.parseHTML(b);



            var topOrder = $(b).find('.completed-orders-table tbody tr')[0];
            const topOrderHash = md5(topOrder.innerHTML);

            //console.log(topOrderHash, lastCompletedOrderHash);

            if (topOrderHash != lastCompletedOrderHash)
            {
                if(page == 1) { topOrderHashPageOne = topOrderHash;  }

                //console.log("new order");

                var foundLast = false;

            $(b).find('.completed-orders-table tbody tr').each(function(i){
                if (md5(this.innerHTML) == lastCompletedOrderHash ) {
                    foundLast = true;
                    localStorage.setItem('tsn-completedHash', topOrderHashPageOne );
                }
                if (!foundLast) {
                    var item = $(this).find('a')[0];
                    var itemName = item.text;
                    var itemId = item.href.match(/[^\/]+$/g)[0];

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
    */
}
else {
    setTimeout(completedOrdersCheck, 200);
}
}
}

var buysAmount = 0;
var sellsAmount = 0;
var balanceAmt = 0;
var balancePlusBuysAmt = 0;

function openOrdersCheck() {
    clearInterval(openOrdersInterval);

    if ( typeof $ !== "undefined" ) {

        var url = 'https://theshownation.com/mlb20/orders/open_orders';
        $.ajax({url:url}).done(function(b){
            b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
            // console.log(b);
            b = b.replace(/<script>[^<]+<\/script>/gi, "");
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
            b = $.parseHTML(b);
            console.log(b);
            var numBuys = $($(b).find('.section-block').first()).find('tbody tr').length;
            console.log(numBuys);

            var numSells = $($(b).find('.section-block').last()).find('tbody tr').length;
            console.log(numSells);
            buysAmount = 0;
            sellsAmount = 0;

            if ( numBuys > 0 ) {
                $($(b).find('.section-block').first()).find('tbody tr td:nth-child(3)').each( function(i) {

                    buysAmount = buysAmount + parseInt($(this)[0].textContent.replace(/[^\d]/gi, ''));
                });

            }
            if ( numSells > 0 ) {
                $($(b).find('.section-block').last()).find('tbody tr td:nth-child(3)').each( function(i) {
                    sellsAmount = sellsAmount + Math.floor(parseInt($(this)[0].textContent.replace(/[^\d]/gi, '')) * .9);
                });

            }
            localStorage.setItem('tsn-numBuys',numBuys);
            localStorage.setItem('tsn-numSells',numSells);
            localStorage.setItem('tsn-buysAmount',buysAmount);
            localStorage.setItem('tsn-sellsAmount',sellsAmount);

            completedOrdersCheck();
            initialStubsCheck();

            chrome.runtime.sendMessage(extensionId, {"numBuys": numBuys, "numSells": numSells, "buysAmount": buysAmount, "sellsAmount": sellsAmount}, function(response) {
                console.log(response.msg);
            });

        });

    }
    else{
        console.log("Waiting.........")
        setTimeout(openOrdersCheck, 200)
    }

}

var openOrdersInterval = setInterval(openOrdersCheck,20000);

var doneInitial = false;
function initialStubsCheck() {
    if (typeof $ !== "undefined" ) {
        // var url = 'https://theshownation.com/mlb20/dashboard';
        var url = 'https://theshownation.com/mlb20/shop/packs';
        $.ajax({url:url}).done(function(b){
            b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
            // console.log(b);
            b = b.replace(/<script>[^<]+<\/script>/gi, "");
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
            // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
            b = $.parseHTML(b);
            try {
                balanceAmt = parseInt($(b).find('div.well.stubs')[0].textContent.replace(/[^\d]/gi,''));
                balancePlusBuysAmt = balanceAmt + buysAmount;
                localStorage.setItem('tsn-balanceAmt',balanceAmt);
                localStorage.setItem('tsn-balancePlusBuysAmt',balancePlusBuysAmt);
                chrome.runtime.sendMessage(extensionId, {"balanceAmt": balanceAmt, "balancePlusBuysAmt": balancePlusBuysAmt}, function(response) {
                    console.log(response.msg);
                });
            } catch (e) {
                console.log(e)
            }
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
