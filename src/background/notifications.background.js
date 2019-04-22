chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
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
          
      
    });