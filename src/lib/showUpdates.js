export default function showUpdates(currentVersion, changelog, scriptName) {
        
    var updateMessageSeen = 0;
        if(localStorage.hasOwnProperty('tsn-versionUpdate-'+scriptName)){
            updateMessageSeen = localStorage.getItem('tsn-versionUpdate-'+scriptName);
        }
        else{
            localStorage.setItem('tsn-versionUpdate-'+scriptName, 0);
        }
        if ( version_gt(currentVersion, updateMessageSeen)) {

            var updateDialog = document.createElement('div');
            updateDialog.title = "MLBTSN Helper Update - "+scriptName+" "+currentVersion;
            var updateInnerHTML = '';

            for (checkVersion in changelog) {
            
                if( version_gt(checkVersion, updateMessageSeen ) )
                {
                    updateInnerHTML += `<h3>${checkVersion} changelog</h3><ul>`;
                    for ( var change of changelog[checkVersion] ) {
                        updateInnerHTML += `<li>${change}</li>`;
                    }
                    updateInnerHTML += '</ul><hr>';
                    
                }
                

            }
            
            
            updateDialog.innerHTML = updateInnerHTML;


            $( updateDialog ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Got It!": function() {
                        localStorage.setItem('tsn-versionUpdate-'+scriptName, currentVersion);
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
        }
    
}