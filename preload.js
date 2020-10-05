if (!process.isMainFrame) { return }
const ipc = require('electron').ipcRenderer

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
let captchad = false
setInterval( () => {
  if (document.querySelectorAll('div[style*=visible] iframe[title^=recaptcha]').length == 0) {
    captchad = false
    return
  }
  if (captchad == false) {
    captchad = true
    new Notification('captcha', {body: 'cap!'})
  }
  ipc.sendToHost('captcha.test')
  refresher.touch()
}, 500)

ipc.on('ping', (event, message) => {
  console.log(message)
  ipc.sendToHost('pong', {apples: 4})
})

const getPrice = el => Number(el.children[2].innerText.trim().replace(/[^\d]/g,''))
const createOrder = buyorsell => offer => {
  const action = `create_${buyorsell}_order`
  const form = document.querySelector(`form[action$=${action}]`)
  form.querySelector('input[name=price]').value = offer.toLocaleString()
  form.querySelector('button[type=submit]').click()
}

const setupCard = document => ({
  _getOffers: buyorsell => Array.from(document.querySelectorAll(`[id^=${buyorsell}-order-]`)).map(getPrice),
  _getNowPrice: (buyorsell) => {
    const btn = document.querySelector(`form[action$=${buyorsell}_now] button`)
    if (btn == null) {
      return 5
    }
    return Number(btn.innerText.replace(/[^\d]/g,''))
  },
  smartSell ({ minPrice, minQuantity }) {
    return smartSell({ minPrice, minQuantity })(this)
  },
  smartBuy (config) {
    return smartBuy({ maxPrice, maxQuantity })(this)
  },
  get name() {
    return document.querySelector('h1').innerText.trim().split('\n').slice(-1)[0]
  },
  get owned() {
    return Number(Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Owned')).replace(/[^\d]/g,'')) + this.sellOrders.length
  },
  get sellable() {
    const idle = Number(
      Array.from(document.querySelectorAll('.section-order-info h2+.well')).map(el => el.innerText).find(t => t.startsWith('Sellable')).replace(/[^\d]/g,'')
    )
    const pending = document.querySelectorAll('tr[id^=sell-order]').length
    return idle + pending
  },
  get buyNow() {
    return this._getNowPrice('buy')
  },
  get sellNow() {
    return this._getNowPrice('sell')
  },
  get sellOrders() {
    return this._getOffers('sell')
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
    return this._getOffers('buy')
  },
  get profit () {
    return ((this.buyNow * .9) - this.sellNow)
  },
  get profitPercent () {
    return this.profit / this.sellNow * 100
  },
  buyFor: createOrder('buy'),
  sellFor: createOrder('sell'),
  sell () {
    const offer = (() => {
      if ( this.winningSell ) {
        return Math.min(...this.sellOrders)
      }
      return this.buyNow - 1
    })()
    this.sellFor( offer )
  },
  buy () {
    const offer = (() => {
      if ( this.winningBuy ) {
        return Math.max(...this.buyOrders)
      }
      return this.sellNow + 1
    })()
    this.buyFor( offer )
  },
  cancelLosingSellOrders () {
    Array.from($('tr[id^=sell-order]'))
      .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > this.buyNow)
      .map( tr => tr.querySelector('form[action*=cancel] button'))
      .forEach( btn => btn.click() )
  },
  cancelSellOrders () {
    Array.from($('tr[id^=sell-order]'))
      .map( tr => tr.querySelector('form[action*=cancel] button'))
      .forEach( btn => btn.click() )
  },
  cancelLosingBuyOrders () {
    Array.from($('tr[id^=buy-order]'))
      .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) < this.sellNow)
      .map( tr => tr.querySelector('form[action*=cancel] button'))
      .forEach( btn => btn.click() )
  },
  cancelBuyOrders () {
    Array.from($('tr[id^=buy-order]'))
      .map( tr => tr.querySelector('form[action*=cancel] button'))
      .forEach( btn => btn.click() )
  },

  refresh: async () => {
    // document.location.reload()
    // return
    // document.title = `% ${document.title}`
    let doc = document.createElement('body')
    doc.classList.add('title-style')
    doc.dataset.turbolinks = false
    let resp = fetch(document.location.href).then(r => r.text())
    return resp.then( t => doc.innerHTML = t )
      .then( () => {
        doc.querySelectorAll('canvas[id]').forEach( el => {
          el.replaceWith(document.getElementById(el.id))
        })
      })
      // .then( () => doc.querySelectorAll('script, meta, title, link, style').forEach(el => el.remove()) )
      // .then( () => doc.querySelectorAll('meta, title, link, style').forEach(el => el.remove()) )
      // .then( () => document.querySelector('.page-wrap-items').replaceWith(doc.querySelector('.page-wrap-items')) )
      .then( () => document.body.replaceWith(doc) )
      .then( dispatchCard )
      .catch( err => {
        document.title = `!!${document.title}`
        console.error(err)
        document.location.reload()
      } )
    // let cardp = resp.then( () => cardData(doc, true) )
    // cardp.then( cd => window.card = cd )
  },
})

const smartBuy = config => card => {
  const max = config.maxPrice
  // already own enough
  if (card.owned >= config.maxQuantity || config.maxQuantity <= 0) {
    console.log("don't want more")
    return false
  }

  if (card.winningBuy) {
    card.cancelLosingBuyOrders()
    return false
  }

  if ( card.sellNow >= max ) {
    return false
  }

  // setTimeout(function () {
  if (card.buyOrders.length >= 1) {
    card.cancelLosingBuyOrders()
  }
  const stubs = Number( document.querySelector('.stubs').textContent.replace(/[^\d]/g,'') )
  if (stubs >= config.maxPrice) {
    card.buy()
  }
  // }, 250)
  return true
}

const smartSell = ({ minPrice, minQuantity }) => card => {
  if (card.sellable <= 0) { return false }

  // already own enough
  if (card.owned <= minQuantity) {
    console.log(`must keep ${minQuantity}`)
    return false
  }

  const sells = card.sellOrders
  // if ( ( sells.length == 0 || Math.min(...sells) > getBuyNow() ) && getBuyNow() > min ) {
  if (card.winningSell) {
    card.cancelLosingSellOrders()
    return false
  }

  if ( card.buyNow < minPrice ) {
    card.cancelSellOrders()
    return false
  }

  Array.from($('tr[id^=sell-order]'))
    .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > card.buyNow)
    .slice(-1)
    .map( tr => tr.querySelector('form[action*=cancel] button'))
    .forEach( btn => btn.click() )

  if (card.owned - card.sellOrders.length <= minQuantity) {
    console.log(
      "owned", card.owned,
      "sell orders", card.sellOrders.length,
      "min quantity", minQuantity,
    )
    return false
  }
  // setTimeout(() => {
  if (card.sellOrders.length >= 1 || card.sellable == 1) {
    Array.from($('tr[id^=sell-order]'))
      .filter( tr => Number(tr.children[2].innerText.replace(/[^\d]/g,'')) > card.buyNow)
      .slice(-1)
      .map( tr => tr.querySelector('form[action*=cancel] button'))
      .forEach( btn => btn.click() )
  }
  card.sell()
  // }, 250)
  return true

}

const removeJunk = () =>
  document.querySelectorAll(`
    script
    ,
    link
  `).forEach( el => {
    console.log(el)
    el.remove()
  } )

document.addEventListener('readystatechange', (e) => {
  console.log(e.eventPhase, document.readyState, e)
  // removeJunk()
})

const dispatch = (event, detail) =>
  document.dispatchEvent(
    new CustomEvent(event, { detail })
  )
const dispatchCard = () => dispatch('card.load', setupCard( document ))

document.addEventListener('DOMContentLoaded', () => {
  // console.log('hi')
  setTimeout( dispatchCard, 250 )
})

document.addEventListener('card.load', (e) => {
  const card = e.detail
  window.card = card
  // if (document.querySelector('.g-recaptcha')) {
  //   return
  // }
  setTimeout( () => {
    // TODO: add refresh back
    refresher.refresh( card.refresh.bind(card) )
  }, 2500 )
})

document.addEventListener('card.load', (e) => {
  // if (document.querySelector('.g-recaptcha')) {
  //   ipc.sendToHost('captcha.fail')
  //   setTimeout( () => document.location.reload(), 2500 )
  // }
  document.querySelectorAll('button[data-confirm]')
    .forEach( el => el.removeAttribute('data-confirm') )
})

const maxbuy = 10250
document.addEventListener('card.load', (e) => {
  const card = e.detail
  const config = { maxQuantity: 6, maxPrice: maxbuy }
  setTimeout( () => {
    smartBuy(config)(card)
  }, 500)
})
document.addEventListener('card.load', (e) => {
  const card = e.detail
  const config = ({ minPrice: maxbuy / .9, minQuantity: 1 })
  smartSell(config)(card)
})
console.log(document.readyState)

if (document.readyState == 'complete') { dispatchCard() }
