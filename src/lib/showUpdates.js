export default function showUpdates(currentVersion, changelog, scriptName) {
    // versionCompare from https://github.com/Rombecchi/version-compare
    function versionCompare(e,r,n){var t=n&&n.lexicographical||!1,a=n&&n.zeroExtend||!0,i=(e||"0").split("."),u=(r||"0").split(".");function l(e){return(t?/^\d+[A-Za-zαß]*$/:/^\d+[A-Za-zαß]?$/).test(e)}if(!i.every(l)||!u.every(l))return NaN;if(a){for(;i.length<u.length;)i.push("0");for(;u.length<i.length;)u.push("0")}t||(i=i.map(function(e){var r=/[A-Za-zαß]/.exec(e);return Number(r?e.replace(r[0],"."+e.charCodeAt(r.index)):e)}),u=u.map(function(e){var r=/[A-Za-zαß]/.exec(e);return Number(r?e.replace(r[0],"."+e.charCodeAt(r.index)):e)}));for(var h=0;h<i.length;++h){if(u.length==h)return 1;if(i[h]!=u[h])return i[h]>u[h]?1:-1}return i.length!=u.length?-1:0}
    function version_gt(v1,v2) { return versionCompare(v1, v2) > 0 ? true : false; }

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

        for (var checkVersion in changelog) {

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
