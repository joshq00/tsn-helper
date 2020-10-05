let settings = JSON.parse(localStorage.getItem('tsn-settings'))

// sort array ascending
const asc = arr => [...arr].sort((a,b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
  const mu = mean(arr);
  const diffArr = arr.map(a => (a - mu) ** 2);
  return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

const quantile = (arr, q) => {
  const sorted = asc(arr);
  const pos = ((sorted.length) - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if ((sorted[base + 1] !== undefined)) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

const q25 = arr => quantile(arr, .25);

const q50 = arr => quantile(arr, .50);

const q75 = arr => quantile(arr, .75);

const median = arr => q50(arr);

const fixDate = dat => new Date((dat + "").replace( /(?<=\w)(?=[AP]M)/, ' ' ))
const fixAmount = amount => parseInt(( amount + "" ).replace(/[^\d]+/gi, ''))

const isWithin = (lo, hi) => v => lo <= v && v <= hi;
const isNotOutlierIn = (arr) => {
  if (arr.length < 4) return () => true;
  const q1 = q25(arr)
  const q3 = q75(arr)
  const iqr = q3 - q1;
  return isWithin( q1 - iqr * 1.5, q3 + iqr * 1.5 )
}

var exchangeValues = {
  "player": {
    "40":100,
    "41":100,
    "42":100,
    "43":100,
    "44":100,
    "45":100,
    "46":100,
    "47":100,
    "48":100,
    "49":100,
    "50":100,
    "51":100,
    "52":100,
    "53":100,
    "54":100,
    "55":100,
    "56":100,
    "57":100,
    "58":100,
    "59":100,
    "60":100,
    "61":106,
    "62":128,
    "63":156,
    "64":191,
    "65":233,
    "66":285,
    "67":349,
    "68":429,
    "69":529,
    "70":651,
    "71":805,
    "72":997,
    "73":1238,
    "74":1541,
    "75":1922,
    "76":2404,
    "77":3013,
    "78":3788,
    "79":4775,
    "80":6037,
    "81":7655,
    "82":9737,
    "83":12425,
    "84":15909,
    "85":20442,
    "86":26363,
    "87":34130,
    "88":44363,
    "89":57909,
    "90":75926,
    "91":100000,
    "92":100000,
    "93":100000,
    "94":100000,
    "95":100000,
    "96":100000,
    "97":100000,
    "98":100000,
    "99":100000
  },
  "equipment":{
    "silver":200,
    "gold":1000,
    "diamond":0

  },
  "unlockable":{
    "silver":200,
    "gold":1000,
    "diamond":0
  },
  "stadium":{
    "silver":200,
    "gold":1000,
    "diamond":0
  },
};

var quickSellValues = {
  "player": {
    "common":5,
    "bronze":25,
    "silver":100,
    "gold":1000,
    "diamond":5000
  },
  "equipment":{
    "silver":25,
    "gold":100,
    "diamond":1000
  },
  "sponsorship":{
    "silver":25,
    "gold":100,
    "diamond":500
  },
  "unlockable":{
    "silver":100,
    "gold":500,
    "diamond":1000
  },
  "stadium":{
    "bronze": 10,
    "silver":25,
    "gold":1000,
    "diamond":1000
  },


};
var localDataBuys = {};
var doOnce = false;
function cardData(b, doc=false, id='') {
  let $b = $(b)
  if (document.location.hash == '#disable') { return }
  var lastBuyAmt = 0;
  var lastBuyDate = null;
  var myProfit = null;

  if(id != '') {
    if(localStorage.hasOwnProperty('tsn-purchaseHistory')){
      localDataBuys = JSON.parse(localStorage.getItem('tsn-purchaseHistory'));
    }
  }

  if(!doc) {
    b = b.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
    // console.log(b);
    b = b.replace(/<script>[^<]+<\/script>/gi, "");
    // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/logos/logo2_wsh.png','https://s3.amazonaws.com/mlb17-shared/dist/7/img_teams/cap/logo2_wsh.png');
    // b = b.replace('https://s3.amazonaws.com/mlb-theshownation/tsn18/4/img/actionshots/3785374b5e5df43203dc02054105cf58.jpg','https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg');
    b = $.parseHTML(b);
    $b = $(b)
  }
  var errors = [];
  if($('a[href="/sessions/login"]').length > 0)
  {
    errors.push('Re-authenticate');
    return { 'errors': errors }
    // Login problems! Uhoh!
  }
  else
  {
    // console.log(b);
    var name = ""
    try { name = $b.find('h1')[0].textContent.trim().split('\n').slice(-1)[0];} catch (e) { console.log(e);}
    // var name = $($b.find('.marketplace-main-heading .name')[0]).text();
    if (name==""){
      name = $($b.find('h2')[0]).text().textContent.trim().split('\n').slice(-1)[0];
    }
    try{var jersey = $($b.find('.player-info-number')[0]).text().match(/\d+/)[0];}
    catch(error){jersey='';}

    var rating = $($b.find('.mlb20-card-rarity')[0]).text();
    var buyForm = $b.find('#create-buy-order-form')[0];
    try { $(buyForm).html($(buyForm).html().replace('Price','')) } catch (e) { console.log(e); }
    try { var buyInput = buyForm.querySelector('#price'); } catch (e) { console.log(e); }
    try { var buyButton = buyForm.querySelector('button');  } catch (e) { console.log(e); }
    try { buyInput.setAttribute('placeholder', '');  } catch (e) { console.log(e); }


    var sellForm = $b.find('#create-sell-order-form')[0];
    try {
      $(sellForm).find('.seller-tax')[0].innerHTML = "<div id=\"taxed-price\" style=\"display:none;\">0</div>";

    } catch(e) { console.log(e); };
    try { $(sellForm).html($(sellForm).html().replace('Price','')) } catch(e) { console.log(e); }
    try {
      var sellInput = sellForm.querySelector('#price');
      sellInput.setAttribute('placeholder', '');
      var sellButton = sellForm.querySelector('button');
    }  catch(e) { console.log(e); }

    var buyNowForm = $b.find('.market-forms-quick form')[0];
    var sellNowForm = $b.find('.market-forms-quick form')[1];



    //var cardImage = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/3/img/shared/default-actionshot.jpg';
    try{var teamLogo = $($b.find('img.card-team-logo')[0]).data('src');}
    catch(error){ teamLogo = 'https://s3.amazonaws.com/mlb-theshownation/tsn18/8/img/shared/mlb19-pre-order-small.png'; console.log(error);}
    var cardClass = '';
    var shield = '';




    try {
      var cardImage = $b.find('.section-items-primary div img')[0].getAttribute('src');
    } catch (e) {
      console.log(e)
    }
    var cardType = '';
    var quickSellValue = 0;
    var exchangeValue = 0;

    var cardElement = {
      player: '.mlb20-card-actionshot-wrapper',
      equipment: '.mlb20-card-equipment-wrapper',
      stadium: '.mlb20-card-stadium-wrapper',
      sponsorship: '.mlb20-card-sponsorship-wrapper',
      unlockable: '.mlb20-card-unlockable-wrapper',
    }

    if ($b.find(cardElement.player).length > 0){  cardType = 'player';  exchangeValue = exchangeValues['player'][rating]; }
    else if ($b.find(cardElement.equipment).length > 0){  cardType = 'equipment';  }
    else if ($b.find(cardElement.stadium).length > 0){  cardType = 'stadium';  }
    else if ($b.find(cardElement.sponsorship).length > 0){  cardType = 'sponsorship';  }
    else if ($b.find(cardElement.unlockable).length > 0){  cardType = 'unlockable';  }

    try {
      if(cardType=='player') {
        if (!!$b.find('.mlb20-card-rarity')[0].style.backgroundImage.match('common')){  cardClass = 'common';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-common.png';}
        else if (!!$b.find('.mlb20-card-rarity')[0].style.backgroundImage.match('bronze')){  cardClass = 'bronze';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-bronze.png'; }
        else if (!!$b.find('.mlb20-card-rarity')[0].style.backgroundImage.match('silver')){  cardClass = 'silver';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-silver.png'; }
        else if (!!$b.find('.mlb20-card-rarity')[0].style.backgroundImage.match('gold')){  cardClass = 'gold';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-gold.png'; }
        else if (!!$b.find('.mlb20-card-rarity')[0].style.backgroundImage.match('diamond')){  cardClass = 'diamond';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-diamond.png';}
      } else {
        if (!!$b.find(cardElement[cardType])[0].style.backgroundImage.match('common')){  cardClass = 'common';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-common.png';}
        else if (!!$b.find(cardElement[cardType])[0].style.backgroundImage.match('bronze')){  cardClass = 'bronze';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-bronze.png'; }
        else if (!!$b.find(cardElement[cardType])[0].style.backgroundImage.match('silver')){  cardClass = 'silver';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-silver.png'; }
        else if (!!$b.find(cardElement[cardType])[0].style.backgroundImage.match('gold')){  cardClass = 'gold';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-gold.png'; }
        else if (!!$b.find(cardElement[cardType])[0].style.backgroundImage.match('diamond')){  cardClass = 'diamond';  shield = 'https://s3.amazonaws.com/the-show-websites/mlb19_portal/2/img/rarity/shield-diamond.png';}

      }
    } catch(e) { console.log(e); }

    console.log(cardType);

    try{ quickSellValue = quickSellValues[cardType][cardClass];}
    catch(error){ console.log(error)
    }

    if ( cardType != 'player' ) {
      try{ exchangeValue = exchangeValues[cardType][cardClass];}
      catch(error){ exchangeValue = 0;
        console.log(error);
      }
    }

    var buyNow = 999999;
    try { buyNow = parseInt($b.find('[action*="buy_now"] #price')[0].value); }
    catch(error) { buyNow = 999999; }
    var sellNow = 0;
    try { sellNow = parseInt($b.find('[action*="sell_now"] #price')[0].value); }
    catch(error) { sellNow = quickSellValue; }

    var profitMargin = parseInt(buyNow * 0.90 - sellNow);

    if ( localDataBuys.hasOwnProperty(id) ) {
      lastBuyAmt = parseInt(localDataBuys[id]['amount']);
      lastBuyDate = localDataBuys[id]['date'];
      myProfit = parseInt(buyNow * 0.90 - lastBuyAmt);

    }

    var outbidBuy = false;
    var outbidSell = false;
    var winningBuy = false;
    var winningSell = false;

    /*
    var buyOrdersHeader = $b.find("th:contains('Order Date') ~ th:contains('Buy Order Price')")[0];
    var buyOrdersTable = null;
    if(buyOrdersHeader != null) {
      buyOrdersTable = buyOrdersHeader.parentElement.parentElement.parentElement;
      //console.log(buyOrdersTable);
      $(buyOrdersTable).find("tbody tr").each(function(i) {
        var buyAmt = parseInt($(this).find("td:nth-child(3)")[0].textContent.replace(/[^\d]/gi, ''));
        // console.log(buyAmt);
        var cancelForm = $(this).find("form")[0];
        var cancelButton = $(cancelForm).find("button")[0];
        cancelButton.innerHTML = "B: "+buyAmt+" <span class='close-button-icon'></span>";
        if (buyAmt < sellNow) {
          outbidBuy = true;
          cancelButton.style.backgroundColor = 'red';
          document.title = '*B ' + document.title;
        }
        else if (buyAmt == sellNow ) {
          winningBuy = true;
          cancelButton.style.backgroundColor = 'black';
        }
        cancelButton.dataset["confirm"] = false
        cancelBuyButtons.push(cancelForm);
        numBuys++;
        //console.log(cancelForm);
      }
      );
    }
    */

    try {
      var balance = $b.find('.stubs')[0];
      var balanceAmt = fixAmount(balance.textContent);
      var balanceStr = '<span><img class="inline-icon-sm" src="https://s3.amazonaws.com/the-show-websites/mlb19_portal/5/img/shared/stubs.png">'+balanceAmt.toLocaleString()+"</span>";
    } catch (e) {
      console.log(e);
    }

    const findOrders = (buyOrSell) => () => (
      [...$b.find(`tr[id^=${buyOrSell}-order-]`)]
        .map($)
        .map(tr => ({
          cancelForm: tr.find('form')[0],
          cancelButton: tr.find('form button')[0],
          amount: fixAmount(tr.children()[2].textContent),
          placed: new Date(fixDate(tr.children()[1].textContent)),
        }))
    )
    const findBuys = findOrders('buy')
    const findSells = findOrders('sell')

    const sells = findSells()
    sells.forEach( ({ cancelForm, cancelButton, amount, placed }) => {
      cancelButton.innerHTML = `S: ${amount} <span class='close-button-icon'></span>`;
      cancelButton.classList.add('sell')
      if (amount === buyNow) {
        cancelButton.style.backgroundColor = 'black';
        cancelButton.classList.add('winning')
        winningSell = true
      } else {
        cancelButton.classList.add('losing')
      }
      cancelButton.removeAttribute('data-confirm');
    })
    const cancelSellButtons = sells.map(({ cancelForm }) => cancelForm)
    const numSells = sells.length

    const buys = findBuys()
    buys.forEach( ({ cancelForm, cancelButton, amount, placed }) => {
      cancelButton.innerHTML = `B: ${amount} <span class='close-button-icon'></span>`;
        cancelButton.classList.add('buy')
      if (amount === sellNow) {
        cancelButton.style.backgroundColor = 'black';
        cancelButton.classList.add('winning')
        winningBuy = true
      } else {
        cancelButton.classList.add('losing')
      }
      cancelButton.removeAttribute('data-confirm');
    })
    if ($b[0] === document) {
      (() => {
        const minSell = Math.min(...sells.map(a => a.amount))
        const maxBuy = Math.max(...buys.map(a => a.amount))
        if (sells.length > 0 && minSell > buyNow) {
          document.title = '*S ' + document.title
        }
        if (buys.length > 0 && maxBuy < sellNow) {
          document.title = '*B ' + document.title
        }
      })()
    }
    const numBuys = buys.length
    const cancelBuyButtons = buys.map(({ cancelForm }) => cancelForm)


      /*
    var sellOrdersHeader = $b.find("th:contains('Order Date') ~ th:contains('Sell Order Price')")[0];
    var sellOrdersTable = null;
    if(sellOrdersHeader != null) {
      sellOrdersTable = sellOrdersHeader.parentElement.parentElement.parentElement;
      $(sellOrdersTable).find("tbody tr").each(function(i) {
        var buyAmt = parseInt($(this).find("td:nth-child(3)")[0].textContent.replace(/[^\d]/gi, ''));
        console.log(buyAmt);
        var cancelForm = $(this).find("form")[0];
        var cancelButton = $(cancelForm).find("button")[0];
        cancelButton.innerHTML = "S: "+buyAmt+" <span class='close-button-icon'></span>";
        console.log(buyAmt, buyNow, typeof(buyAmt), typeof(buyNow))
        if (buyAmt > buyNow) {
          outbidSell = true;
          cancelButton.style.backgroundColor = 'red';
          document.title = '*S ' + document.title;
        }
        else if (buyAmt == buyNow ) {
          winningSell = true;
          cancelButton.style.backgroundColor = 'black';
        }
        cancelButton.dataset["confirm"] = false
        cancelSellButtons.push(cancelForm);
        numSells++;
        //console.log(cancelForm);
      }
      );
    }
    */

    //var sellable = parseInt($($b.find('html body div div div div div div div div div div div:contains("Sellable")')[0]).text().match(/\d+/g));
    // console.log(b);
    var sellable = 0; var owned = 0;
    try{  sellable = parseInt($b.find('div.well:contains("Sellable")')[0].textContent.replace("Sellable | ", ""));
      owned = parseInt($b.find('div.well:contains("Owned")')[0].textContent.replace("Owned | ", "")); }
    catch(error) { console.log(error); }

    // var dates = [];
    // var sales = [];

    // var dateStringTemplate = "M/D/YYYY h:mmA Z";

    const allSales = $b.find('#table-completed-orders tbody tr').toArray()
      .map( (el) => ( {
        amount: fixAmount( el.children[0].innerText ),
        date: ( fixDate( el.children[1].innerText ) ),
      } ) )
    const dates = allSales.map( ({ date }) => date )
    const sales = allSales.map( ({ amount }) => amount )

    var filteredSales = sales.filter( isNotOutlierIn( sales ) );
    var maxSale = Math.max(...sales);
    var minSale = Math.min(...sales);
    var maxFilteredSale = Math.max(...filteredSales);
    var minFilteredSale = Math.min(...filteredSales);
    var range = maxSale - minSale;
    var rangeFiltered = maxFilteredSale - minFilteredSale;
    var middle = maxFilteredSale - Math.round(rangeFiltered / 2);
    var sellNows = [];
    var buyNows = [];
    var buyOrSales = [];
    var lastValue = sales[0];
    var maxGap = 0;
    sales.forEach(function(v, i){
      var diff = Math.abs(v-lastValue);
      if ( diff > maxGap ) { maxGap = diff };
      if (v > middle){
        buyNows.push(v);
        buyOrSales[i] = 'buy';
      }
      else{
        sellNows.push(v);
        buyOrSales[i] = 'sale';
      }
      lastValue = v;
    });
    var filteredBuyNows = [];
    var filteredSellNows = [];
    filteredSales.forEach(function(v, i){
      if (v > middle){
        filteredBuyNows.push(v);

      }
      else{
        filteredSellNows.push(v);

      }
    });
    var avgBuyNow = Math.round(filteredBuyNows.reduce(function(t,n){return t+n;},0) / filteredBuyNows.length);
    var avgSellNow = Math.round(filteredSellNows.reduce(function(t,n){return t+n;},0) / filteredSellNows.length);
    var avgProfit = Math.round((avgBuyNow - avgSellNow) * 0.9);

    var buyTrend = Math.round((1 - (avgBuyNow / buyNow)) * 100);
    var sellTrend = Math.round((1 - (avgSellNow / sellNow)) * 100) * -1;

    sellNows.sort(function(a, b){return b-a;});
    buyNows.sort(function(a, b){return b-a;});

    var maxBuyNow = Math.max(...buyNows);
    var minSellNow = Math.min(...sellNows);
    var maxSellNow = Math.max(...sellNows);
    var minBuyNow = Math.min(...buyNows);


    if (buyNow == 999999) {
      buyNow = maxBuyNow;
      profitMargin = parseInt(buyNow * 0.90 - sellNow);
    }

    var profitGap = Math.round((minBuyNow - maxSellNow)*0.9);
    // ROI = Net Profit / Total Investment * 100
    var roi = Math.round ( ( profitMargin / ( sellNow + 1 ) ) * 100 );
    var roiAvg = Math.round ( ( avgProfit / avgSellNow ) * 100 );


    var numHour = 0;
    var numThreeHours = 0;
    var numToday = 0;

    var thisHourDates = [];


    if(!doOnce){
      doOnce = true;
      //console.log(thisHourDates);

    }

    var dateText = '';
    //var thisHourDiffMins = Math.round( (now-thisHourMinDate) / 60000 );
    var salesPerMinute = Math.round( ( ( dates.length ) / 60000 ) * 100 ) / 100;
    var minutesPerSale = Math.round( ( ( dates.length ) / 60000 ) * 100 ) / 100;
    var salesPerMinuteThisHour = Math.round( ( 100 / 60) * 100 ) / 100;
    var minutesPerSaleThisHour = Math.round( ( 60 / 100 ) * 100 ) / 100;


    var salesPerHour = Math.round( ( dates.length / ( 100  / 1000 / 60 / 60 ) ) * 100 ) / 100;

    var ppm = ( profitMargin / (minutesPerSale * 2) ).toFixed(2)

    if ( $b.find('.g-recaptcha').length > 0 ) {
      errors.push("Recaptcha");
    }

    var perExchange = Math.round ( (exchangeValue / (sellNow + 1) * 100) ) / 100 ;

    try {
      sellInput.value = winningSell ? parseInt(buyNow).toLocaleString() : parseInt(buyNow - 1).toLocaleString();
    } catch (e) { console.log(e); }

    try {
      buyInput.style.minWidth = '100px'
      buyInput.value = winningBuy ? parseInt(sellNow).toLocaleString() : parseInt(sellNow + 1).toLocaleString();
    } catch(e) { console.log(e); }

    try {
      sellInput.style.minWidth = '100px'
      sellInput.setAttribute('data-value', sellInput.value);
      sellInput.style.padding = "0px !important";
      sellButton.innerHTML = "+SELL";
      sellButton.style.padding = "1px !important";
      sellButton.style.height = "100%"

    } catch (e) { console.log(e); }
    try {
      buyInput.setAttribute('data-value', buyInput.value);
      buyInput.style.padding = "0px !important"
      buyButton.innerHTML = "+BUY";
      buyButton.style.padding = "1px !important";
      buyButton.style.height = "100%"
    }  catch (e) { console.log(e);}




    return {
      'name': name,
      'jersey': jersey,
      'buyNow': buyNow,
      'sellNow': sellNow,
      'quickSellValue': quickSellValue,
      'profitMargin': profitMargin,
      'rating': rating,
      'buyForm': buyForm,
      'sellForm': sellForm,
      'buyNowForm': buyNowForm,
      'sellNowForm': sellNowForm,
      'cardImage': cardImage,
      'teamLogo': teamLogo,
      'cardClass': cardClass,
      'cardType':cardType,
      'shield': shield,
      'exchangeValue': exchangeValue,
      'perExchange': perExchange,
      'sellable': sellable,
      'owned': owned,
      'soldLastHour': numHour,
      'soldToday': numToday,
      'salesPerMinute': salesPerMinute,
      'salesPerHour': salesPerHour,
      'minutesPerSale': minutesPerSale,
      'salesPerMinuteThisHour': salesPerMinuteThisHour,
      'minutesPerSaleThisHour': minutesPerSaleThisHour,
      'maxBuyNow': maxBuyNow,
      'minBuyNow': minBuyNow,
      'minSellNow': minSellNow,
      'maxSellNow': maxSellNow,
      'avgBuyNow': avgBuyNow,
      'avgSellNow': avgSellNow,
      'avgProfit': avgProfit,
      'buyTrend': buyTrend,
      'sellTrend': sellTrend,
      'profitGap': profitGap,
      'maxGap': maxGap,
      'ppm': ppm,
      'cancelButtons': cancelBuyButtons + cancelSellButtons,
      'cancelBuyButtons': cancelBuyButtons,
      'cancelSellButtons': cancelSellButtons,
      'numBuys': numBuys,
      'numSells': numSells,
      'openOrders': numBuys + numSells,
      'outbid': outbidBuy || outbidSell,
      'winningBuy': winningBuy,
      'winningSell': winningSell,
      'balance': balance,
      'balanceAmt': balanceAmt,
      'balanceStr': balanceStr,
      'history': { 'sales': sales, 'dates': dates, 'buyOrSales': buyOrSales },
      'lastBuyAmt': lastBuyAmt,
      'lastBuyDate': (lastBuyDate),
      'myProfit': myProfit,
      'roi': roi,
      'avgRoi': roiAvg,
      'errors': [],


    };

  }

}
function waitForShowUpdates(){
  if ( typeof showUpdates !== "undefined" ) {
    //showUpdates(currentVersion, changelog, 'ProfitReporter');
    true;
  }
  else {
    setTimeout(waitForShowUpdates, 100);
  }
}
waitForShowUpdates();

function xpathToArray(xpath, context=document) {
  var result = document.evaluate(xpath, context);
  var node, nodes = [];
  while (node = result.iterateNext()) {
    nodes.push(node);
  }
  return nodes;
}

function reDirectToastr() {
  console.log("Debug outside")
  if ( typeof toastr !== "undefined") {
  }
  else
  {
    setTimeout(reDirectToastr, 100);
    console.log("wating for toastr");
  }
}
reDirectToastr();


const getNowPrice = (buyorsell) => () => {
  const btn = document.querySelector(`form[action$=${buyorsell}_now] button`)
  if (btn == null) {
    return 5
  }
  return Number(btn.innerText.replace(/[^\d]/g,''))
}
const getSellNow = getNowPrice('sell')
const getBuyNow = getNowPrice('buy')
const getPrice = el => Number(el.children[2].innerText.trim().replace(/[^\d]/g,''))
const getOffers = buyorsell => () => Array.from(document.querySelectorAll(`[id^=${buyorsell}-order-]`)).map(getPrice)
const getBuys = getOffers('buy')
const getSells = getOffers('sell')

const sellIt = () => {
  const action = `create_sell_order`
  const offer = (() => {
    const input = document.querySelector(`form[action*=${action}] input[name=price]`)
    if (input != null && input.value.length > 0) {
      return Number(input.value.replace(/[^\d]/g,''))
    }
    const min = Math.min(...getSells())
    return min <= getBuyNow() ? min : getBuyNow() - 1
  })()
  let form = document.querySelector(`form[action$=${action}]`)
  form.addEventListener('submit', e => {
    e.preventDefault()
    let token = encodeURIComponent(form.querySelector('input[name=authenticity_token]').value)
    let price = encodeURIComponent(form.querySelector('input[name=price]').value)

    fetch(form.action, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      "referrer": document.location.href,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `authenticity_token=${token}&price=${price}&button=`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
      .then(() => refresher.refresh( () => thiscard.refresh() ))
  })
  form.querySelector('input[name=price]').value = offer.toLocaleString()
  form.querySelector('button[type=submit]').click()
}
const buyIt = () => {
  const action = `create_buy_order`
  const offer = (() => {
    const input = document.querySelector(`form[action*=${action}] input[name=price]`)
    if (input != null && input.value.length > 0) {
      return Number(input.value.replace(/[^\d]/g,''))
    }
    let max = Math.max(...getBuys())
    return max >= getSellNow() ? max : getSellNow() + 1
  })()
  const form = document.querySelector(`form[action$=${action}]`)
  form.addEventListener('submit', e => {
    e.preventDefault()
    let token = encodeURIComponent(form.querySelector('input[name=authenticity_token]').value)
    let price = encodeURIComponent(form.querySelector('input[name=price]').value)

    fetch(form.action, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      "referrer": document.location.href,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `authenticity_token=${token}&price=${price}&button=`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
      .then(() => refresher.refresh( () => thiscard.refresh() ))
  })
  form.querySelector('input[name=price]').value = offer.toLocaleString()
  form.querySelector('button[type=submit]').click()
}

const refresher = {
  lastTouch: Date.now(),
  minWait: 5000,
  touch () { refresher.lastTouch = Date.now(); },
  get elapsed () { return Date.now() - refresher.lastTouch },
  refresh (cb) {
    clearTimeout( refresher.timeout )
    if (refresher.elapsed < refresher.minWait) {
      console.log('waiting')
      refresher.timeout = setTimeout( () => refresher.refresh(cb), 100 )
      return
    }
    console.log('refreshing')
    refresher.timeout = setTimeout( cb, 10 )
  },
  timeout: null,
}
document.addEventListener('keyup', refresher.touch )
document.addEventListener('click', refresher.touch )
document.addEventListener('scroll', refresher.touch )

setInterval( () => {
  if (document.querySelectorAll('div[style*=visible] iframe[title^=recaptcha]').length == 0) {
    document.title = document.title.replace(/CAP\s+/,'')
    return
  }
  document.title = 'CAP ' + document.title.replace(/CAP\s+/,'')
  refresher.touch()


}, 500)

const run = () => {
  'use strict';
  var cancelTarget;


  $('button[data-confirm]').removeAttr('data-confirm')
  document.title = document.title.replace(/MLB The Show 20 - /g, '')
  const createOrder = buyorsell => offer => {
    const action = `create_${buyorsell}_order`
    const form = document.querySelector(`form[action$=${action}]`)
    form.querySelector('input[name=price]').value = offer.toLocaleString()
    form.querySelector('button[type=submit]').click()
  }
  const buyFor = createOrder('buy')
  const sellFor = createOrder('sell')
  const addNote = (note, cb) => {
    const $note = $(`<span style="cursor: pointer"> | ${note.trim()}</span>`)
    // $('h1').append(" | " + note.trim())
    $('h1').append($note)
    if (cb != null) { $note.on('click', cb) }
  }
  const sellable = () => {
    const idle = Number(
      Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Sellable')).replace(/[^\d]/g,'')
    )
    const pending = document.querySelectorAll('tr[id^=sell-order]').length
    return idle + pending
  }

  const playerName = document.querySelector('h1').textContent.trim().split('\n').slice(-1)[0]
  // const stubs = Number( document.querySelector('.stubs').textContent.replace(/[^\d]/g,'') )

  const cachedgetter = cfunc => () => {
    let result = undefined;
    return () => {
      if (result != undefined) { return result };
      result = cfunc()
      return result;
    }
  }
  const setupCard = document => {
    const createOrder = buyorsell => offer => {
      const action = `create_${buyorsell}_order`
      const form = document.querySelector(`form[action$=${action}]`)
      form.querySelector('input[name=price]').value = offer.toLocaleString()
      form.querySelector('button[type=submit]').click()
    }
    const buyFor = createOrder('buy')
    const sellFor = createOrder('sell')

    return {
      get name() {
        return playerName
      },
      get owned() {
        return Number(Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Owned')).replace(/[^\d]/g,'')) + thisCard.sellOrders.length
      },
      get sellable() {
        const idle = Number(
          Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Sellable')).replace(/[^\d]/g,'')
        )
        const pending = document.querySelectorAll('tr[id^=sell-order]').length
        return idle + pending
      },
      get buyNow() {
        return getBuyNow()
      },
      get sellNow() {
        return getSellNow()
      },
      get sellOrders() {
        return getSells()
      },
      get winningSell() {
        const sells = this.sellOrders
        if (sells.length == 0) { return false }
        return Math.min(...sells) <= this.buyNow
      },
      get winningBuy() {
        const buys = this.buyOrders
        if (buys.length == 0) { return false }
        return Math.max(...buys) >= this.sellNow
      },
      get buyOrders() {
        return getBuys()
      },
      get profit () {
        return ((this.buyNow * .9) - this.sellNow)
      },
      get profitPercent () {
        return this.profit / this.sellNow
      },
      buyFor: createOrder('buy'),
      sellFor: createOrder('sell'),
      refresh: () => {
        addNote('<i class="reload-icon icon glyphicon-refresh-animate" />')
        document.title = `% ${document.title}`
        let doc = document.createElement('body')
        doc.classList.add('title-style')
        doc.dataset.turbolinks = false
        let resp = fetch(document.location.href).then(r => r.text())
        resp.then( t => doc.innerHTML = t )
          .then( w => window.docdoc = doc )
          .then( () => {
            doc.querySelectorAll('canvas[id]').forEach( el => {
              el.replaceWith(document.getElementById(el.id))
            })
          })
          .then( () => doc.querySelectorAll('script, meta, title, link, style').forEach(el => el.remove()) )
          .then( () => document.querySelector('.page-wrap-items').replaceWith(doc.querySelector('.page-wrap-items')) )
          .then( run )
          .catch( err => {
            document.title = `!!${document.title}`
            console.error(err)
            // document.location.reload()
          } )
        // let cardp = resp.then( () => cardData(doc, true) )
        // cardp.then( cd => window.card = cd )
      },
    }
  }
  const thecard = setupCard(document)
  document.title = thecard.name

  ;(function() {
    let c = document.createElement('span')
    c.style.float = 'right'
    c.innerText = new Date().toLocaleTimeString()
    document.querySelector('h1').appendChild(c)
  })();

  window.thiscard = thecard
  const thisCard = {
    get name() {
      return playerName
    },
    get owned() {
      return Number(Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Owned')).replace(/[^\d]/g,'')) + thisCard.sellOrders.length
    },
    get sellable() {
      return sellable()
    },
    get buyNow() {
      return getBuyNow()
    },
    get sellNow() {
      return getSellNow()
    },
    get sellOrders() {
      return getSells()
    },
    get winningSell() {
      const sells = this.sellOrders
      if (sells.length == 0) { return false }
      return Math.min(...sells) <= this.buyNow
    },
    get winningBuy() {
      const buys = this.buyOrders
      if (buys.length == 0) { return false }
      return Math.max(...buys) >= this.sellNow
    },
    get buyOrders() {
      return getBuys()
    },
    buyFor: createOrder('buy'),
    sellFor: createOrder('sell'),
  }

  const smartBuy = (max) => {
    addNote(`smartBuy(${max}, ${config.maxQuantity || 0})`, (e) => {
      localStorage.setItem(document.location.pathname.split('/').slice(-1)[0], JSON.stringify({
        ...getConfig(),
        player: thisCard.name,
        smartBuy: false,
      }))
      $(e.target).remove()
    })

    // already own enough
    if (thisCard.owned >= config.maxQuantity || config.maxQuantity <= 0) {
      console.log("don't want more")
      return false
    }

    if (thisCard.winningBuy) {
      Array.from($('tr[id^=buy-order]'))
        .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) < thisCard.sellNow)
        .map( tr => tr.querySelector('form[action*=cancel] button'))
        .forEach( btn => btn.click() )
      return false
    }

    if ( thisCard.sellNow >= max ) {
      return false
    }

    setTimeout(function () {
      if (thisCard.buyOrders.length > 1) {
        Array.from($('tr[id^=buy-order]'))
          .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) < thisCard.sellNow)
          .slice(-1)
          .map( tr => tr.querySelector('form[action*=cancel] button'))
          .forEach( btn => btn.click() )
      }
      const stubs = Number( document.querySelector('.stubs').textContent.replace(/[^\d]/g,'') )
      if (stubs >= getConfig().maxPrice) {
        buyIt()
      }
    }, 250)
    return true
  }

  const smartSell = (min) => {
    if (thisCard.sellable <= 0) { return false }

    // already own enough
    if (thisCard.owned <= config.minQuantity) {
      console.log(`must keep ${config.minQuantity}`)
      return false
    }

    const sells = thisCard.sellOrders
    // if ( ( sells.length == 0 || Math.min(...sells) > getBuyNow() ) && getBuyNow() > min ) {
    if (thisCard.winningSell) {
      Array.from($('tr[id^=sell-order]'))
        .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > getBuyNow())
        .map( tr => tr.querySelector('form[action*=cancel] button'))
        .forEach( btn => btn.click() )
      return false
    }

    if ( thisCard.buyNow < min ) {
      Array.from($('tr[id^=sell-order] form[action*=cancel] button'))
        .forEach( btn => btn.click() )
      return false
    }

    Array.from($('tr[id^=sell-order]'))
      .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > getBuyNow())
      .slice(-1)
      .map( tr => tr.querySelector('form[action*=cancel] button'))
      .forEach( btn => btn.click() )

    if (thisCard.owned - thisCard.sellOrders.length <= config.minQuantity) {
      console.log(
        "owned", thisCard.owned,
        "sell orders", thisCard.sellOrders.length,
        "min quantity", config.minQuantity,
      )
      return false
    }
    setTimeout(() => {
      if (thisCard.sellOrders.length > 1 || thisCard.sellable == 1) {
        Array.from($('tr[id^=sell-order]'))
          .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > getBuyNow())
          .slice(-1)
          .map( tr => tr.querySelector('form[action*=cancel] button'))
          .forEach( btn => btn.click() )
      }
      sellIt()
    }, 250)
    return true
  }

  const currentItem = document.location.pathname.split('/').slice(-1)[0]
  const getConfig = () => JSON.parse(localStorage.getItem(currentItem)) || ({})
  const config = getConfig()
  if(thisCard.buyOrders > 0) {
    document.title += ` B:${thisCard.buyOrders.length}`
  }
  if(thisCard.sellOrders > 0) {
    document.title += ` S:${thisCard.sellOrders.length}`
  }
  const didSell = ((function () {
    // smart sell
    // return true if we should exit card logic
    if (config == null) { return false }
    if (!config.smartSell) { return false }

    addNote(`smartSell(${config.minPrice}, ${config.minQuantity || 0})`, (e) => {
      localStorage.setItem(document.location.pathname.split('/').slice(-1)[0], JSON.stringify({
        ...getConfig(),
        player: thisCard.name,
        smartSell: false,
      }))
      $(e.target).remove()
    })

    if (thisCard.sellable <= 0) {
      return false
    }
    // settings.refreshInterval = settings.smartInterval;
    return smartSell(config.minPrice)
  })());

  // {
    // document.location.hash = '#disable'
    // return
  // }

  const didBuy = ((function () {
    // smart buy
    // return true if we should exit card logic
    if (config == null) { return false }
    if (!config.smartBuy) { return false }
    // settings.refreshInterval = settings.smartInterval;

    return smartBuy(config.maxPrice)
  })());
  // {
    // document.location.hash = '#disable'
  // return
  // }
  if (config.smartBuy || config.smartSell) {
    // if (document.querySelectorAll('iframe[title^=recaptcha]').length == 0) {
    if (document.querySelectorAll('div[style*=visible] iframe[title^=recaptcha]').length == 0) {
      setTimeout( () => {
        refresher.refresh( () => thecard.refresh() )
      }, settings.smartInterval * 1000)
    }
  }

  function waitForElement(){
    // TODO: use these to rebuy/resell
    ;(function () {
      if (localStorage.getItem('sellall') != currentItem) {
        return
      }
      $('h1').append(` autosell(${Number(localStorage.getItem('sellfor'))})`)
      const sellable = Number(
        Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Sellable')).replace(/[^\d]/g,'')
      )
      if (sellable <= 0) {
        localStorage.removeItem('sellall')
        localStorage.removeItem('sellfor')
        return
      }
      const offer = Number(localStorage.getItem('sellfor'))
      if (isNaN(offer) || offer <= 0) { sellIt() } else { sellFor(offer) }
      document.location.hash = '#disable'
    })();

    // buy specified quantity
    ;(function () {
      /*
      localStorage.setItem('buy', document.location.pathname.split('/').slice(-1)[0])
      localStorage.setItem('buyquantity', 25)
      localStorage.setItem('buyfor', 26)
      */
      if (localStorage.getItem('buy') != currentItem) {
        return
      }
      const desired = Number(localStorage.getItem('buyquantity'))
      const buyOrders = document.querySelectorAll('tr[id^=buy-order-]').length
      if (buyOrders >= desired) {
        localStorage.removeItem('buy')
        localStorage.removeItem('buyquantity')
        localStorage.removeItem('buyfor')
        return
      }
      const offer = Number(localStorage.getItem('buyfor'))
      if (isNaN(offer) || offer <= 0) { buyIt() } else { buyFor(offer) }
      document.location.hash = '#disable'
    })();

    ;(function () {
      const buybulkform = $(`
          <form id="buy-bulk" class="title-form" accept-charset="UTF-8" method="get">Buy in Bulk
          <div class="inline-form">
          <div class="form-block">
          <input type="hidden" name="buy" value="${document.location.pathname.split('/').slice(-1)[0]}" />
          <input type="text" autocomplete="off" name="buyquantity" placeholder="Quantity (cur ${document.querySelectorAll('tr[id^=buy-order-]').length})" />
          <input type="text" autocomplete="off" name="buyfor" placeholder="Price (opt)" />
          </div>
          <div class="form-block">
          <button name="button" class="title-button">Buy</button>
          </div>
          </div>
          </form>`)
      $('.market-forms-wrapper:has(form[action*=create_buy_order]) .market-forms-price').append(buybulkform)
      buybulkform.on('submit', (e) => {
        e.preventDefault()
        Array.from(buybulkform.find('input')).forEach( inp => {
          localStorage.setItem(inp.name, inp.value)
        })
        // waitForElement()
        // document.location.reload()
      })
    })();
    ;(function () {
      const sellallform = $(`
          <form id="sell-all" class="title-form" accept-charset="UTF-8" method="get">Sell All
          <div class="inline-form">
          <div class="form-block">
          <input type="text" autocomplete="off" name="sellfor" placeholder="Sell All Amount">
          </div>
          <div class="form-block">
          <button name="button" class="title-button">Sell All</button>
          </div>
          </div>
          </form>`)
      $('.market-forms-wrapper:has(form[action*=create_sell_order]) .market-forms-price').append(sellallform)
      sellallform.on('submit', (e) => {
        e.preventDefault()
        localStorage.setItem('sellall', document.location.pathname.split('/').slice(-1)[0])
        localStorage.setItem('sellfor', sellallform.find('input[name=sellfor]').val())
        // waitForElement()
        // document.location.reload()
      })
    })();

    ;(() => {
      const sellsmartform = $(`
          <form id="sell-smart" class="title-form" accept-charset="UTF-8" method="get">Sell Smart
          <div class="inline-form">
          <div class="form-block">
          <input type="text" autocomplete="off" name="sellfor" placeholder="Min Sell Amount" value="${config.minPrice || ''}">
          <input type="text" autocomplete="off" name="minQuantity" placeholder="Min Quantity" value="${config.minQuantity || ''}">
          </div>
          <div class="form-block">
          <button name="button" class="title-button">Sell</button>
          </div>
          </div>
          </form>`)
      $('.market-forms-wrapper:has(form[action*=create_sell_order]) .market-forms-price').append(sellsmartform)
      sellsmartform.on('submit', (e) => {
        e.preventDefault()
        localStorage.setItem(document.location.pathname.split('/').slice(-1)[0], JSON.stringify({
          ...getConfig(),
          player: thisCard.name,
          smartSell: true,
          minPrice: Number(sellsmartform.find('input[name=sellfor]').val()),
          minQuantity: Number(sellsmartform.find('input[name=minQuantity]').val()) || 0,
        }))
        // document.location.reload()
        // thecard.refresh()
        refresher.refresh( () => thecard.refresh() )
      })
    })();

    ;(() => {
      const buysmartform = $(`
          <form id="buy-smart" class="title-form" accept-charset="UTF-8" method="get">buy Smart
          <div class="inline-form">
          <div class="form-block">
          <input type="text" autocomplete="off" name="maxPrice" placeholder="Max Buy Amount" value="${config.maxPrice || ''}">
          <input type="text" autocomplete="off" name="maxQuantity" placeholder="Max Quantity" value="${config.maxQuantity || ''}">
          </div>
          <div class="form-block">
          <button name="button" class="title-button">Buy</button>
          </div>
          </div>
          </form>`)
      $('.market-forms-wrapper:has(form[action*=create_buy_order]) .market-forms-price').append(buysmartform)
      buysmartform.on('submit', (e) => {
        e.preventDefault()
        localStorage.setItem(document.location.pathname.split('/').slice(-1)[0], JSON.stringify({
          ...getConfig(),
          player: thisCard.name,
          smartBuy: true,
          maxPrice: Number(buysmartform.find('input[name=maxPrice]').val()),
          maxQuantity: Number(buysmartform.find('input[name=maxQuantity]').val()) || 0,
        }))
        // document.location.reload()
        // thecard.refresh()
        refresher.refresh( () => thecard.refresh() )
      })
    })();
    const { hash } = document.location
    if (hash.startsWith('#disable')) {
      if (hash.endsWith('sell')) {
        setTimeout(sellIt, 5)
      }
      if (hash.endsWith('buy')) {
        setTimeout(buyIt, 5)
      }
      if (hash.endsWith('buy-1000')) {
        setTimeout(() => buyFor(1001), 5)
      }
      if (hash.endsWith('buy-6')) {
        setTimeout(() => buyFor(6), 5)
      }
      return
    }

    if(typeof cardData === "undefined" && typeof settings === "undefined" && typeof $ === "undefined" && document.getElementsByTagName('body').length > 0){
      console.log("Still not set");
      setTimeout(waitForElement, 250);
      return
    }

    var card = cardData(document, true, window.location.pathname.split('/')[window.location.pathname.split('/').length -1]);
    var page = document;

    card.cancelSellButtons.forEach(btn => btn.addEventListener('click', e => setTimeout( () => $(btn).remove(), 200 )))
    card.cancelBuyButtons.forEach(btn => btn.addEventListener('click', e => setTimeout( () => $(btn).remove(), 200 )))

    function moveBuyForm() {
      var buysDiv = document.createElement('div');
      buysDiv.style.display = "flex";
      buysDiv.style.flexWrap = "wrap";
      buysDiv.innerHTML = "<h3 style='color:white; margin-right: 12px;'>BUY</h3>";

      buysDiv.append(card.buyForm);
      page.getElementsByClassName("section-items-primary")[0].append(buysDiv);
      $(card.buyForm).find('button')[0].innerHTML = "+BUY";
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
      sellsDiv.style.flexWrap = "wrap";
      sellsDiv.innerHTML = `<h3 style='color:white; margin-right: 12px;'>SELL (${card.sellable})</h3>`;

      if(sellable > 0) { sellsDiv.append(card.sellForm); }

      page.getElementsByClassName("section-items-primary")[0].append(sellsDiv);
      try { $(card.sellForm).find('button')[0].innerHTML = "+SELL";
        card.sellFormButton = $(card.sellForm).find('button')[0];
      } catch (e) { console.log(e); }

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
      if (card.sellable > 0 || card.numSells > 0){
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
            // Array.from(
            //   document.querySelectorAll('form[method=post][action*=buy][action*=cancel]')
            // ).concat( Array.from(
            //   document.querySelectorAll('form[method=post][action*=sell][action*=cancel]')
            // ) ).forEach( el => {
            //   $(el).find('button').click();
            // });
            break;
          default:
            break;
        }
      }
    }
    // document.addEventListener('keyup', doc_keyUp, false);
    // document.removeEventListener('keyup', plainkeyup);






    function updateChart() {
      if( document.getElementById("completed-orders") != null ) {
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
      }
      else {
        setTimeout(updateChart, 100);
      }

    }
    updateChart();



    var mainHeading = document.querySelector(".section-items-primary");

    //$('.marketplace-main-heading').append(li);
    // $(li).css('display','flex');
    // $(li).css('float','left');

    var cardDataDiv = document.createElement('div');
    cardDataDiv.style.color = 'white';
    cardDataDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    var dataPoints = {

      'quickSellValue': "QuickSell",
      'profitMargin': "Profit",
      'lastBuyDate': "Last Buy",
      'lastBuyAmt': "Last Buy Amount",
      'myProfit': "My Profit",
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
      'lastBuyDate': "blue",
      'lastBuyAmt': "blue",
      'myProfit': "blue",
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


    page.getElementsByClassName("section-items-secondary")[0].prepend(cardDataDiv);
    page.getElementsByClassName("section-items-secondary")[0].prepend(page.getElementsByClassName("section-items-secondary")[0].children[1]);

    moveBuyForm();

    // moveSellForm(card.sellable);
    moveSellForm(true);


    // for ( var table of Array.from(document.querySelectorAll(".title-widget-main table")).slice(0,-2) ) { mainHeading.prepend(table); table.style.backgroundColor = "white"; table.style.color = "black"; }

    // mainHeading.prepend(document.querySelector(".currency-widget-inner"));

    var buyOrdersTitle = document.evaluate("//th[contains(.,'Order Date')]/following-sibling::th[contains(.,'Buy Order Price')]", document).iterateNext()
    if (buyOrdersTitle != null) { var buyEl = document.createElement("small");
      buyEl.innerText=" ( " + card.buyNow + " ) "
      buyOrdersTitle.appendChild(buyEl);
    }

    var sellOrdersTitle = document.evaluate("//th[contains(.,'Order Date')]/following-sibling::th[contains(.,'Sell Order Price')]", document).iterateNext()
    if (sellOrdersTitle != null) { var sellEl = document.createElement("small");
      sellEl.innerText=" ( " + card.sellNow + " ) "
      sellOrdersTitle.appendChild(sellEl);
    }

    incrementBuy();
    incrementSell();

    $(card.buyForm).css('display','flex');
    $(card.sellForm).css('display','flex');

    (() => {
      let trends = $('#item-trends').remove()[0]
      let newdiv = $('.quirk-wrapper').empty()
      newdiv.css({ 'width': '100%', height: '100px', 'background-color':'white'});
      newdiv.append(trends)
    })()

    if(settings.refreshInterval > 0 ) {
      // setTimeout(function(){ window.location.reload(); }, (1000*parseInt(settings.refreshInterval))); // 1000 * seconds [(60) * minutes ]
    }
  }
  waitForElement();


}

(function() {
  try { run() } catch (e) { console.log(e); setTimeout(window.location.reload, 2500) }
  function plainkeyup (e) {
    if (e.target.tagName.toUpperCase() == 'INPUT') { return }
    let disabled = document.location.hash === '#disable'

    switch(e.key)
    {
      case 'b': // b buy
        buyIt()
        break;
      case 's': // s create sell order
        sellIt()
        break;
      case 'S': // sell without script
        document.location.hash = 'disable-sell'
        document.location.reload();
        break;
      case 'B': // sell without script
        document.location.hash = 'disable-buy'
        document.location.reload();
        break;
      case 'X': // cancel all orders
        Array.from(
          document.querySelectorAll('form[method=post][action*=buy][action*=cancel]')
        ).concat( Array.from(
          document.querySelectorAll('form[method=post][action*=sell][action*=cancel]')
        ) ).forEach( el => el.querySelector('button').click() );
        break;
      case 'x': // cancel losing orders
        Array.from($('tr[id^=buy-order]'))
          .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) < getSellNow())
          .map( tr => tr.querySelector('form[action*=cancel] button'))
          .filter( btn => btn )
          .forEach( btn => btn.click() )
        Array.from($('tr[id^=sell-order]'))
          .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > getBuyNow())
          .map( tr => tr.querySelector('form[action*=cancel] button'))
          .filter( btn => btn )
          .forEach( btn => btn.click() )
        Array.from(document.querySelectorAll('button.losing'))
          .forEach( btn => btn.click() )
        // Array.from(
        //   document.querySelectorAll('form[action*=cancel] button:not([style])')
        // ).forEach( el => el.click() );
        break;
      case 't': // t toggles card functionality
        switch (disabled) {
          case true:
            document.location.hash = ''
            run()
            break
          default:
            document.location.hash = 'disable'
            document.location.reload();
            break
        }
        break;
      case 'C': // clear auto sell and buy
        localStorage.removeItem('sellall')
        localStorage.removeItem('sellfor')
        localStorage.removeItem('buy')
        localStorage.removeItem('buyquantity')
        localStorage.removeItem('buyfor')
        localStorage.removeItem( document.location.pathname.split('/').slice(-1)[0] )
        break;
      default:
        break;
    }
  }
  document.addEventListener('keyup', plainkeyup);
})();
