// ==UserScript==
// @name         MLB The Show Nation Community Market Helper 19
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.4.5.4
// @description  Expand community market search pages to include all pages. More features coming soon.
// @author       sreyemnayr
// @match        https://mlb19.theshownation.com/community_market*
// @exclude      https://mlb19.theshownation.com/community_market/listings/*
// @exclude      https://mlb19.theshownation.com/community_market/orders/*
// @require https://greasyfork.org/scripts/40549-mlbtsncarddata/code/MLBTSNCardData.js?version=686443
// @require https://greasyfork.org/scripts/40553-mlbtsntampersettingsframework-2019/code/MLBTSNTamperSettingsFramework%202019.js?version=686733

// ==/UserScript==
//var notified = false;


// md5 implementation from http://www.myersdaily.org/joseph/javascript/md5-text.html
function md5cycle(f,h){var i=f[0],n=f[1],r=f[2],g=f[3];i=ff(i,n,r,g,h[0],7,-680876936),g=ff(g,i,n,r,h[1],12,-389564586),r=ff(r,g,i,n,h[2],17,606105819),n=ff(n,r,g,i,h[3],22,-1044525330),i=ff(i,n,r,g,h[4],7,-176418897),g=ff(g,i,n,r,h[5],12,1200080426),r=ff(r,g,i,n,h[6],17,-1473231341),n=ff(n,r,g,i,h[7],22,-45705983),i=ff(i,n,r,g,h[8],7,1770035416),g=ff(g,i,n,r,h[9],12,-1958414417),r=ff(r,g,i,n,h[10],17,-42063),n=ff(n,r,g,i,h[11],22,-1990404162),i=ff(i,n,r,g,h[12],7,1804603682),g=ff(g,i,n,r,h[13],12,-40341101),r=ff(r,g,i,n,h[14],17,-1502002290),i=gg(i,n=ff(n,r,g,i,h[15],22,1236535329),r,g,h[1],5,-165796510),g=gg(g,i,n,r,h[6],9,-1069501632),r=gg(r,g,i,n,h[11],14,643717713),n=gg(n,r,g,i,h[0],20,-373897302),i=gg(i,n,r,g,h[5],5,-701558691),g=gg(g,i,n,r,h[10],9,38016083),r=gg(r,g,i,n,h[15],14,-660478335),n=gg(n,r,g,i,h[4],20,-405537848),i=gg(i,n,r,g,h[9],5,568446438),g=gg(g,i,n,r,h[14],9,-1019803690),r=gg(r,g,i,n,h[3],14,-187363961),n=gg(n,r,g,i,h[8],20,1163531501),i=gg(i,n,r,g,h[13],5,-1444681467),g=gg(g,i,n,r,h[2],9,-51403784),r=gg(r,g,i,n,h[7],14,1735328473),i=hh(i,n=gg(n,r,g,i,h[12],20,-1926607734),r,g,h[5],4,-378558),g=hh(g,i,n,r,h[8],11,-2022574463),r=hh(r,g,i,n,h[11],16,1839030562),n=hh(n,r,g,i,h[14],23,-35309556),i=hh(i,n,r,g,h[1],4,-1530992060),g=hh(g,i,n,r,h[4],11,1272893353),r=hh(r,g,i,n,h[7],16,-155497632),n=hh(n,r,g,i,h[10],23,-1094730640),i=hh(i,n,r,g,h[13],4,681279174),g=hh(g,i,n,r,h[0],11,-358537222),r=hh(r,g,i,n,h[3],16,-722521979),n=hh(n,r,g,i,h[6],23,76029189),i=hh(i,n,r,g,h[9],4,-640364487),g=hh(g,i,n,r,h[12],11,-421815835),r=hh(r,g,i,n,h[15],16,530742520),i=ii(i,n=hh(n,r,g,i,h[2],23,-995338651),r,g,h[0],6,-198630844),g=ii(g,i,n,r,h[7],10,1126891415),r=ii(r,g,i,n,h[14],15,-1416354905),n=ii(n,r,g,i,h[5],21,-57434055),i=ii(i,n,r,g,h[12],6,1700485571),g=ii(g,i,n,r,h[3],10,-1894986606),r=ii(r,g,i,n,h[10],15,-1051523),n=ii(n,r,g,i,h[1],21,-2054922799),i=ii(i,n,r,g,h[8],6,1873313359),g=ii(g,i,n,r,h[15],10,-30611744),r=ii(r,g,i,n,h[6],15,-1560198380),n=ii(n,r,g,i,h[13],21,1309151649),i=ii(i,n,r,g,h[4],6,-145523070),g=ii(g,i,n,r,h[11],10,-1120210379),r=ii(r,g,i,n,h[2],15,718787259),n=ii(n,r,g,i,h[9],21,-343485551),f[0]=add32(i,f[0]),f[1]=add32(n,f[1]),f[2]=add32(r,f[2]),f[3]=add32(g,f[3])}function cmn(f,h,i,n,r,g){return h=add32(add32(h,f),add32(n,g)),add32(h<<r|h>>>32-r,i)}function ff(f,h,i,n,r,g,t){return cmn(h&i|~h&n,f,h,r,g,t)}function gg(f,h,i,n,r,g,t){return cmn(h&n|i&~n,f,h,r,g,t)}function hh(f,h,i,n,r,g,t){return cmn(h^i^n,f,h,r,g,t)}function ii(f,h,i,n,r,g,t){return cmn(i^(h|~n),f,h,r,g,t)}function md51(f){txt="";var h,i=f.length,n=[1732584193,-271733879,-1732584194,271733878];for(h=64;h<=f.length;h+=64)md5cycle(n,md5blk(f.substring(h-64,h)));f=f.substring(h-64);var r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(h=0;h<f.length;h++)r[h>>2]|=f.charCodeAt(h)<<(h%4<<3);if(r[h>>2]|=128<<(h%4<<3),h>55)for(md5cycle(n,r),h=0;h<16;h++)r[h]=0;return r[14]=8*i,md5cycle(n,r),n}function md5blk(f){var h,i=[];for(h=0;h<64;h+=4)i[h>>2]=f.charCodeAt(h)+(f.charCodeAt(h+1)<<8)+(f.charCodeAt(h+2)<<16)+(f.charCodeAt(h+3)<<24);return i}var hex_chr="0123456789abcdef".split("");function rhex(f){for(var h="",i=0;i<4;i++)h+=hex_chr[f>>8*i+4&15]+hex_chr[f>>8*i&15];return h}function hex(f){for(var h=0;h<f.length;h++)f[h]=rhex(f[h]);return f.join("")}function md5(f){return hex(md51(f))}function add32(f,h){return f+h&4294967295}if("5d41402abc4b2a76b9719d911017c592"!=md5("hello"))function add32(f,h){var i=(65535&f)+(65535&h);return(f>>16)+(h>>16)+(i>>16)<<16|65535&i}
// End md5


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