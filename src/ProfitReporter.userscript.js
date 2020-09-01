import md5 from './lib/md5.js'
import settings from './lib/settings.js'
import showUpdates from './lib/showUpdates.js'
import cardData from './MLBTSNCardData.library.js'
import {inIframe, inExtensionIframe} from './lib/helpers.js'

var currentVersion = "2019.4.15.2";

var changelog = [];

changelog["2019.4.9.3"] = ['Lots of card sale data is now on the top of the page.',
  'X hotkey to cancel outbid works again!'];

changelog["2019.4.8.1"] = ['Working on re-tooling toward using CM Helper logic - will add all data to card page when done',
  'Stop removing images in iFrame - didn\'t have desired effect',
  'Buy/Sell chart shows all 200 historical orders now as well as a guess for which they were',
]


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

    if ( inIframe() && !inExtensionIframe() ) {

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
  if (didBuy || didSell) {
    return
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
        document.location.reload()
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
        document.location.reload()
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

    if(settings.refreshInterval > 0 && ! inIframe()) {
      setTimeout(function(){ window.location.reload(); }, (1000*parseInt(settings.refreshInterval))); // 1000 * seconds [(60) * minutes ]
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
