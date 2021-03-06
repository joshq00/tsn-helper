import moment from './lib/moment.js'
import settings from './lib/settings.js'
import { saveSettings } from './lib/settings.js';

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
        date: moment( fixDate( el.children[1].innerText ) ),
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
    var now = moment();
    var today = moment().hours(0).minutes(0).seconds(0);

    var OneHourAgo = moment().subtract(1, 'hours');
    var ThreeHoursAgo = moment().subtract(3, 'hours');

    var thisHourDates = [];


    for( var iii=0,lll=dates.length;iii<lll;iii++ ){
      //console.log(dates[iii]);
      if(dates[iii].isAfter(OneHourAgo))
      {
        numHour++;
        thisHourDates.push(dates[iii]);

      }
      if(dates[iii].isAfter(ThreeHoursAgo))
      {
        numThreeHours++;

      }
      if(dates[iii].isSame(moment(), 'day'))
      {
        numToday++;

      }
    }
    if (numToday == 200){
      var timeToday = now.diff(today,'minutes');
      var lastTime = dates[199];
      var timeCovered = now.diff(lastTime, 'minutes');
      numToday = Math.round( (200 * timeToday ) / timeCovered );

    }




    if(!doOnce){
      doOnce = true;
      //console.log(thisHourDates);

    }

    var dateText = '';
    var minDate=moment.min(dates);
    var thisHourMinDate=moment.min(thisHourDates);
    var diffMins = moment().diff(minDate);
    //var thisHourDiffMins = Math.round( (now-thisHourMinDate) / 60000 );
    var salesPerMinute = Math.round( ( ( dates.length / diffMins ) / 60000 ) * 100 ) / 100;
    var minutesPerSale = Math.round( ( ( diffMins / dates.length ) / 60000 ) * 100 ) / 100;
    var salesPerMinuteThisHour = Math.round( ( numHour / 60) * 100 ) / 100;
    var minutesPerSaleThisHour = Math.round( ( 60 / numHour ) * 100 ) / 100;


    var salesPerHour = Math.round( ( dates.length / ( diffMins  / 1000 / 60 / 60 ) ) * 100 ) / 100;

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
      'lastBuyDate': moment(lastBuyDate).fromNow(),
      'myProfit': myProfit,
      'roi': roi,
      'avgRoi': roiAvg,
      'errors': [],


    };

  }

}

export default cardData;
globalThis.cardData = cardData;

