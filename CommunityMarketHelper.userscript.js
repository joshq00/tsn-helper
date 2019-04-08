// ==UserScript==
// @name         MLB The Show Nation Community Market Helper 19
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.4.8.4
// @description  Expand community market search pages to include all pages. More features coming soon.
// @author       sreyemnayr
// @match        https://mlb19.theshownation.com/community_market*
// @exclude      https://mlb19.theshownation.com/community_market/listings/*
// @exclude      https://mlb19.theshownation.com/community_market/orders/*
// @require https://greasyfork.org/scripts/40549-mlbtsncarddata/code/MLBTSNCardData.js?version=687482
// @require https://greasyfork.org/scripts/40553-mlbtsntampersettingsframework-2019/code/MLBTSNTamperSettingsFramework%202019.js?version=687481

// ==/UserScript==
//var notified = false;

var currentVersion = "2019.4.8.3";

var changelog = [];

changelog["2019.4.8.3"] = ['Switched minutes per sale to sales per hour - better for heatmap',
                            'Added option for buy/sell factor and ROI on heatmap',
                        'Styling fixes'];

changelog["2019.4.8.2"] = ['Began adding image logos for equipment to make space',
                          'Shortened series names for space'];

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
            //$(this).parent().css('display','flex');

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
            //$(this).parent().css('display','flex');
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
                sphTd[0].innerHTML = card.salesPerHour;

                var ppmTd = $(this).parent().parent().find('td:nth-child(11)');
                ppmTd[0].innerHTML = card.ppm;

                var gapTd = $(this).parent().parent().find('td:nth-child(12)');
                gapTd[0].innerHTML = card.profitGap;

                

                var avgSellTd = $(this).parent().parent().find('td:nth-child(13)');
                avgSellTd[0].innerHTML = card.avgBuyNow;

                var sellTrendTd = $(this).parent().parent().find('td:nth-child(14)');
                sellTrendTd[0].innerHTML = card.buyTrend;

                var avgBuyTd = $(this).parent().parent().find('td:nth-child(15)');
                avgBuyTd[0].innerHTML = card.avgSellNow;

                var buyTrendTd = $(this).parent().parent().find('td:nth-child(16)');
                buyTrendTd[0].innerHTML = card.sellTrend;

                var avgProfitTd = $(this).parent().parent().find('td:nth-child(17)');
                avgProfitTd[0].innerHTML = card.avgProfit;

                var avgRoiTd = $(this).parent().parent().find('td:nth-child(18)');
                avgRoiTd[0].innerHTML = card.avgRoi;
                }

                var brandTd = $(this).parent().parent().find('td:nth-child(19)');
                $(brandTd).attr("data-sort", brandTd[0].textContent);
                brandTd[0].innerHTML = replaceBulk(brandTd[0].innerHTML, findReplaceSeries);
                brandTd[0].innerHTML = replaceBulk(brandTd[0].innerHTML, findReplaceBrands);


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
    $(table_headers).find('th:nth-child(5)')[0].innerHTML = "SELL";
    $(table_headers).find('th:nth-child(6)')[0].innerHTML = "BUY";
    $(table_headers).find('th:nth-child(7)')[0].innerHTML = "";
    $(table_headers).find('th:nth-child(8)')[0].innerHTML = "";

    $(table_headers).find('th:nth-child(1)').attr("data-sort-default", true);
    if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' ||
                  md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
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
    $(tables).find('tr td:nth-child(6)').after("<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>");
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
                    $(tr).find('td:nth-child(6)').after("<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>");
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