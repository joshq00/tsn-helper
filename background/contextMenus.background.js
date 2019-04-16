chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "cm_parent",
      "title": "MLBTSN 19",
      "contexts": ["all"]
    });
    chrome.contextMenus.create({
      "id": "cm_communitymarket",
      "title": "Community Market",
      "contexts": ["all"],
      "parentId": "cm_parent",
    });
    chrome.contextMenus.create({
      "id": "cm_separator",
      "type": "separator",
      "contexts": ["all"],
      "parentId": "cm_parent",
    });
    chrome.contextMenus.create({
      "id": "cm_openorders",
      "title": "Open Orders",
      "contexts": ["all"],
      "parentId": "cm_parent",
    });
    chrome.contextMenus.create({
      "id": "cm_completedorders",
      "title": "Completed Orders",
      "contexts": ["all"],
      "parentId": "cm_parent",
    });
    chrome.contextMenus.create({
      "id": "cm_completedordershistory",
      "title": "Completed Orders History",
      "contexts": ["all"],
      "parentId": "cm_parent",
    });

    chrome.contextMenus.onClicked.addListener(function (info, tab){
      urls = {
        'cm_communitymarket': 'https://mlb19.theshownation.com/community_market',
        'cm_openorders': 'https://mlb19.theshownation.com/community_market/orders/open',
        'cm_completedorders': 'https://mlb19.theshownation.com/community_market/orders/completed',
        'cm_completedordershistory': 'https://mlb19.theshownation.com/community_market/orders/completed?page=0'
      };
      if( urls[info.menuItemId]) {
        chrome.tabs.create({ url: urls[info.menuItemId] });
      }
      
      console.log(info.menuItemId);
    });
  });