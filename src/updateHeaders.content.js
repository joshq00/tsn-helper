var updateHeaderInterval = setInterval(function() { return true; }, 99999999);
function updateHeaders() {
    clearInterval(updateHeaderInterval);
    var numBuys = 0;
    var numSells = 0;
    var buysAmount = 0;
    var sellsAmount = 0;
    var balanceAmt = 0;
    var balancePlusBuysAmt = 0;

    if(document.getElementById('helperStubsDiv')) {
    if(localStorage.hasOwnProperty('tsn-numBuys')){
        numBuys = parseInt(localStorage.getItem('tsn-numBuys'));
        } 
    if(localStorage.hasOwnProperty('tsn-numSells')){
        numSells = parseInt(localStorage.getItem('tsn-numSells'));
        } 
    if(localStorage.hasOwnProperty('tsn-buysAmount')){
        buysAmount = parseInt(localStorage.getItem('tsn-buysAmount'));
        } 
    if(localStorage.hasOwnProperty('tsn-sellsAmount')){
        sellsAmount = parseInt(localStorage.getItem('tsn-sellsAmount'));
        } 
    if(localStorage.hasOwnProperty('tsn-balanceAmt')){
        balanceAmt = parseInt(localStorage.getItem('tsn-balanceAmt'));
        } 
    if(localStorage.hasOwnProperty('tsn-balancePlusBuysAmt')){
        balancePlusBuysAmt = parseInt(localStorage.getItem('tsn-balancePlusBuysAmt'));
        } 

        document.getElementById('helperStubsDiv').innerHTML = '<span>'+balanceAmt.toLocaleString()+'</span>';
        document.getElementById('helperStubsSubDiv').innerHTML = '<small style="font-style:italic; color:#a55a5a">'+balancePlusBuysAmt.toLocaleString()+"</small>";
        document.getElementById('helperStubsDiv2').innerHTML = `<small style="display:flex; flex-direction:column">${numBuys} open buy` + ( numBuys > 1 ? 's' : '' ) + ( numBuys > 0 ?  ` @ ${buysAmount}` : `s` ) + `</small><small style="display:flex; flex-direction:column">${numSells} open sell` + ( numSells > 1 ? 's' : '' ) + ( numSells > 0 ?  ` @ ${sellsAmount}` : `s` ) + `</small>`;
    updateHeaderInterval = setInterval(updateHeaders, 10000);
    }
    else if ( document.getElementsByClassName('global-logo').length > 0 ) {
        var logo = document.getElementsByClassName('global-logo')[0];
        logo.style.display = 'flex';
        logo.style.alignItems = 'center';
        var outerStubsDiv = document.createElement('div');
        outerStubsDiv.style.color = 'white';
        outerStubsDiv.style.display = 'inline-block';
        outerStubsDiv.style.marginLeft = '5px';
        var stubsDiv = document.createElement('div');
        stubsDiv.id = 'helperStubsDiv';
        stubsDiv.style.display = 'flex';
        stubsDiv.style.flexDirection = 'column';
        var stubsSubDiv = document.createElement('div');
        stubsSubDiv.id = 'helperStubsSubDiv';
        stubsSubDiv.style.display = 'flex';
        stubsSubDiv.style.flexDirection = 'column';
        outerStubsDiv.append(stubsDiv);
        outerStubsDiv.append(stubsSubDiv);
        
        var stubsDiv2 = document.createElement('div');
        stubsDiv2.id = 'helperStubsDiv2';
        stubsDiv2.style.color = 'white';
        stubsDiv2.style.display = 'inline-block';
        stubsDiv2.style.marginLeft = '5px';
        logo.append(outerStubsDiv);
        logo.append(stubsDiv2);
        updateHeaders();
    }
    else {
        console.log("Document not ready");
        setTimeout(updateHeaders,200);
    }

}
function inIframe () {  try { return window.self !== window.top; } catch (e) { return true; } };

if(!inIframe()){
updateHeaders();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);

        updateHeaders();
        
        window.postMessage(request);

        sendResponse({msg: "Message"});
        return Promise.resolve("Dummy response to keep the console quiet");
      
    });
}