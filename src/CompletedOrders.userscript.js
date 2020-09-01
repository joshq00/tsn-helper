import md5 from './lib/md5.js'
import settings from './lib/settings.js'
import showUpdates from './lib/showUpdates.js'
import moment from './lib/moment.js'

var currentVersion = "2019.4.15.2";

var changelog = [];

changelog["2019.4.15.2"] = ['Linked in for historical buys magic.'];

changelog["2019.4.8.1"] = ['Added TODAY running total'];

//changelog["2019.4.5.2"] = ['Recaptcha detection magic. Turn off the "show helper iframe" setting to see it in action'];

changelog["2019.4.5.1"] = ['Added new heatmap features for patrons - be sure to check settings and save!',
                       'Added patreon button to bottom of page for those who are interested in supporting development',
                       'Adjusted table displays to make room for more data',
                       'Started work on Recaptcha warnings to avoid problems',
                       'Added stubs balance to the header - where it should be...',
                       'Various style enhancements'];

showUpdates(currentVersion, changelog, 'CompletedOrdersHelper');


var allSales=[];
var numPages = 0;

var todayTotal = 0;

function getLinks(b){

    b = b.replace(/<img([^>]*)\ssrc=(['"])([^\2]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
    b = b.replace(/<script>[^<]+<\/script>/gi, "");

    //var links = [];

    b = $.parseHTML(b);
    //var team = $($(b).find('#team option:selected')[0]).text();

    $(b).find('.page-body table tbody tr').each(function(i){
        var item = $(this).find('a')[0];
        var itemName = item.text;
        var itemId = item.href.match(/[^\/]+$/g);

        if(!allSales[itemId]){
            allSales[itemId] = {'name': itemName, 'buys':Array(), 'sells':Array(), 'url': "https://theshownation.com/mlb20/items/"+itemId, 'mostRecentBuy': null, 'mostRecentSell': null };
        }

        var itemBuyOrSell = $(this).find('td')[1].innerText.match(/([^\s]+)\sfor/)[1];
        var itemPrice = parseInt($(this).find('td')[1].innerText.replace(/,/,'').match(/\d+/)[0]);

        var saleDateTd = $(this).find('td')[2];
        var dateStringTemplate = "M/D/YYYY h:mmA Z";
        var thisDate = moment(saleDateTd.textContent.replace(/PDT/g,"-0700"), dateStringTemplate);

        if (itemBuyOrSell == 'Sold'){
            allSales[itemId]['sells'].push(Math.round(itemPrice * .9));
            if ( thisDate.isSame(moment(), 'day') ) {
             todayTotal += Math.round(itemPrice * .9)
            }

            if ( allSales[itemId]['mostRecentSell'] == null ) {
              allSales[itemId]['mostRecentSell'] = thisDate;
            }
        }
        else{
        allSales[itemId]['buys'].push(itemPrice);
            if ( allSales[itemId]['mostRecentBuy'] == null ) {
              allSales[itemId]['mostRecentBuy'] = thisDate;
            }
            if ( thisDate.isSame(moment(), 'day') ) {
             todayTotal -= itemPrice;
            }
        }

        //var sellable = parseInt($($(this).parent().parent().find('.owned')[1]).text().match(/\d+/g));
        //links.push({'team': team, 'sellable': sellable, 'url': $(this).attr('href'), 'name':$($(this).parent().parent().find('.name')[0]).text(), 'rating':$($(this).parent().parent().find('.overall')[0]).text()});
        });
    //return links;
}
var sort;
(function() {
    'use strict';
var doneNum = 0;
var runningTotal=0;
    var runningProfitTotal=0;

    var localDataBuys = {};

                if(localStorage.hasOwnProperty('tsn-purchaseHistory')){
                    localDataBuys = JSON.parse(localStorage.getItem('tsn-purchaseHistory'));
                    }

                 localStorage.setItem('tsn-purchaseHistory',JSON.stringify(localDataBuys));

    var todayProfitTotal=0;

    //$('.inventory-list img').hide();
//console.log(parseInt(location.search.match(/[^\=]+$/g)));
    if(parseInt(location.search.match(/[^\=]+$/g)) <= 0){
        var table = document.createElement("table");
        table.id = "inventory-table";
        table.innerHTML = '<col>'.repeat(11)+'<thead>'+
            '<tr><th>Name</th><th title="Number of buys">#<sub>BUYS</sub></th><th title="Number of sells">#<sub>SELLS</sub></th>'+
            '<th title="Sum of buys">Σ<sub>BUYS</sub></th><th title="Sum of sells">Σ<sub>SELLS</sub></th>'+
            '<th title="Average buy price" style="text-transform: none;">μ<sub>BUY</sub></th><th title="Average sell price" style="text-transform: none;">μ<sub>SELL</sub></th>'+
            '<th title="Average profit" style="text-transform: none;">μ<sub>±</sub></th><th title="Total profit">Σ<sub>±</sub></th>'+
            '<th title="Most recent buy" data-sort-method="number">Δ<sub>BUY</sub></th><th title="Most recent sell" data-sort-default="true" data-sort-method="number">Δ<sub>SELL</sub></th>'+
            '</tr></thead><tbody id="inventory-table-body"></tbody>';
        $(document).tooltip();
        $('.page-body table').hide();
    $('.layout-primary').append(table);
    //numPages = parseInt($('.pagination').find('a')[$('.pagination').find('a').length-2].innerText);
        numPages = parseInt(location.search.match(/[^\=]+$/g)) * -1;
        if(numPages==0){numPages = parseInt($('.pagination').find('a')[$('.pagination').find('a').length-2].innerText);}
    var range = Array.apply(null, Array(numPages)).map(function (_, i) {return i;});

    //range.push(-1);

    var baseUrl = 'https://theshownation.com/mlb20/orders/completed_orders?page=';
    var fragment = document.createDocumentFragment();
    range.forEach(function(i){
        if(i!=0){
       var url = baseUrl+i;

        $.ajax({url:url, context:this}).done(function(b){

            getLinks(b);
            doneNum = doneNum + 1;

            if(doneNum == numPages - 1){
            //console.log(allSales);

                for (var key in allSales){
                    var i = allSales[key];
                    var numBuys = i.buys.length;
                    var numSells = i.sells.length;
                    var buysTotal = i.buys.reduce(function(t,n){return t+n;},0);
                    var sellsTotal = i.sells.reduce(function(t,n){return t+n;},0);
                    var buysAvg = Math.round(buysTotal / numBuys);
                    if(isNaN(buysAvg)){ buysAvg = 0;}
                    var sellsAvg = Math.round(sellsTotal / numSells);
                    if(isNaN(sellsAvg)){ sellsAvg = 0;}
                    var avgProfit = Math.round(sellsAvg - buysAvg);
                    if(sellsAvg == 0 || buysAvg == 0){avgProfit = 0;}
                    var lastBuy = numBuys > 0 ? i.buys[0] + ' <small style="font-style:italic">' + i.mostRecentBuy.fromNow(true) + '</small>': '';
                    var lastBuyData = numBuys > 0 ? i.mostRecentBuy.unix(): 0;
                    var lastSell = numSells > 0 ? i.sells[0] + ' <small style="font-style:italic">' + i.mostRecentSell.fromNow(true) + '</small>': '';
                    var lastSellData = numSells > 0 ? i.mostRecentSell.unix(): 0;
                    var tabularData = '<tr><td>'+i.name.substr(0,20)+'<a href="'+i.url+'"><span class="external-link-icon"></span></a></td><td>'+numBuys+'</td><td>'+numSells+'</td><td>'+buysTotal+'</td><td>'+sellsTotal+'</td><td>'+buysAvg+'</td><td>'+sellsAvg+'</td><td>'+avgProfit+'</td><td>'+(sellsTotal-buysTotal)+'</td><td data-sort="'+lastBuyData+'">'+lastBuy+'</td><td data-sort="'+lastSellData+'">'+lastSell+'</td></tr>';
                    //console.log(tabularData);
                    if ( !settings.ignoreSoloBuySell || ( numBuys + numSells > 1 ) ) {
                    $('#inventory-table-body').append(tabularData); }
                    runningTotal = runningTotal + (sellsTotal-buysTotal);
                    runningProfitTotal = runningProfitTotal - buysTotal + sellsTotal;
                    if (numBuys > 0 ) {
                        localDataBuys[key] = {"date": i.mostRecentBuy, "amount": i.buys[0]}
                    }
                }
                localStorage.setItem('tsn-purchaseHistory',JSON.stringify(localDataBuys));
                //$('#inventory-table-body').append(fragment);
                sort = new Tablesort(document.getElementById('inventory-table'), { descending: true });
                //$('#inventory-table').floatThead();
                console.log(runningTotal);
                var small = document.createElement('small');
                small.innerHTML = "("+runningProfitTotal+" total | "+todayTotal+" today)"
                $('.layout-primary').children()[0].append(small);

            }

        });

        }
    });

    }
    else
    {
        $($('.page-body').children()[0]).append("<small> [ <a href=\"https://theshownation.com/mlb20/orders/completed_orders?page=0\"> History </a> ]</small>");
    }

})();
