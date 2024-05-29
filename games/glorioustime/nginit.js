// Set up the options for NGIO.
var options = {
    version: "1.4.1",
    preloadMedals: true
};

NGIO.init("58345:DIHyD07m", "9Zfs8R7QrO66kxp+H2kb7g==", options);

let ngLoop = setInterval(function(){
    NGIO.getConnectionStatus(function(status) {
        
        // You could hide any login/preload UI elements here (we'll show what we need later).

        // This is a generic check to see if we're waiting for something...
        if (NGIO.isWaitingStatus) {
            document.querySelector(".NewgroundsIO").innerHTML = "<h1>Connecting to NEWGROUNDS</h1>"
            // We're either waiting for the server to respond, or the user to sign in on Newgrounds.
            // Show a "please wait" message and/or a spinner so the player knows something is happening
        }

        // check the actual connection status
        switch (status) {

            // we have version and license info
            case NGIO.STATUS_LOCAL_VERSION_CHECKED:

                if (NGIO.isDeprecated) {
                    document.querySelector(".gameVerDisp").innerHTML = options.version + " (outdated)"
                } else {
                    document.querySelector(".gameVerDisp").innerHTML = options.version
                }

                if (!NGIO.legalHost) {
                    document.body.innerHTML = "<h1>THIS GAME IS BEING HOSTED ILLEGALLY, GO TO <a href=\"https://waspventman.co.uk\">WASPVENTMAN.CO.UK</a></h1>"
                }

                break

            // user needs to log in
            case NGIO.STATUS_LOGIN_REQUIRED:
                document.querySelector(".NewgroundsIO").innerHTML = "<h2>Log into to NEWGROUNDS to earn achievements!</h2><div class=\"ngButton\" onclick=\"NGIO.openLoginPage()\"><h1>Yes, please!</h1></div><div class=\"ngButton\" onclick=\"NGIO.skipLogin()\"><h1>No, thanks!</h1></div>"

                // Show a "Log In" button that calls NGIO.openLoginPage();
                // Show a "No Thanks" button that calls NGIO.skipLogin();

                break

            // We are waiting for the user to log in (they should have a login page in a new browser tab)
            case NGIO.STATUS_WAITING_FOR_USER:
                document.querySelector(".NewgroundsIO").innerHTML = "<h1>Connecting to NEWGROUNDS</h1><br><div class=\"ngButton\" onclick=\"NGIO.cancelLogin()\"><h1>Wait, no!</h1></div>"

                // Show a "Cancel Login" button that calls NGIO.cancelLogin();
                
                break;

            // user needs to log in
            case NGIO.STATUS_READY:
                document.querySelector(".NewgroundsIO").style.display = "none"

                // If NGIO.hasUser is false, the user opted not to sign in, so you may
                // need to do some special handling in your game.
                
                break
        }

    })
}, 100)

function onMedalUnlocked(medal)
{
    document.querySelector(".achievement").innerHTML = `<div style="text-align: right; margin-right: 8px;"><h1>${medal.name}</h1><h3>${medal.description}</h3><h2>+${medal.value} Points</h2></div><img style="width: 140px;" src="ach/${medal.id}.png">`
    /**
     * Show a medal popup.  You can get medal information like so:
     *   medal.id
     *   medal.name
     *   medal.description
     *   medal.value
     *   medal.icon  (note, these are usually .webp files, and may not work in all frameworks)
     */
}

//NGIO.UnlockMedal(medal_id, onMedalUnlocked);