var currentRequest = null;
var topResult = '';

chrome.omnibox.onInputEntered.addListener(function(text) {
    // Encode user input for special characters , / ? : @ & = + $ #
    //var newURL = 'https://www.google.com/search?q=' + ;
    if ( text.indexOf('http') == -1) {
        text = topResult.content;
    }
    chrome.tabs.create({ url: text });
  });

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    if (currentRequest != null) {
        currentRequest.onreadystatechange = null;
        currentRequest.abort();
        currentRequest = null;
      }
  
      updateDefaultSuggestion(text);
      if (text == '' || text == 'halp')
        return;
  
      currentRequest = search(text, function(json) {
        var results = [];
        var entries = json;
        console.log("Debug Current Request", entries);
  
        for (var i = 0, entry; i < 10 && (entry = entries[i]); i++) {
          var path = entry.url;
          //var line =
          //    entry.getElementsByTagName("match")[0].getAttribute("lineNumber");
          //var file = path.split("/").pop();
          var template = entry.template;
          var regex1 = /<[^>]+>/;
          var template_split = template.split(regex1);
  
          var description = '<url>' + entry.url + '</url>';
         
            description += ' <dim>' + template_split.filter(function(e){ return e != '' }).join(" | ").replace(new RegExp(text,"gi"), "<match>$&</match>") + '</dim>';
          
  
          results.push({
            content: entry.url ,
            description: description
          });
        }
        topResult = results[0];
        chrome.omnibox.setDefaultSuggestion({description: results[0].description});
        suggest(results);
      });
    
  });

function search(query, callback) {
    console.log("Debug Search", query);
    if (query == 'halp')
      return;
  
    /*if (/^re:/.test(query))
      query = query.substring('re:'.length);
    else if (/^file:/.test(query))
      query = 'file:"' + query.substring('file:'.length) + '"';
    else
      query = '"' + query + '"';*/
  
    var url = "https://mlb19.theshownation.com/community_market/quick_search.json?term=" + query ;
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("GData-Version", "2");
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
        callback(JSON.parse(req.responseText));
      }
    }
    req.send(null);
    return req;
  }
  
  function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
      description: '<url><match>src:</match></url> Search Chromium source'
    });
  }
  
  resetDefaultSuggestion();
  
  function updateDefaultSuggestion(text) {
   
  
    var description = '<match><url>src</url></match><dim> [</dim>';
    description += '<match>' + text + '</match>';
    description += '<dim> | </dim>';
    
    chrome.omnibox.setDefaultSuggestion({
      description: description
    });
  }
  
  chrome.omnibox.onInputStarted.addListener(function() {
    updateDefaultSuggestion('');
  });