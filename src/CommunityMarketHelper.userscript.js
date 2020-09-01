import md5 from './lib/md5.js'
import settings from './lib/settings.js'
import cardData from './MLBTSNCardData.library.js'


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

function replaceBulk( str, frArray ){
  var i, regex = [], map = {};
  for( i=0; i<frArray.length; i++ ){
    regex.push( frArray[i][0].replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1') );
    map[frArray[i][0]] = frArray[i][1];
  }
  regex = regex.join('|');
  str = str.replace( new RegExp( regex, 'g' ), function(matched){
    return map[matched];
  });
  return str;
}

/*
<select name="brand_id" id="brand_id"><option value="" label=" "></option><option value="14">Adidas</option>
<option value="10">All-Star</option>
<option value="11">EvoShield</option>
<option value="6">Franklin</option>
<option value="16">Lizard Skins</option>
<option value="1">Louisville Slugger</option>
<option value="2">Marucci</option>
<option value="3">Mizuno</option>
<option value="15">New Balance</option>
<option value="5">Nike</option>
<option value="12">Old Hickory</option>
<option value="4">Rawlings</option>
<option value="0">Ritual</option>
<option value="17">STANCE</option>
<option value="9">Sam Bat</option>
<option value="13">Trinity Bat Co</option>
<option value="7">Under Armour</option>
<option value="18">Varo</option>
<option value="8">Wilson</option></select>
*/

var findReplaceBrands = [];
findReplaceBrands.push( ['Adidas', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAQAAADc68WyAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCAwRChsGBH7fAAAA10lEQVQY03XMPSgEcACG8Z876jgfpeS2G06Rk7qjqBsomxTdZJEyGGWxyqKskpmBMrgbxaSMDHabuuSKrhC67vxNJ13dM75Pz0szSwoiWrIrCFZb6YysuuBZT2OK/smEA4fuvcroVnPdXI+rCcqGfQg+Jf8/9NtDRVbcuxuzOgwoNto+L4InKW+CLyMeBT9y0AbSYliQcKQu504VZSWpduvmdDm2bMKFmE1jtqzodGLGQ9SOvA1D8hZFTFozKm3boG/TqhG3zsVdKUqqOHNqyqV986JKen8BAb450L8/XfEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMTJUMTc6MTA6MjcrMDA6MDCwd5M3AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTEyVDE3OjEwOjI3KzAwOjAwwSoriwAAAABJRU5ErkJggg==">'] );
findReplaceBrands.push( ['All-Star', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAIwAAACMB1fQWXQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAENSURBVDiNndO9LoRBFMbx33oFqyXbKBAhkiUSCsvGBWhcgEIkbkBU7sEVqEWi0ikVGgqi0PgKG5EoNxqxEV/FTMHKO2/iSSYzk3PynzPPmcmkNYxuvOQldBQA6phLJRQBakWAzkSsFAGvBYfkahx3EdCVl5S6Qj3OPZj+D6CGr7jO9SEFmMc1HlIAQqmHaLaNG1QwiWe02uL7mM3wiB3cYgaDKKMPJ1jAotCxMs6wjRE0sx+VXMbAFSbQj94IqOAYB3H9EWGNdg8+sRcBK0IHWliP+1GcR0/eMFBKmSM8pi1cYAxP2MSGYO5p6iVChiruMSR0bRVH8RqFqmIJu1gWfuYvFVUwhXesCV780TfSbjRXTm9OjAAAAABJRU5ErkJggg==">'] );
findReplaceBrands.push( ['EvoShield', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAXQAAAF0BVWAulAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAD1SURBVDiNvdLPKoRhFMfxzxhNSYbNRIjEwm40G7GwtbAgWym5Ajdg4x5G2c/GFZg7sNKUxURpSpiNFOXflGLxPkO9vd7XZnw3p/P8nt95Ts859JDxECfSLvXH8g1M4wWnaKOAXRTxgBo+k4ptYj+jqx3sJQlFnGMoo0AeDczEhRUsZ5i7lLHeTfpCvMRqENOYDeZmkriGKxxjPqZN4gg32EbutxcGcCCaQi0UPQx5FSMZHX4zhxPRuM6w+FdjnLKff+oNOSyItq2DUTyiglfcYhAtlLCEevA2sJXHvWgxWhjDHZ7xFM4u8IF3vOEaUxiWMo3/4wuL3yrWvsmShgAAAABJRU5ErkJggg==">'] );
findReplaceBrands.push( ['Franklin', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAWwAAAFsB1WNqDwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACpSURBVDiN7dAta8JxFIbh66+WuQVNMnxbMGk1Ckat4r6CfW3fwmpcMphNri75AcS6Jd9AUINBQcsvGpRh8y7PeeBwczg8+DfxkGW0UMLkFkEs5BdymF/YyaIX5k98oBN6LkIGv5jiCQsksUEeQ7wHeQk/WKGB7xiaGOMNXbzggCqeUUEBI+xQD9fusIzQxxpRENXwhxTSOGGPGRIo4ogtBtDG67VPe3AHzs3vHqV/qJKBAAAAAElFTkSuQmCC">'] );
findReplaceBrands.push( ['Lizard Skins', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAQwAAAEMBuP1yoAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFQSURBVDiNpdPPS9NxGAfw19xklGXQKCvCebCIdKV4kcRV7ODf4B/gvavg1X/Au+cOUTdPehgEMcRDEARhGBQiIWEwpKLYOnye4VhrG/jAFz58P8/z/vE8z4dzRnaAnCt4igc4ws/2y8x/ijKYxS5e4QPGMYcZ/OnFeBvr2MFbXG6728DN9uShLgB3sYBFVJ3ZzMe/r70AiiFxDMd4grXI28QWGr3kP5O8NvEDX/AC23jfYeefKKKCC/gcIK3vE+50K2of46Ng+o1vqGMPL7GCw17sMIGHcV6UPPeNloKi1LBDXAsLxzjAPaxK/velhjY6AZbxGqUoyoeFKWkqV1HAJYxKi1RANhcAN1COxEncl7axhCU8xnyoqKCG56jmkJO2rxnMZWlktVBxK2S/w3W8kSayJ1iGMY0TaYRZfJf24GLI/oVT6WHVMYKPgzS5b/wFHJ1AMKD3wOYAAAAASUVORK5CYII=">'] );
//findReplaceBrands.push( ['Louisville Slugger', '<img src="">'] );
findReplaceBrands.push( ['Louisville Slugger', 'LS'] );
//findReplaceBrands.push( ['Marucci', '<img src="">'] );
findReplaceBrands.push( ['Marucci', 'Ma'] );
//findReplaceBrands.push( ['Mizuno', '<img src="">'] );
findReplaceBrands.push( ['Mizuno', 'Mi'] );
//findReplaceBrands.push( ['New Balance', '<img src="">'] );
findReplaceBrands.push( ['New Balance', 'NB'] );
findReplaceBrands.push( ['Nike', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAGCAQAAABgddZsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCAgVGA0CT4TWAAAAdUlEQVQI123OsQnCUACE4S8EO62CrY0DWGknuERAMkWmSGWRQrCycAdT29mYRgfICoE4wLNQkET/q447jouRSHSGRBbmOiKnQTSVOSot33arNQYjG4Vaa2f27VeCh72zp6CRm/QHL8JHV6n454u1m7uDlb+8ADdxGPHp3aGXAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA4LTA4VDIxOjI0OjEzKzAwOjAw9S/91QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wOC0wOFQyMToyNDoxMyswMDowMIRyRWkAAAAASUVORK5CYII=">'] );
//findReplaceBrands.push( ['Old Hickory', '<img src="">'] );
findReplaceBrands.push( ['Old Hickory', 'OH'] );
//findReplaceBrands.push( ['Rawlings', '<img src="">'] );
findReplaceBrands.push( ['Rawlings', 'Ra'] );
//findReplaceBrands.push( ['Ritual', '<img src="">'] );
findReplaceBrands.push( ['Ritual', 'Ri'] );
//findReplaceBrands.push( ['STANCE', '<img src="">'] );
findReplaceBrands.push( ['STANCE', 'ST'] );
//findReplaceBrands.push( ['Sam Bat', '<img src="">'] );
findReplaceBrands.push( ['Sam Bat', 'SB'] );
//findReplaceBrands.push( ['Trinity Bat Co', '<img src="">'] );
findReplaceBrands.push( ['Trinity Bat Co', 'TB'] );
findReplaceBrands.push( ['Under Armour', '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAQAAACRI2S5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCwgTGilPVwTnAAAAoElEQVQY043MMWoCUQBF0TMy2NkIMaIbiAr2pohOFhCwMEXIFnQH7kDS6kqsJVbWCvaCjRLQaOUUP1WGKb3d4cEDHo2tvPjv2dJYNbOFIHjN3BUE3xCDkbm6JzsPIkcN7A3l6rk4munomDq4SvLzQCroo6iIN0HqHQrgQ4wzbm44IfaZ/+iaaGdq+ZKI3FNkqKagLPXj11pTYiuo2Cip/QGhPydCb86y4AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMS0wOFQxOToyNjo0MSswMDowMLPjYogAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTEtMDhUMTk6MjY6NDErMDA6MDDCvto0AAAAAElFTkSuQmCC">'] );
//findReplaceBrands.push( ['Varo', '<img src="">'] );
findReplaceBrands.push( ['Varo', 'Va'] );
//findReplaceBrands.push( ['Wilson', '<img src="">'] );
findReplaceBrands.push( ['Wilson', 'Wi'] );
//findReplaceBrands.push( ['Unknown Brand', '<img src="">'] );
findReplaceBrands.push( ['Unknown Brand', ''] );
//findReplaceBrands.push( ['Under Armour', '<img src="">'] );
var findReplaceSeries = [];
findReplaceSeries.push( ['Live','L'] );
findReplaceSeries.push( ['Impact Veteran','IV'] );
findReplaceSeries.push( ['All-Star','AS'] );
findReplaceSeries.push( ['Hardware','HW'] );
findReplaceSeries.push( ['Future Stars','FS'] );
findReplaceSeries.push( ['Rookie','R'] );
findReplaceSeries.push( ['Breakout','BO'] );

var notifiedURL = '';
var favoritesTimeout;
var openTimeout;
var firstTime = {};
var firstTimeSell = {};
var notified = {};
var notifiedSell = {};
var helperFrame;
var tables;
var sort;

/*
$(table_headers).find('th:nth-child(6)').after("<th data-sort-method=\"number\" title=\"Profit\">±</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Sellable\">#</th>"+
                                                    "<th data-sort-method=\"number\" title=\"Return on Investment\">ROI</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Sales per hour (last 200)\">S/H</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Potential Profit per Minute\">PP/m</th>"+
                                                   "<th data-sort-method=\"number\" title=\"Estimated historical Buy/Sell gap\">Gap</th>"+
                                                   "<th title=\"Average sale price\" style=\"text-transform: none;\">μ<sub>SELL</sub></th>"+
                                                  "<th title=\"Sell Difference to Average\" style=\"text-transform: none;\">ƒ<sub>SELL</sub></th>"+
                                                    "<th title=\"Average buy price\" style=\"text-transform: none;\">μ<sub>BUY</sub></th>"+
                                                   "<th title=\"Buy Difference to Average\" style=\"text-transform: none;\">ƒ<sub>BUY</sub></th>"+
                                                    "<th title=\"Average profit\" style=\"text-transform: none;\">μ<sub>±</sub></th>"+
                                                    "<th title=\"Average ROI\" style=\"text-transform: none;\">μ<sub>ROI</sub></th>"+
*/

var dataPoints = {

    'profitMargin': {'title': "Profit Margin", 'heading': '±', 'class': 'short', 'patronsOnly': false},
    'myProfit': {'title': "Profit Margin from last Buy", 'heading': '±<sub>Δ</sub>', 'class': 'short', 'patronsOnly': true},
    'owned': {'title': "Number Owned", 'heading': '#<sub>O</sub>', 'class': 'short', 'patronsOnly': false},
    'sellable': {'title': "Number Sellable", 'heading': '#<sub>S</sub>', 'class': 'short', 'patronsOnly': false},
    'roi': {'title': "Percent Return on Investment", 'heading': 'ROI', 'class': 'short', 'patronsOnly': true},
    'salesPerHour': {'title': "Sales per Hour (last 200)", 'heading': 'S/H', 'class': 'short', 'patronsOnly': false},
    'ppm': {'title': "Potential Profit per Minute", 'heading': 'PPM', 'class': 'short', 'patronsOnly': true},
    'profitGap': {'title': "Estimated historical Buy/Sell gap", 'heading': 'GAP', 'class': 'short', 'patronsOnly': false},
    'avgBuyNow': {'title': "Average sell order price", 'heading': 'μ<sub>SELL</sub>', 'class': 'short', 'patronsOnly': true},
    'buyTrend': {'title': "Sell factor (current difference from average)", 'heading': 'ƒ<sub>SELL</sub>', 'class': 'short', 'patronsOnly': true},
    'avgSellNow': {'title': "Average buy order price", 'heading': 'μ<sub>BUY</sub>', 'class': 'short', 'patronsOnly': true},
    'sellTrend': {'title': "Buy factor (current difference from average)", 'heading': 'ƒ<sub>BUY</sub>', 'class': 'short', 'patronsOnly': true},
    'avgProfit': {'title': "Average profit", 'heading': 'μ<sub>±</sub>', 'class': 'short', 'patronsOnly': false},
    'avgRoi': {'title': "Average ROI", 'heading': 'μ<sub>ROI</sub>', 'class': 'short', 'patronsOnly': true},
    'perExchange': {'title': "Exchange Point per Stub", 'heading': 'XCH', 'class': 'short', 'patronsOnly': true},
    'openOrders': {'title': "Open Orders", 'heading': 'OPEN', 'class': 'short', 'patronsOnly': false},
    'maxGap': {'title': "Max Gap", 'heading': '^GAP', 'class': 'short', 'patronsOnly': false},

}


function marketHelper(onlyFavorites=false, specificTarget='', onlyOpen=false){
    var itemType = document.querySelector('table thead th:nth-child(3)').textContent.toLowerCase();
   // console.log("Debug1");

   // console.log("Debug2");

    console.log(onlyFavorites, specificTarget, onlyOpen);
    // $('.marketplace-filter-item-stats').hide();
    $('.item-name').css('width','20%');

    var cardSelector;

  const rows = [...(() => {
    const rows = $('table:last tbody tr')
    const favorites = rows.filter(':has(td:nth-child(1):has(.mlb12-heart-solid) ~ td:nth-child(3) a)')
    const opens = rows.filter(':has(td:nth-child(3) a[data-openorders="true"])')
    const specific = rows.filter(`:has(td:nth-child(3) a[href="${specificTarget}"])`)

    if(onlyFavorites) {
        clearTimeout(favoritesTimeout);
        // cardSelector = $(tables).find('td:nth-child(1):has(.mlb12-heart-solid) ~ td:nth-child(3) a');
        return favorites
    }
    if (onlyOpen) {
        clearTimeout(openTimeout);
        // cardSelector = $(tables).find('td:nth-child(3) a[data-openorders="true"]');
      return opens
    }
    if (specificTarget != '' && specificTarget != 'blank' ){
        // console.log("Specific Target", specificTarget);
        // cardSelector = $(tables).find('td:nth-child(3) a[href="'+specificTarget+'"]');
      return specific

    }
    clearTimeout(favoritesTimeout);
    clearTimeout(openTimeout);
    return rows
  })()]
    .map($)

  // replace image with spinner
  rows.forEach( $row => $row.find('td:nth-child(2) img').replaceWith('<div class="reload-icon icon glyphicon-refresh-animate"></div>') )
  rows.forEach( $row => $row.find( 'td > a' ).attr('target', 'blank') )
  rows.forEach( $row => {
    $row.find('.helperDiv').remove();
    $row.find('#create-buy-order-form').remove();
    $row.find('#create-sell-order-form').remove();
    $row.find('td:has(>a)').append('<div class="helperDiv" />')
  })
  const cards = rows.map( $row => {
      return ({
        $row: $row,
        id: $row.find('td > a').attr('href').split('/').slice(-1)[0],
        uri: $row.find('td > a').attr('href'),
        buyNow: parseInt($row.children()[4].innerText.trim()),
        sellNow: parseInt($row.children()[5].innerText.trim()),
        rating: parseInt($row.children()[3].innerText.trim()),
      })
    } )

  // var howMany = cardSelector.length;
  const howMany = cards.length;
  var howManyDone = 0;
  const handleCard = card => {
    if(isNaN(card.profitMargin)){
      card.profitMargin = -99999;
    }
    if(isNaN(card.minutesPerSale)){
      card.profitMargin = 99999;
    }

    card.$row.parent().css('background-color','');
    card.sellForm.removeAttribute('id');
    card.buyForm.removeAttribute('id');
    Array.from( card.buyForm.querySelectorAll('#price') ).forEach(p => {
      p.removeAttribute('id')
      p.setAttribute('style', "padding: 0px !important; font-size:8pt;");
    })
    Array.from( card.sellForm.querySelectorAll('#price') ).forEach(p => {
      p.removeAttribute('id')
      p.setAttribute('style', "padding: 0px !important; font-size:8pt;");
    })

    card.$row.find('td > a').each(function() {
      let bgcolor
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
      card.$row.css('background-color',bgcolor+' !important');
    })

    card.$row.find('div[id^=market-favorite-item').css({
      'min-height': '81px',
      'padding': '25px 0',
    });
    // card.$row.find('div[id^=market-favorite-item').css('padding', '25px 0')

    var refreshDiv = document.createElement('div');
    card.$row.find('td > a').each(function() {
      var favoriteTd = card.$row.find('td:nth-child(1)');
      favoriteTd[0].classList.add("short");

      $(favoriteTd[0]).attr("data-sort", $(favoriteTd[0]).find('.mlb12-heart-solid').length > 0 ? 1 + parseFloat(card.ppm * 0.00001).toFixed(5) : parseFloat(card.ppm * 0.00001).toFixed(5));

      var imgTd = $(this).parent().parent().find('td:nth-child(2)');
      imgTd[0].classList.add("short");

      refreshDiv.classList.add('reload-icon');
      refreshDiv.classList.add('icon');
      refreshDiv.style.padding = '33px 0';
      refreshDiv.style.cursor = 'pointer';

      imgTd[0].innerHTML = '';
      imgTd[0].append(refreshDiv);
      refreshDiv.addEventListener("click", function(e) {
        marketHelper(false, card.uri);
        refreshDiv.classList.add('glyphicon-refresh-animate')
      });
    })

    card.$row.find('td > a').each(function() {

      var nameTd = card.$row.find('td:nth-child(3)');
      nameTd[0].classList.add("long");

    })

    card.$row.find('td > a').each(function() {
      var nameLink = card.$row.find('td:nth-child(3) a');
      $(nameLink[0]).attr("data-openOrders", card.openOrders > 0 ? 'true' : 'false');

    })

    card.$row.find('td > a').each(function() {
      var ovrTd = card.$row.find('td:nth-child(4)');
      ovrTd[0].classList.add("short");
      ovrTd[0].innerHTML = `<img src="${card.shield}" height="16px" width="16px">`;
    })
    card.$row.find('td > a').each(function() {

      var buyTd = card.$row.find('td:nth-child(5)');
      buyTd[0].innerHTML = card.buyNow;
      buyTd[0].classList.add("long");
      $(buyTd).attr("data-sort", card.buyNow);
      if (card.sellable > 0) {
        buyTd.append(card.sellForm);
        var sellButton = $(card.sellForm).find("button")[0];
        sellButton.addEventListener("click", function(){
          refreshDiv.classList.add('glyphicon-refresh-animate')
        });
        sellButton.innerHTML = "+S";
        sellButton.style.padding = "1px";
        sellButton.style.height = "100%"
      }
      for ( var cancelButton of card.cancelSellButtons ) {
        $(buyTd).append(cancelButton);
        cancelButton.target = "helperFrame";
        cancelButton.addEventListener("click", function(){
          refreshDiv.classList.add('glyphicon-refresh-animate')
        });
      }

      var sellTd = card.$row.find('td:nth-child(6)');
      sellTd[0].innerHTML = card.sellNow;
      sellTd[0].classList.add("long");
      $(sellTd).attr("data-sort", card.sellNow);
      sellTd.append(card.buyForm);
      var buyButton = $(card.buyForm).find('button')[0]
      buyButton.addEventListener("click", function(){
        refreshDiv.classList.add('glyphicon-refresh-animate')
      });
      buyButton.innerHTML = "+B";
      buyButton.style.padding = "1px";
      buyButton.style.height = "100%"
      var buyInput = $(card.buyForm).find("input[name=price]")[0];
      buyInput.setAttribute('style', "padding: 0px !important; font-size:8pt;");
      for ( var cancelButton of card.cancelBuyButtons ) {
        $(sellTd).append(cancelButton);
        cancelButton.target = "helperFrame";
        cancelButton.addEventListener("click", function(){
          refreshDiv.classList.add('glyphicon-refresh-animate')
        });
      }

      var i = 0;
      (() => {
        // TODO: idk if this is needed
        return
        const tds = card.$row.find('>td')
        const needs = Object.keys(dataPoints).length + 5 - tds.length
        for (let i = 0; i < needs; i++) {
          card.$row.append('<td/>')
        }
      })()
      for (const dataPoint in dataPoints){
        if ( !dataPoints[dataPoint].patronsOnly ||
          md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
          md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
          if ( ! settings.hiddenColumns.includes(dataPoint) ) {
            card.$row.find('td:nth-child('+(i+7)+')').html( card[dataPoint] );
            i++;
          }

        }
      }

      var brandTd = card.$row.find('td:nth-last-child(2)');
      $(brandTd).attr("data-sort", brandTd[0].textContent);
      if(itemType === 'player') {
        brandTd[0].innerHTML = replaceBulk(brandTd[0].innerHTML, findReplaceSeries);
      }
      else if (itemType === 'equipment') {
        brandTd[0].innerHTML = replaceBulk(brandTd[0].innerHTML, findReplaceBrands);
      }


      //$(theForm).css('width','50%');
      $(card.buyForm).css('display','flex');
      $($(card.buyForm).find('input[name=price]')[0]).val(card.winningBuy ? card.sellNow : card.sellNow+1);
      card.buyForm.target = "helperFrame";


      //$(this).parent().append(card.sellForm);
      //$(theForm).css('width','50%');
      $(card.sellForm).css('display','flex');
      $($(card.sellForm).find('input[name=price]')[0]).val(card.winningSell ? card.buyNow : card.buyNow-1);
      card.sellForm.target = "helperFrame";
      //$($(this).parent().parent().children()[1]).append("<div class=\"helperDiv\" style=\"background-color:yellow; color:red\"><span class=\"stubs\"> </span> "+thisSellNowPrice+"</div>");
      firstTime[card.uri] = 1;
      document.getElementById('helperStubsDiv').innerHTML = card.balanceStr;


    })
  }

  const fetchCard = ( card ) =>
    fetch(card.uri)
      .then( r => r.text() )
      .then( r => {
        const c = cardData(r, false, card.id)
        if (c.errors.length > 1) {
          throw c.errors
        }
        return { ...card, ...c }
      })

  const fetchedCards = cards.map( fetchCard )
  fetchedCards.forEach( c => c.then(handleCard) )
  fetchedCards.forEach( c => c.then( sort.refresh.bind(sort) ) )

  Promise.all( fetchedCards )
    .then( () => {
        // sort.refresh();
        if (specificTarget == '' || specificTarget == 'blank' ) {
          if(onlyOpen) {
            setRefresh(undefined, 'open');
          } else if (onlyFavorites) {
            setRefresh(undefined, 'favorites');
          } else {
            setRefresh(undefined, 'favorites');
            setRefresh(undefined, 'open');
          }
        }
      })
    // catch
    // for (var e of card.errors) {
    //   toastr["error"](e, "ERROR");
    // }

}

function headerFixer() {
    var itemType = document.querySelector('table thead th:nth-child(3)').textContent.toLowerCase();

    var table_headers = $('table thead')[0];
    $(table_headers).find('th:nth-child(1)')[0].classList.add("short");
    $(table_headers).find('th:nth-child(2)')[0].classList.add("short");
    $(table_headers).find('th:nth-child(3)')[0].classList.add("long");

    $(table_headers).find('th:nth-child(4)')[0].innerHTML = "";
    $(table_headers).find('th:nth-child(4)')[0].classList.add("short");

    $(table_headers).find('th:nth-child(5)')[0].innerHTML = "SELL";
    $(table_headers).find('th:nth-child(5)')[0].classList.add("long");

    $(table_headers).find('th:nth-child(6)')[0].innerHTML = "BUY";
    $(table_headers).find('th:nth-child(6)')[0].classList.add("long");
    if(itemType === 'player' || itemType === 'equipment' ) {
        $(table_headers).find('th:nth-child(7)')[0].innerHTML = "";
        $(table_headers).find('th:nth-child(8)')[0].innerHTML = "";
    }

    $(table_headers).find('th:nth-child(1)').attr("data-sort-default", true);

    $(table_headers).find('th:nth-child(6)').after(function() {
        var returnString = '';


                for (const dataPoint in dataPoints){
                    if ( !dataPoints[dataPoint].patronsOnly ||
                        md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                        md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
                            if ( ! settings.hiddenColumns.includes(dataPoint) ) {
                            returnString = returnString + `<th data-sort-method="number" style="text-transform: none;" title="${dataPoints[dataPoint].title}">${dataPoints[dataPoint].heading}</th>`;
                            }
                        }
                }

        return returnString;
    });


    $(document).tooltip();
}

function orderHelper(onePage = false){
    //$('.helperDiv').remove();
    //toastr.clear();

    headerFixer();

    tables = $('table tbody').last()[0];
    if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
        $(tables).find('tr td:nth-child(6)').after("<td>0</td>".repeat(Object.keys(dataPoints).filter((x) => (!settings.hiddenColumns.includes(x))).length));
    }
    else
    {
        $(tables).find('tr td:nth-child(6)').after("<td>0</td>".repeat(Object.keys(dataPoints).filter((x) => (dataPoints[x].patronsOnly != true && !settings.hiddenColumns.includes(x))).length));
    }
    //$(tables).find('tr td:nth-child(2) img').each( function(i) {
    //    $(this).src("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
    //});
    $(tables).find('tr td:nth-child(2) img').attr('src','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    $(tables).find('tr td:nth-child(1)').each(function(i)
        {
            $(this).attr("data-sort", $(this).find('.mlb12-heart-solid').length > 0 ? 1 : 0);
        });

    //tables.style.display = 'flex';
    //tables.style.flexDirection = 'column';
    var numPages = 1;
    if(!onePage) {
        try {numPages = parseInt($('.pagination').find('a')[$('.pagination').find('a').length-2].innerText);}
        catch(error) { true; }
    }
sort = new Tablesort(tables.parentElement, { descending: true });
return
       // console.log(numPages);
    if(numPages > 10){
    numPages = 10;
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
                    $(tr).find('td:nth-child(6)').after("<td>0</td>".repeat(Object.keys(dataPoints).filter((x) => (!settings.hiddenColumns.includes(x))).length));
                }
                else
                {
                    $(tr).find('td:nth-child(6)').after("<td>0</td>".repeat(Object.keys(dataPoints).filter((x) => (dataPoints[x].patronsOnly != true && !settings.hiddenColumns.includes(x))).length));
                }
                tables.append(tr);
            }
            doneNum = doneNum + 1;
            if(doneNum == numPages){
                sort = new Tablesort(tables.parentElement, { descending: true });
                marketHelper()
            }

        });
    });
    }
    else
    {
               sort = new Tablesort(tables.parentElement, { descending: true });
               marketHelper();
    }






//firstTime = false;
}

function setRefresh(interval=undefined, setWhich='favorites') {
    // console.log("Debug3");
    console.log(setWhich);

    if (setWhich == 'favorites') {
        var refreshInterval = interval ? interval : settings.refreshMarketIntervalFavorites * 1000 ;
            if (refreshInterval > 0){
                favoritesTimeout = setTimeout(marketHelper.bind(null, true),refreshInterval);
            }
    }
    if (setWhich == 'open') {
        var refreshInterval = interval ? interval : settings.refreshMarketIntervalOpen * 1000 ;
            if (refreshInterval > 0){
                openTimeout = setTimeout(marketHelper.bind(null, false, '', true),refreshInterval);
            }
    }
}


function go() {
    if ( window['$'] === undefined || $('table thead').length === 0 ) {
      console.log("Waiting ... ");
      setTimeout(go, 200);
      return
    }
    // disable autocomplete
    Array.from(document.querySelectorAll('input[type=text]')).forEach(el => el.autocomplete = 'off')
    console.time('community market helper # go')
    'use strict';
    //$('.marketplace-main-heading').children()[0].append(" ("+$('.order').length+")");
    //$('.marketplace-main-heading').append('<div style="float:right">Refresh interval: <input id="refresh-interval" size="5" value=".5"></input></div>');

  $('.selected-filters').append('<button class="remove-owned">Remove Owned</button>')
  $('.remove-owned').on('click', () =>
    $('tbody:last tr')
    .filter((i,el) => Number(el.children[8].innerText) >= 1)
    .remove())

    //favoritesTimeout = setTimeout(orderHelper,60000);

    var playerIcon = document.createElement('a');
    playerIcon.classList.add('player-icon', 'cm-icon');
    playerIcon.setAttribute('title', 'MLB Players');
    playerIcon.href='https://theshownation.com/mlb20/watch_list?type=mlb_card';
    var equipmentIcon = document.createElement('a');
    equipmentIcon.classList.add('equipment-icon', 'cm-icon');
    equipmentIcon.setAttribute('title', 'Equipment');
    equipmentIcon.href='https://theshownation.com/mlb20/watch_list?type=equipment';
    var stadiumIcon = document.createElement('a');
    stadiumIcon.classList.add('stadium-icon', 'cm-icon');
    stadiumIcon.setAttribute('title', 'Stadiums');
    stadiumIcon.href='https://theshownation.com/mlb20/watch_list?type=stadium';
    var sponsorshipIcon = document.createElement('a');
    sponsorshipIcon.classList.add('sponsorship-icon', 'cm-icon');
    sponsorshipIcon.setAttribute('title', 'Sponsorships');
    sponsorshipIcon.href='https://theshownation.com/mlb20/watch_list?type=sponsorship';
    var unlockableIcon = document.createElement('a');
    unlockableIcon.classList.add('unlockable-icon', 'cm-icon');
    unlockableIcon.setAttribute('title', 'Unlockables');
    unlockableIcon.href='https://theshownation.com/mlb20/watch_list?type=unlockable';
    document.querySelector('.page-head').append(playerIcon, equipmentIcon, stadiumIcon, sponsorshipIcon, unlockableIcon);

    fetch('https://theshownation.com/mlb20/saved_searches').then( function(response) {
        if (response.ok) {
            return response.text()
          } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
          }
    } ).then( function (text) {
        text = text.replace(/<img([^>]*)\ssrc=(['"])([^'"]+)\2/gi, "<img$1 src=$2data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7$2 data-src=$2$3$2");
        text = text.replace(/<script>[^<]+<\/script>/gi, "");
        text = text.replace(/<link[^>]+>/gi, "");
        var frag = document.createRange().createContextualFragment(text);
        var allShortcuts = frag.querySelectorAll('.saved-search-title');
        allShortcuts.forEach(function(v,i) {
            var title = v.textContent;
            var link = v.href;
            var newLink = document.createElement('a');
            newLink.classList.add('cm-link');
            newLink.href = link;
            newLink.textContent = title;
            document.querySelector('.page-head').append(newLink);
        });
    }).catch( function(e) {
        console.log(e);
    });


    helperFrame = document.createElement('iframe');
    helperFrame.id = 'helperFrame';
    helperFrame.style.webkitTransform = 'scale(1)';
    helperFrame.style.transformOrigin = '0 0';
    helperFrame.style.height ='300px';
    helperFrame.style.maxHeight ='300px';
    helperFrame.style.width = '150px';
    helperFrame.style.zIndex = '99999';
    helperFrame.style.position = 'fixed';
    helperFrame.style.bottom = '1px';

    try { document.querySelector('.title-layout-heading').style.display = 'none'; } catch {  }
    try { document.querySelector('.widget-notice').style.display = 'none'; } catch {  }
    try { document.querySelector('h3').style.display = 'none'; } catch { }


    helperFrame.name = 'helperFrame';
    // helperFrame.sandbox = 'allow-same-origin';
    if (!settings.showBuyFrame ) {
        helperFrame.style.height ='1px';
    }
    $('.layout-secondary').append(helperFrame);
    helperFrame.onload = function(){
                      //  toastr["success"]("Order created","Done!");

                      marketHelper(false, this.contentDocument.location.pathname);


                        }

    if(location.search.match(/[^\/]+$/g) != null){
    orderHelper();
    }
    else {
    orderHelper(true);
    }

    window.addEventListener('message', receiver, false);
    function receiver(e) {
        if(e.data.hasOwnProperty('itemName'))
         {
            if(settings.webNotifications) {
                var url = `https://theshownation.com/mlb20/items/${e.data.itemId}`
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
                var card = cardData(text, false, e.data.itemId);
                $(card.buyForm).css('display','flex');
                card.buyForm.target = "helperFrame";
                $(card.sellForm).css('display','flex');
                card.sellForm.target = "helperFrame";

                var bgSpan = document.createElement('span');
                bgSpan.style.backgroundColor='#fff';
                var span = document.createElement('span');
                span.style.color='#000';
                var bgcolor = '';
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
                   bgcolor = 'rgba('+pickHex(parseFloat( ( ( card[settings.heatFactor] - settings.coolness) / ( settings.hotness - settings.coolness ) ).toFixed(2) ), "hot" ).join()+')';
               }
               else if ( settings.warmness >= card[settings.heatFactor] && card[settings.heatFactor] > settings.coolness ) {
                   bgcolor = 'rgba('+pickHex(parseFloat( ( ( card[settings.heatFactor] - settings.coolness) / ( settings.warmness - settings.coolness ) ).toFixed(2) ), "warm" ).join()+')';
               }
                   else {
                       bgcolor = 'rgba('+pickHex(parseFloat( ( card[settings.heatFactor] / settings.coolness ).toFixed(2) ) , "cool" ).join()+')';
                   }


               }

                //$(this).parent().append(card.sellForm);
                //$(theForm).css('width','50%');

                var cardInfo = document.createElement('span');
                cardInfo.innerHTML = `${card.profitMargin}<small>±</small> | ${card.roi}<small>ROI</small> | ${card.ppm}<small>PPM</small> | ${card.salesPerHour}<small>S/H</small>`;
                cardInfo.style.backgroundColor = bgcolor;
                span.append(card.buyForm);
                if(card.sellable > 0) {
                    span.append(card.sellForm);
                }
                bgSpan.append(cardInfo);
                span.append(bgSpan);

                toastr.info(`${span.outerHTML.replace(/data-value/g,'value')}`, `${e.data.itemName} ${e.data.itemBuyOrSell} for ${e.data.itemPrice}`);
            }).catch(function(e) { console.log(e)});



                }
             // <a href="/community_market/listings/58972dceed371780056fb58a04f7ce7e" target="blank">Rival</a>
             marketHelper(false, `/community_market/listings/${e.data.itemId}`);
             // console.log(e.data)
         }

        return Promise.resolve("Dummy response to keep the console quiet");
    }
    console.timeEnd('community market helper # go')
}

go();
setInterval(function () {
  $('button[data-confirm]').removeAttr('data-confirm')
}, 250)
