// ==UserScript==
// @name         MLB The Show Nation Community Market Helper 19
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.4.8.1
// @description  Expand community market search pages to include all pages. More features coming soon.
// @author       sreyemnayr
// @match        https://mlb19.theshownation.com/community_market*
// @exclude      https://mlb19.theshownation.com/community_market/listings/*
// @exclude      https://mlb19.theshownation.com/community_market/orders/*
// @require https://greasyfork.org/scripts/40549-mlbtsncarddata/code/MLBTSNCardData.js?version=686443
// @require https://greasyfork.org/scripts/40553-mlbtsntampersettingsframework-2019/code/MLBTSNTamperSettingsFramework%202019.js?version=686733

// ==/UserScript==
//var notified = false;

var currentVersion = "2019.4.8.1";

var changelog = [];

changelog["2019.4.8.1"] = ['Added ROI (everyone)', 
                            'Average Buy/Sell/Profit, Buy/Sell Factor (Patrons)',
                            'Improved ReCaptcha solution - zoom helper frame (Everyone)',
                            'Started work toward unifying into one script']

changelog["2019.4.5.2"] = ['Recaptcha detection magic. Turn off the "show helper iframe" setting to see it in action'];

changelog["2019.4.5.1"] = ['Added new heatmap features for patrons - be sure to check settings and save!',
                       'Added patreon button to bottom of page for those who are interested in supporting development',
                       'Adjusted table displays to make room for more data',
                       'Started work on Recaptcha warnings to avoid problems',
                       'Added stubs balance to the header - where it should be...',
                       'Various style enhancements'];

showUpdates(currentVersion, changelog, 'CommunityMarketHelper');

function pickHex(weight, temp="hot") {
    var color1, color2;
    if (temp == "hot") {
        color2 = [255,255,0];
        color1 = [255,0,0];
    }
    else if (temp == "warm") {
        color2 = [255,255,255];
        color1 = [255,255,0];
    }
    else {
        color2 = [0,0,255];
        color1 = [255,255,255];
    }
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    var rgba = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2),
        0.4];
    return rgba;
}


var notifiedURL = '';
var myTimeout;
var firstTime = {};
var firstTimeSell = {};
var notified = {};
var notifiedSell = {};
var helperFrame;
var tables;
var sort;

var settings;
if(localStorage.hasOwnProperty('tsn-settings')){
    settings = JSON.parse(localStorage.getItem('tsn-settings'));

   }
else{
    settings = {};
    settings.refreshInterval = 15;
    settings.refreshMarketInterval = 0;
    localStorage.setItem('tsn-settings',JSON.stringify(settings));
}

function marketHelper(onlyFavorites=false){
   // console.log("Debug1");
    clearTimeout(myTimeout);
   // console.log("Debug2");

    
    // $('.marketplace-filter-item-stats').hide();
    $('.item-name').css('width','20%');

    var cardSelector;
    if(onlyFavorites) { cardSelector = $(tables).find('td:nth-child(1):has(.favorites-icon-active) ~ td:nth-child(3) a'); }
    else { cardSelector = $(tables).find('td:nth-child(3) a'); }
    var howMany = cardSelector.length;
    var howManyDone = 0;

    cardSelector.each(function(i){

       var url = $(this).attr('href');
        if (!firstTime[url]) {
            this.innerHTML = this.textContent.replace(" ","<br />")
        }

        var thisBuyNowPrice = "";
        var thisSellNowPrice = "";
        var profitMargin = "";
        $.ajax({url:url, context:this}).done(function(b){
            howManyDone++;
            var card = cardData(b);
            if (card.errors.length > 1)
            {
                for (var e of card.errors) {
                  toastr["error"](e, "ERROR");
                }

            }
            else
            {
            //console.log(card);
            this.target = 'blank';
            $(this).parent().find('.helperDiv').remove();
            $(this).parent().find('#create-buy-order-form').remove();
            $(this).parent().find('#create-sell-order-form').remove();

            var thisDiv = document.createElement('div');
            thisDiv.className = 'helperDiv';
          

            $(this).parent().append(thisDiv);
            $(this).parent().css('display','flex');
         
            if(isNaN(card.profitMargin)){
               card.profitMargin = -99999;
            }
            if(isNaN(card.minutesPerSale)){
               card.profitMargin = 99999;
            }
            /*
            $(this).parent().append("<div class=\"helperDiv\" style=\"line-height:1em; \"><span style=\"font-size:80%; display:block;\">"+
                                                              "Buy: <span class=\"stubs\"> </span>"+
                                                              card.buyNow+
                                                              " <span style=\"font-size:80%;\"> ("+card.minBuyNow+"-"+card.maxBuyNow+")</span></span>  <span style=\"font-size:80%; display:block;\">Sell: <span class=\"stubs\"> </span> "+
                                                              card.sellNow+
                                                              " <span style=\"font-size:80%;\">("+card.minSellNow+"-"+card.maxSellNow+")</span></span>  <span style=\"font-size:80%; display:block; \">Profit: <span class=\"stubs\"> </span> "+
                                                              card.profitMargin+" <span style=\"font-size:80%;\"> (GAP "+card.profitGap+")</span><span style=\"font-size:80%; display:block; \">Sellable:  "+
                                                              card.sellable+"</span><span style=\"font-size:80%; display:block; \">Rate:  "+
                                                              card.minutesPerSale+" min/sale ("+card.soldLastHour+"/hr)</span><span style=\"font-size:80%; display:block\">"+
                                                              (card.profitMargin / (card.minutesPerSale * 2)).toFixed(2)+" PP/M</span></div>");
            */

                //$(this).css('color','white');
            $(this).parent().css('display','flex');
            $(this).parent().parent().parent().css('background-color','');
            if(isNaN(card.profitMargin)){
               card.profitMargin = -1000;
            }

            // $(this).parent().parent().parent().css('order',1000-(card.profitMargin / (card.minutesPerSale * 2)).toFixed(0));
                if (card[settings.heatFactor] < 0 ) {
                 bgcolor = 'rgba(0,0,255,0.45)';
             }
             else if( card[settings.heatFactor] > settings.hotness ){
                bgcolor = 'rgba(255,0,0,0.45)';
            }
            else if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
                var bgcolor = '';
             
            if ( settings.hotness >= card[settings.heatFactor] && card[settings.heatFactor] > settings.warmness ) {
                bgcolor = 'rgba('+pickHex(parseFloat( ( ( card[settings.heatFactor] - settings.coolness) / ( settings.hotness - settings.coolness ) ).toFixed(2) ), "hot" ).join()+') !important';
            }
            else if ( settings.warmness >= card[settings.heatFactor] && card[settings.heatFactor] > settings.coolness ) {
                bgcolor = 'rgba('+pickHex(parseFloat( ( ( card[settings.heatFactor] - settings.coolness) / ( settings.warmness - settings.coolness ) ).toFixed(2) ), "warm" ).join()+') !important';
            }
                else {
                    bgcolor = 'rgba('+pickHex(parseFloat( ( card[settings.heatFactor] / settings.coolness ).toFixed(2) ) , "cool" ).join()+') !important';
                }
                

            }
                $(this).parent().parent().css('background-color',bgcolor+' !important');
            
                var favoriteTd = $(this).parent().parent().find('td:nth-child(1)');

                $(favoriteTd[0]).attr("data-sort", $(favoriteTd[0]).find('.favorites-icon-active').length > 0 ? 1 + parseFloat(card.ppm * 0.00001).toFixed(5) : parseFloat(card.ppm * 0.00001).toFixed(5));

                var imgTd = $(this).parent().parent().find('td:nth-child(2)');
                imgTd[0].innerHTML = '';

                for ( var cancelButton of card.cancelButtons ) {
                    $(imgTd).append(cancelButton);
                    cancelButton.target = "helperFrame"
                }

                var buyTd = $(this).parent().parent().find('td:nth-child(5)');
                buyTd[0].innerHTML = card.buyNow;
                $(buyTd).attr("data-sort", card.buyNow);
                if (card.sellable > 0) {
                buyTd.append(card.sellForm);
                var sellButton = $(card.sellForm).find("button")[0];
                sellButton.innerHTML = "+S";
                sellButton.style.padding = "1px";
                sellButton.style.height = "100%"
                var sellInput = $(card.sellForm).find("input#price")[0];
                sellInput.style.padding = "0px";
                }

                var sellTd = $(this).parent().parent().find('td:nth-child(6)');
                sellTd[0].innerHTML = card.sellNow;
                $(sellTd).attr("data-sort", card.sellNow);
                sellTd.append(card.buyForm);
                var buyButton = $(card.buyForm).find('button')[0]
                buyButton.innerHTML = "+B";
                buyButton.style.padding = "1px";
                buyButton.style.height = "100%"
                var buyInput = $(card.buyForm).find("input#price")[0];
                buyInput.style.padding = "0px";

                var profitTd = $(this).parent().parent().find('td:nth-child(7)');
                profitTd[0].innerHTML = card.profitMargin;

                var sellableTd = $(this).parent().parent().find('td:nth-child(8)');
                sellableTd[0].innerHTML = card.sellable;

                var roiTd = $(this).parent().parent().find('td:nth-child(9)');
                roiTd[0].innerHTML = card.roi;

                if ( card.sellable > 1 ) {
                  sellableTd[0].style.fontWeight = "bold";
                }
                else
                {
                    sellableTd[0].style.fontWeight = "normal";
                }

                if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {



                var sphTd = $(this).parent().parent().find('td:nth-child(10)');
                sphTd[0].innerHTML = card.minutesPerSale;

                var ppmTd = $(this).parent().parent().find('td:nth-child(11)');
                ppmTd[0].innerHTML = card.ppm;

                var gapTd = $(this).parent().parent().find('td:nth-child(12)');
                gapTd[0].innerHTML = card.profitGap;

                var avgBuyTd = $(this).parent().parent().find('td:nth-child(13)');
                avgBuyTd[0].innerHTML = card.avgSellNow;

                var buyTrendTd = $(this).parent().parent().find('td:nth-child(14)');
                buyTrendTd[0].innerHTML = card.sellTrend;

                var avgSellTd = $(this).parent().parent().find('td:nth-child(15)');
                avgSellTd[0].innerHTML = card.avgBuyNow;

                var sellTrendTd = $(this).parent().parent().find('td:nth-child(16)');
                sellTrendTd[0].innerHTML = card.buyTrend;

                var avgProfitTd = $(this).parent().parent().find('td:nth-child(17)');
                avgProfitTd[0].innerHTML = card.avgProfit;
                }


                //$(theForm).css('width','50%');
                $(card.buyForm).css('display','flex');
                $($(card.buyForm).find('#price')[0]).val(card.winningBuy ? card.sellNow : card.sellNow+1);
                card.buyForm.target = "helperFrame";


                //$(this).parent().append(card.sellForm);
                //$(theForm).css('width','50%');
                $(card.sellForm).css('display','flex');
                $($(card.sellForm).find('#price')[0]).val(card.winningSell ? card.buyNow : card.buyNow-1);
                card.sellForm.target = "helperFrame";
                //$($(this).parent().parent().children()[1]).append("<div class=\"helperDiv\" style=\"background-color:yellow; color:red\"><span class=\"stubs\"> </span> "+thisSellNowPrice+"</div>");
            firstTime[url] = 1;
                document.getElementById('helperStubsDiv').innerHTML = card.balance.textContent;


        if (howManyDone == howMany) {
            sort.refresh();
            setRefresh();
        }
            }
        });

    });
}


function orderHelper(){
    //$('.helperDiv').remove();
    toastr.clear();
    var table_headers = $('.items-results-table thead')[0];
    $(table_headers).find('th:nth-child(4)')[0].innerHTML = "OVR";
    $(table_headers).find('th:nth-child(1)').attr("data-sort-default", true);
    if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
    $(table_headers).find('th:nth-child(6)').after("<th data-sort-method=\"number\" title=\"Profit\">±</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Sellable\">#</th>"+
                                                    "<th data-sort-method=\"number\" title=\"Return on Investment\">ROI</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Minutes per sale (last 200)\">m/s</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Potential Profit per Minute\">PP/m</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Estimated historical Buy/Sell gap\">Gap</th>"+
                                                   "<th title=\"Average buy price\" style=\"text-transform: none;\">μ<sub>BUY</sub></th>"+
                                                   "<th title=\"Buy Difference to Average\" style=\"text-transform: none;\">ƒ<sub>BUY</sub></th>"+
                                                   "<th title=\"Average sale price\" style=\"text-transform: none;\">μ<sub>SELL</sub></th>"+
                                                  "<th title=\"Sell Difference to Average\" style=\"text-transform: none;\">ƒ<sub>SELL</sub></th>"+
                                                    "<th title=\"Average profit\" style=\"text-transform: none;\">μ<sub>±</sub></th>"+

                                                  "");

    }
    else
    {
        $(table_headers).find('th:nth-child(6)').after("<th data-sort-method=\"number\" title=\"Profit\">±</th><th data-sort-method=\"number\" title=\"Sellable\">#</th><th>ROI</th>");

    }
    $(document).tooltip();

    tables = $('.items-results-table tbody')[0];
    if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
    $(tables).find('tr td:nth-child(6)').after("<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>");
    }
    else
    {
        $(tables).find('tr td:nth-child(6)').after("<td>0</td><td>0</td>");
    }
    //$(tables).find('tr td:nth-child(2) img').each( function(i) {
    //    $(this).src("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
    //});
    $(tables).find('tr td:nth-child(2) img').attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    $(tables).find('tr td:nth-child(1)').each(function(i)
        {
            $(this).attr("data-sort", $(this).find('.favorites-icon-active').length > 0 ? 1 : 0);
        });

    //tables.style.display = 'flex';
    //tables.style.flexDirection = 'column';
    var numPages = 1;
        try {numPages = parseInt($('.pagination').find('a')[$('.pagination').find('a').length-2].innerText);}
        catch(error) { console.log(error);}
       // console.log(numPages);
    if(numPages > 15){
    numPages = 15;
    }

    if(numPages > 1){
    

    var baseUrl = window.location.href;

    var range = Array.apply(null, Array(numPages)).map(function (_, i) {return i;});
    range.shift();
       // console.log(range);
    var doneNum = 1;
    range.forEach(function(i){
        //console.log(i);

       var url = baseUrl.replace("?","?page="+(i+1)+"&");
        // console.log(url);

        $.ajax({url:url, context:this}).done(function(b){
            //console.log(tables);
            var stuff = $(b).find('.items-results-table tbody').children();
            for (var tr of stuff) {
                $(tr).find('td:nth-child(2) img').attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')

                if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
                    $(tr).find('td:nth-child(6)').after("<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>");
                }
                else
                {
                    $(tr).find('td:nth-child(6)').after("<td>0</td><td>0</td><td>0</td>");
                }
                tables.append(tr);
            }
            doneNum = doneNum + 1;
            if(doneNum == numPages){
                sort = new Tablesort(document.getElementsByClassName('items-results-table')[0], { descending: true });
                marketHelper()
            }

        });
    });
    }
    else
    {
               sort = new Tablesort(document.getElementsByClassName('items-results-table')[0], { descending: true });
               marketHelper();
    }

    

    


//firstTime = false;
}

function setRefresh(interval=undefined) {
    // console.log("Debug3");

var refreshInterval = interval ? interval : settings.refreshMarketInterval * 1000 ;
    if (refreshInterval > 0){
        myTimeout = setTimeout(marketHelper.bind(null, true),refreshInterval);
    }
}


(function() {
    'use strict';

    toastr.options = {"closeButton": true,
                      "timeOut": 5000,
                      "extendedTimeOut": 5000,
                      "hideDuration":20,
                      "preventDuplicates": true,
                     };
    //$('.marketplace-main-heading').children()[0].append(" ("+$('.order').length+")");
    //$('.marketplace-main-heading').append('<div style="float:right">Refresh interval: <input id="refresh-interval" size="5" value=".5"></input></div>');
    
    
    //myTimeout = setTimeout(orderHelper,60000);

   

     helperFrame = document.createElement('iframe');
    helperFrame.id = 'helperFrame';
    helperFrame.style.webkitTransform = 'scale(1.5)';
    helperFrame.style.transformOrigin = '0 0';
    helperFrame.style.height ='300px';
    helperFrame.style.width = '500px';
    helperFrame.style.zIndex = '99999';
    helperFrame.style.position = 'fixed';
    helperFrame.style.bottom = '1px';


    helperFrame.name = 'helperFrame';
    // helperFrame.sandbox = 'allow-same-origin';
    if (!settings.showBuyFrame ) {
        helperFrame.style.height ='1px';
    }
    $('.sidebar-section-top-inner').append(helperFrame);
    helperFrame.onload = function(){
                      //  toastr["success"]("Order created","Done!");
                        marketHelper(true);
                        
                        }
    
    if(location.search.match(/[^\/]+$/g) != null){
    orderHelper();
    }

    //setTimeout(completedOrders,(1000*15));



})();