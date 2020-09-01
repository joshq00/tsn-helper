chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "cm_parent",
      "title": "MLBTSN 20",
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
        'cm_communitymarket': 'https://theshownation.com/mlb20/community_market',
        'cm_openorders': 'https://theshownation.com/mlb20/orders/open_orders',
        'cm_completedorders': 'https://theshownation.com/mlb20/orders/completed_orders',
        'cm_completedordershistory': 'https://theshownation.com/mlb20/orders/completed_orders?page=0'
      };
      if( urls[info.menuItemId]) {
        chrome.tabs.create({ url: urls[info.menuItemId] });
      }
      
      console.log(info.menuItemId);
    });
  });