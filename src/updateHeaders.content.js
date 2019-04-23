chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);

        if ( request.hasOwnProperty('openBuys') )
        {
            document.getElementById('helperStubsDiv2').innerHTML = `<small style="display:flex; flex-direction:column">${request.openBuys} open buys @ ${request.buyAmount}</small><small style="display:flex; flex-direction:column">${request.openSells} open sells @ ${request.sellAmount}</small>`;
            
        }
        else if (request.hasOwnProperty('balancePlusBuysAmt')) {
            document.getElementById('helperStubsDiv').innerHTML = '<span><img class="inline-icon-sm" src="https://s3.amazonaws.com/the-show-websites/mlb19_portal/5/img/shared/stubs.png">'+request.balanceAmt.toLocaleString()+'</span>';
            document.getElementById('helperStubsSubDiv').innerHTML = '<small style="font-style:italic; color:#a55a5a">'+request.balancePlusBuysAmt.toLocaleString()+"</small>";

        }

        sendResponse({msg: "Message"});
        return Promise.resolve("Dummy response to keep the console quiet");
      
    });