chrome.browserAction.setBadgeBackgroundColor({color: [200,200,200,200]});

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {

        if ( request.hasOwnProperty('itemName') && request.notifyChrome)
        {
        id = "MLBTSN"+request.itemId;
        
        var opt = {
            type: "basic",
            title: "Order Completed",
            message: `${request.itemName} ${request.itemBuyOrSell} for ${request.itemPrice}`,
            iconUrl: chrome.runtime.getURL('icons/128.png'),
            requireInteraction: true
          };
          
          chrome.tabs.query({active:true, lastFocusedWindow: true}, function(tabs){
            // send the message to the content script
            chrome.tabs.sendMessage(tabs[0].id, request); 
            if (! request.notifyWeb || tabs[0].url.indexOf('theshownation.com') < 0 ) {
              chrome.notifications.create(id, opt, function(id) {
                timer = setTimeout(function(){chrome.notifications.clear(id);}, 5000);
              });
            }
                          
        });
        }
        else if ( request.hasOwnProperty('numBuys') )
        {
          chrome.tabs.query({active:true}, function(tabs){
            // send the message to the content script
            chrome.tabs.sendMessage(tabs[0].id, request);               
        });
          
            chrome.browserAction.setBadgeText({text: `${request.numBuys}/${request.numSells}`})
        }
        else if ( request.hasOwnProperty('balancePlusBuysAmt') )
        {
          chrome.tabs.query({active:true}, function(tabs){
            // send the message to the content script
            chrome.tabs.sendMessage(tabs[0].id, request);               
        });
          
           
        }

        sendResponse({msg: "Message"});
        return Promise.resolve("Dummy response to keep the console quiet");
      
    });