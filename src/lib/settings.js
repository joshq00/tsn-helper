import md5 from './md5.js'

var settings_defaults = { 
    "refreshInterval": 60, 
    "heatFactor": "roi", 
    "hotness": 100, 
    "warmness": 30, 
    "coolness": 10, 
    "superSecret": "", 
    "refreshMarketInterval": 60, 
    "showBuyFrame": false, 
    "ignoreSoloBuySell": false, 
    "webNotifications": false,
    "chromeNotifications": true,
    "hiddenColumns": []
     }

// Get/init localStorage settings

function initSettings(settings={}) {
        
        if(localStorage.hasOwnProperty('tsn-settings')){
        settings = JSON.parse(localStorage.getItem('tsn-settings'));
        }

        return saveSettings(settings);
    
}

function saveSettings(settings={}) {
    for (var prop in settings_defaults) {
        if ( !settings.hasOwnProperty(prop) )
        {
            settings[prop] = settings_defaults[prop]
        }
    }
    settings.superSecretMd5 = md5(settings.superSecret); 
    localStorage.setItem('tsn-settings',JSON.stringify(settings));
    return settings;
}


function initSchema() {
    var settings = initSettings();
    var schema = {}
        schema = {
            "$schema": "http://json-schema.org/draft-03/schema#",
            "type": "object",
            "properties": {
                "refreshInterval": {
                    "type": "integer",
                    "title": "Refresh Card Page Interval (seconds)",
                    "description": "Number of seconds between card info refreshes. [0 = off]",
                    "default": 15,
                    "required": true
                    },
                "heatFactor": {
                    "type": "string",
                    "title": "[ Patron Feature ] Heat Factor",
                    "description": "What property should gradient heat-mapping be based on?",
                    "default": "salesPerMinute",
                    "enum": [
                        {"text": "Profit", "value": "profitMargin"},
                        {"text": "PPM: Potential Profit per Minute", "value": "ppm"},
                        {"text": "ROI: Return on Investment", "value": "roi"},
                        {"text": "Buy Factor: Trend vs historical average", "value": "buyTrend"},
                        {"text": "Sell Factor: Trend vs historical average", "value": "sellTrend"},
                        {"text": "Popularity (sales per hour)", "value": "salesPerHour"},
                        {"text": "Sellable #", "value": "sellable"},
                        {"text": "Profit Gap: Estimated historical buy/sell gap", "value": "profitGap"},
                        ],
                    "required": true,
                    "readOnly": true

                },
                "hotness": {
                    "type": "number",
                    "title": "Hotness",
                    "description": "What level should be indicated as hot?",
                    "default": 1,
                    "required": true,
                    },
                "warmness": {
                    "type": "number",
                    "title": "[ Patron Feature ] Warmness",
                    "description": "[ Patrons Only Feature ] What level should be indicated as warm?",
                    "default": 0.5,
                    "required": true,
                    "readOnly": true
                    },
                "coolness": {
                    "type": "number",
                    "title": "[ Patron Feature ] Coolness",
                    "description": "[ Patrons Only Feature ] What max level should be indicated as cool?",
                    "default": 0.1,
                    "required": true,
                    "readOnly": true
                    },
                "webNotifications": {
                    "type": "boolean",
                    "title": "In-page notifications?",
                    "description": "[Patrons Only Feature ] Receive notifications on the website for completed buys/sells?",
                    "default": false,
                    "required": true,
                    "readOnly": true
                },
                "chromeNotifications": {
                    "type": "boolean",
                    "title": "Chrome notifications?",
                    "description": "[Patrons Only Feature ] Receive notifications from the browser for completed buys/sells?",
                    "default": false,
                    "required": true,
                    "readOnly": true
                },
                "superSecret": {
                                "type": "string",
                                "title": "Game Genie",
                                "description": "To unlock features - donate (or at least say thanks) to sreyemnayr",
                                "required": true
                            },
                }
            };

        // Patron settings un-readonlify

        if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' || md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
        // Settings for folks who said thanks or became patrons :)
        // or knew how to mess with the source code ;)
            for (var prop in schema.properties) {
            
                if (schema.properties.hasOwnProperty(prop)) {
                schema.properties[prop].readOnly = false;
                schema.properties[prop].title = schema.properties[prop].title.replace("[ Patron Feature ] ","");
                }
            }

        schema.properties = Object.assign({}, schema.properties, {

                "refreshMarketInterval": {
                "type": "integer",
                    "title": "Refresh Interval in seconds (Community Market Helper)",
                    "description": "Number of seconds between card info refreshes on community market - Only applies to favorited items. [0 = off]",
                    "default": 0,
                    "required": true
                    },
            "showBuyFrame": {
                "type": "boolean",
                    "title": "Show helper iframe?",
                    "description": "Show the iframe for buy/sell/cancel orders (Community Market Helper)",
                    "default": false,
                    "required": true
                    },
            "ignoreSoloBuySell": {
                "type": "boolean",
                    "title": "Ignore single buy/sells (Completed Orders Helper)",
                    "description": "Completed Orders Helper: leave out single buy/sells for better data.",
                    "default": false,
                    "required": true
                    },
                "hiddenColumns": {
                    "type": "array",
                    "title": "Hidden Columns in Community Market",
                    "minItems": 0,
                    "uniqueItems": true,
                    "items": {
                        "type": "string",
                        "title": "Hidden column",
                        "description": "Do not show this column",
                        "enum": [
                            {"text": "Profit", "value": "profitMargin"},
                            {"text": "Delta Profit (based on last purchase)", "value": "myProfit"},
                            {"text": "PPM: Potential Profit per Minute", "value": "ppm"},
                            {"text": "ROI: Return on Investment", "value": "roi"},
                            {"text": "Average sale price", "value": "avgBuyNow"},
                            {"text": "Average buy price", "value": "avgSellNow"},
                            {"text": "Average profit", "value": "avgProfit"},
                            {"text": "Average ROI", "value": "avgRoi"},
                            {"text": "Exchange Points per Stub", "value": "perExchange"},
                            {"text": "Buy Factor: Trend vs historical average", "value": "buyTrend"},
                            {"text": "Sell Factor: Trend vs historical average", "value": "sellTrend"},
                            {"text": "Popularity (sales per hour)", "value": "salesPerHour"},
                            {"text": "Sellable #", "value": "sellable"},
                            {"text": "Owned #", "value": "owned"},
                            {"text": "Open Orders", "value": "openOrders"},
                            {"text": "Profit Gap: Estimated historical buy/sell gap", "value": "profitGap"},
                            ],
                    }

                }
                });
            

        }


        if(md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333'){
            // Sorry guys, this one's just for me ;)
        schema.properties = Object.assign({}, schema.properties, {
            
                "autoAdjustBuy": {
                    "type": "boolean",
                    "title": "Auto-adjustment (buy)",
                    "description": "Should outbid buys be adjusted to win?",
                    "required": true,
                    "default": true
                },
                "autoBuy": {
                    "type": "boolean",
                    "title": "Auto-buy cards?",
                    "description": "Buy cards within their set threshold?",
                    "required": true,
                    "default": false
                },
                "autoBuyThreshold": {
                    "type": "integer",
                    "title": "Auto-buy threshold",
                    "description": "Floor for stubbs balance",
                    "default": 50000,
                    "required": true
                },
                "autoBuyCards": {
                    "type": "array",
                    "title": "Auto-buy cards",
                    "minItems": 0,
                    "uniqueItems": true,
                    "items": {
                        "description": "Card",
                        "type": "object",
                        "properties": {
                            "search":{
                                "type": "string",
                                "title": "Search",
                                "description": "Search for cards",
                                "required": false
                            },
                            "cardName": {
                                "type": "string",
                                "title": "Card name",
                                "description": "Card name",
                                "required": true
                            },
                            "cardURL": {
                                "type": "string",
                                "title": "Card URL",
                                "description": "TSN URL for card",
                                "required": true
                            },
                            "enabled": {
                                "type": "boolean",
                                "title": "Auto-buy this card?",
                                "required": true,
                                "default": true

                            },
                            "threshold": {
                                "type": "integer",
                                "title": "Highest amount (in Stubbs) that should initiate a buy"
                            },
                            "max": {
                                "type": "integer",
                                "title": "Maximum number to keep in inventory"
                            }
                        }
                    }
                },
                "autoSell": {
                    "type": "boolean",
                    "title": "Auto-sell cards?",
                    "description": "Sell cards within their set threshold?",
                    "required": true,
                    "default": false
                },
                "autoSellCards": {
                    "type": "array",
                    "title": "Auto-sell cards",
                    "minItems": 0,
                    "uniqueItems": true,
                    "items": {
                        "description": "Card",
                        "type": "object",
                        "properties": {
                            "search":{
                                "type": "string",
                                "title": "Search",
                                "description": "Search for cards",
                                "required": false
                            },
                            "cardName": {
                                "type": "string",
                                "title": "Card name",
                                "description": "Card name",
                                "required": true
                            },
                            "cardURL": {
                                "type": "string",
                                "title": "Card URL",
                                "description": "TSN URL for card",
                                "required": true
                            },
                            "enabled": {
                                "type": "boolean",
                                "title": "Auto-sell this card?",
                                "required": true,
                                "default": true

                            },
                            "threshold": {
                                "type": "integer",
                                "title": "Lowest amount (in Stubbs) that should initiate a sell"
                            },
                            "keep": {
                                "type": "integer",
                                "title": "How many of this card should we make sure to keep?",
                                "default": 1
                            }
                        }
                    }
                }
            });

        }
return schema;
}

export const settings = initSettings();
export const schema = initSchema();
export {saveSettings};
export default settings;