// ==UserScript==
// @name         MLB The Show Nation Profit Reporter
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.4.9.3
// @description  Calculates the current profitability of a card and auto-fills the text box for Buy/Sell Orders with +/- 1 Stub.  DOES NOT AUTOMATE ORDERS AND NEVER WILL!
// @author       sreyemnayr
// @run-at       document-end
// @match        https://mlb19.theshownation.com/community_market/listings/*
// @grant        unsafeWindow
// @require https://greasyfork.org/scripts/40549-mlbtsncarddata/code/MLBTSNCardData.js?version=687788
// @require https://greasyfork.org/scripts/40553-mlbtsntampersettingsframework-2019/code/MLBTSNTamperSettingsFramework%202019.js?version=687787

// ==/UserScript==

var currentVersion = "2019.4.9.3";

var changelog = [];

changelog["2019.4.9.3"] = ['Lots of card sale data is now on the top of the page.',
                        'X hotkey to cancel outbid works again!'];

changelog["2019.4.8.1"] = ['Working on re-tooling toward using CM Helper logic - will add all data to card page when done', 
                            'Stop removing images in iFrame - didn\'t have desired effect',
                            'Buy/Sell chart shows all 200 historical orders now as well as a guess for which they were',
                            ]


showUpdates(currentVersion, changelog, 'ProfitReporter');

function xpathToArray(xpath, context=document) {
    var result = document.evaluate(xpath, context);
    var node, nodes = [];
    while (node = result.iterateNext()) {
        nodes.push(node);
    }
    return nodes;
}


(function() {
    'use strict';
   var cancelTarget;
    var page = document;

    if ( inIframe() ) {
        toastr = window.top.toastr;
        // $('img').attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');

        if ( $('.g-recaptcha').length > 0 )
        {
            toastr.warning('Recaptcha');
           // window.top.$('#helperFrame').css('width','500px');
        }
        else {
         
            toastr.warning('Safe');
        }

    }

/*
    var card = {
    buyOrders: Array,
    sellOrders: Array,
    get buyOrdersHeader() {
        return document.evaluate("//th[contains(.,'Order Date')]/following-sibling::th[contains(.,'Buy Order Price')]").iterateNext();
    },
    get buyOrdersTable() {
        var boh = this.buyOrdersHeader;

        if (boh != null) {
            console.log(boh.parentElement.parentElement.parentElement);
          return boh.parentElement.parentElement.parentElement
        }
        else { return undefined }
    },
    get sellOrdersHeader() {
        return document.evaluate("//th[contains(.,'Order Date')]/following-sibling::th[contains(.,'Sell Order Price')]").iterateNext();
    },
    get sellOrdersTable() {
        var boh = this.sellOrdersHeader;

        if (boh != null) {
            console.log(boh.parentElement.parentElement.parentElement);
          return boh.parentElement.parentElement.parentElement
        }
        else { return undefined }
    },

	get buyForm() {
		return page.getElementById("create-buy-order-form");
	},
	get buyFormInput() {
		return page.querySelector("#create-buy-order-form input#price")
	},
	get buyFormButton() {
		return page.querySelector("#create-buy-order-form button")
	},
	get sellForm() {
		return page.getElementById("create-sell-order-form");
	},
	get sellFormInput() {
		return page.querySelector("#create-sell-order-form input#price")
	},
	get sellFormButton() {
		return page.querySelector("#create-sell-order-form button")
	},
	get sellPrice() {
        try {
            return parseInt(page.querySelectorAll('[action*="sell_now"] #price')[0].value);
        }
        catch(e) {
            return this.buyPrice
        }
	},
	get buyPrice() {
		try {
            return parseInt(page.querySelectorAll('[action*="buy_now"] #price')[0].value);
        }
        catch(e) {
            return 0
        }
	},
    get sellable() {
     var _sellable = parseInt(document.evaluate("/html/body/div/div/div/div/div/div/div/div/div/div/div[contains(.,'Sellable |')]").iterateNext().textContent.replace("Sellable | ",""));
     return _sellable ? _sellable : 0;
    }

}
*/

/*

function checkSellOrders() {
  if(card.sellOrdersTable){
    for (var order of xpathToArray('.//td[img]', card.sellOrdersTable) ) {
       if ( parseInt(order.innerText.replace(",","")) > card.buyPrice ) {
           cancelTarget = $(order).parent().find('button')[0];
          order.style.color = "red";
       }
    }
  }
}


function checkBuyOrders() {
    if(card.buyOrdersTable){
        for (var order of xpathToArray('.//td[img]', card.buyOrdersTable) ) {
            if ( parseInt(order.innerText.replace(",","")) < card.sellPrice ) {
                cancelTarget = $(order).parent().find('button')[0];
                order.style.color = "red";
            }
        }
    }
}
*/
    var card = cardData(document.documentElement.innerHTML);

function moveBuyForm() {
    var buysDiv = document.createElement('div');
    buysDiv.style.display = "flex";
    buysDiv.innerHTML = "<h3 style='color:white; margin-right: 12px;'>BUY</h3>";
    
    buysDiv.append(card.buyForm);
	page.getElementsByClassName("title-layout-main")[0].prepend(buysDiv);
    $(card.buyForm).find('button')[0].innerHTML = "Create Buy Order";
    card.buyFormButton = $(card.buyForm).find('button')[0];
    for (var cancelButton of card.cancelBuyButtons) {
        buysDiv.append(cancelButton);
        if ($(cancelButton).find('button')[0].style.backgroundColor == "red") {
            cancelTarget = $(cancelButton).find('button')[0];
        }
        
    }
}

function moveSellForm(sellable=0) {
    var sellsDiv = document.createElement('div');
    sellsDiv.style.display = "flex";
    sellsDiv.innerHTML = "<h3 style='color:white; margin-right: 12px;'>SELL</h3>";
    
    if(sellable > 0) { sellsDiv.append(card.sellForm); }
	page.getElementsByClassName("title-layout-main")[0].prepend(sellsDiv);
    $(card.sellForm).find('button')[0].innerHTML = "Create Sell Order";
    card.sellFormButton = $(card.sellForm).find('button')[0];
    for (var cancelButton of card.cancelSellButtons) {
       sellsDiv.append(cancelButton);
       if ($(cancelButton).find('button')[0].style.backgroundColor == "red") {
        cancelTarget = $(cancelButton).find('button')[0];
    }
    }
}

function moveForms() {
	moveBuyForm();
	moveSellForm();
}

function incrementBuy() {
	//card.buyFormInput.value = card.sellPrice + 1;
    return true;
}

function incrementSell() {
	//card.sellFormInput.value = card.buyPrice - 1;
    return true;
}

function sell() {
    if (card.sellable > 0){
	incrementSell();
	card.sellFormButton.click();
    }
}


function buy() {
	incrementBuy();
	card.buyFormButton.click();
}

function doc_keyUp(e) {
    console.log(e.keyCode);
    if (e.target.tagName.toUpperCase() != 'INPUT')
    {
        switch(e.keyCode)
        {
            case 66: // b buys
                buy();
                break;
            case 83: // s sells
                sell();
                break;
            case 88: // x cancels
                cancelTarget.click();
                break;
            default:
                break;
        }
  }
}
document.addEventListener('keyup', doc_keyUp, false);





  var chart = new Chart(document.getElementById("completed-orders"), {
    "type": "line",
    "data": {
      "datasets": [
        { "data": card.history.sales, "fill": false, "backgroundColor": "#4B79A1", "borderColor": "#4B79A1", "showLine": false }
      ],
      "labels": card.history.buyOrSales,
    },
    "options": {
      "responsive": true,
      "maintainAspectRatio": false,
      "legend": {
        "display": false
      },
      "title": {
        "display": true,
        "text": "Completed Orders"
      }
    }
  });
    chart.update();

    

    var mainHeading = document.querySelector(".title-widget-main");
    
    //$('.marketplace-main-heading').append(li);
    // $(li).css('display','flex');
    // $(li).css('float','left');

    var cardDataDiv = document.createElement('div');
   cardDataDiv.style.color = 'white';
   cardDataDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
   var dataPoints = {
        
        'quickSellValue': "QuickSell",
        'profitMargin': "Profit",
        'exchangeValue': "Exchange",
        'soldLastHour': "Last Hour",
        'soldToday': "Today",
        'salesPerMinute': "Sales/min",
        'salesPerHour': "Sales/hour",
        'minutesPerSale': "Min/sale",
        'salesPerMinuteThisHour': "S/M this hour",
        'maxBuyNow': "Sell Max",
        'minBuyNow': "Sell Min",
        'minSellNow': "Buy Min",
        'maxSellNow': "Buy Max",
        'avgBuyNow': "Sell Avg",
        'avgSellNow': "Buy Avg",
        'avgProfit': "Avg Profit",
        'buyTrend': "Buy factor",
        'sellTrend': "Sell factor",
        'profitGap': "GAP",
        'ppm': "PPM",
        'roi': "ROI",
        'avgRoi': "Avg ROI"
    }

    var dataColors = {
        
        'quickSellValue': "orange",
        'profitMargin': "green",
        'exchangeValue': "orange",
        'soldLastHour': "yellow",
        'soldToday': "yellow",
        'salesPerMinute': "yellow",
        'salesPerHour': "yellow",
        'minutesPerSale': "yellow",
        'salesPerMinuteThisHour': "yellow",
        'maxBuyNow': "blue",
        'minBuyNow': "blue",
        'minSellNow': "blue",
        'maxSellNow': "blue",
        'avgBuyNow': "blue",
        'avgSellNow': "blue",
        'avgProfit': "green",
        'buyTrend': "yellow",
        'sellTrend': "yellow",
        'profitGap': "green",
        'ppm': "green",
        'roi': "green",
        'avgRoi': "yellow"
    }

    var cardDataRows = '';

    for (var prop in dataPoints) {
        cardDataRows += `
        <div class="player-attr-box">
        <div class="player-attr-name player-attr-name-${dataColors[prop]}">${dataPoints[prop]}</div>
        <div class="player-attr-number">${card[prop]}</div>
        </div>`
    }

   cardDataDiv.innerHTML = '<div class="player-attr-row">'+cardDataRows+'</div>';


page.getElementsByClassName("title-layout-main")[0].prepend(cardDataDiv);

    moveBuyForm();
    
    moveSellForm(card.sellable); 

    for ( var button of document.querySelectorAll("button[data-confirm='Are you sure?'") ) { button.dataset["confirm"] = false }

    // for ( var table of Array.from(document.querySelectorAll(".title-widget-main table")).slice(0,-2) ) { mainHeading.prepend(table); table.style.backgroundColor = "white"; table.style.color = "black"; }

    mainHeading.prepend(document.querySelector(".currency-widget-inner"));

    var buyOrdersTitle = document.evaluate("//th[contains(.,'Order Date')]/following-sibling::th[contains(.,'Buy Order Price')]").iterateNext()
    if (buyOrdersTitle != null) { var buyEl = document.createElement("small");
                                  buyEl.innerText=" ( " + card.buyNow + " ) "
                                  buyOrdersTitle.appendChild(buyEl);
                                }

    var sellOrdersTitle = document.evaluate("//th[contains(.,'Order Date')]/following-sibling::th[contains(.,'Sell Order Price')]").iterateNext()
    if (sellOrdersTitle != null) { var sellEl = document.createElement("small");
                                  sellEl.innerText=" ( " + card.sellNow + " ) "
                                  sellOrdersTitle.appendChild(sellEl);
                                 }

   incrementBuy();
    incrementSell();
    //checkSellOrders();
    //checkBuyOrders();
    $(card.buyForm).css('display','flex');
                $($(card.buyForm).find('#price')[0]).val(card.winningBuy ? card.sellNow : card.sellNow+1);
               // card.buyForm.target = "helperFrame";


                //$(this).parent().append(card.sellForm);
                //$(theForm).css('width','50%');
                $(card.sellForm).css('display','flex');
                $($(card.sellForm).find('#price')[0]).val(card.winningSell ? card.buyNow : card.buyNow-1);
               // card.sellForm.target = "helperFrame";

    // var formsDiv = document.createElement('div');
    // mainHeading.append(formsDiv);
    //$(formsDiv).css('display','flex');
    // $(formsDiv).css('float','right');

    // $(formsDiv).append(card.buyForm);
    // $('#create-buy-order-form').css('width','30%');
    // $('#create-buy-order-form').css('float','left');
    // $('#create-buy-order-form #price').val(sellNowPrice + 1);
    // $(formsDiv).append(card.sellForm);
    //$('#create-sell-order-form').css('width','30%');
    //$('#create-sell-order-form').css('float','left');
    //$('#create-sell-order-form #price').val(buyNowPrice - 1);

    // $('.marketplace-card').css('clear','both');
    //if ($('.toast').find('.toast-message')[0].innerHTML == 'reCAPTCHA failed.'){
   // $('#create-buy-order-form').find('button').click();
   // }

   

    if(settings.refreshInterval > 0 && ! inIframe()) {
setTimeout(function(){ window.location.reload(); }, (1000*parseInt(settings.refreshInterval))); // 1000 * seconds [(60) * minutes ]
}


})();