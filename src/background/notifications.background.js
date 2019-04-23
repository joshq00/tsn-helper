chrome.browserAction.setBadgeBackgroundColor({color: [200,200,200,200]});

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {

        if ( request.hasOwnProperty('itemName') )
        {
        id = "MLBTSN"+request.itemId;
        
        var opt = {
            type: "basic",
            title: "Order Completed",
            message: `${request.itemName} ${request.itemBuyOrSell} for ${request.itemPrice}`,
            iconUrl: chrome.runtime.getURL('icons/128.png'),
            requireInteraction: true
          };
          chrome.notifications.create(id, opt, function(id) {
            timer = setTimeout(function(){chrome.notifications.clear(id);}, 15000);
          });
        }
        else if ( request.hasOwnProperty('openBuys') )
        {
            chrome.browserAction.setBadgeText({text: `${request.openBuys}/${request.openSells}`})
        }

        sendResponse({msg: "Message"});
        return Promise.resolve("Dummy response to keep the console quiet");
      
    });