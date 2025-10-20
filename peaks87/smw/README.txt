{
    "name": "texture pack name", Texture pack name
    "cameraX": true,             Camera scrolls from left to right? (true/false)
    "clouds": true,              Clouds enabled? (true/false)
    "textureSky": true,          Use textures in /sky for sky? (true/false)
    "paralaxSkyTexture": false,  Scroll the sky texture? (only works if "textureSky" is true) (false/number)
    "replaceHolds": false,       Replace hold textures, if false you will get base game holds and you can delete the /holds folder and textures
    "musicCredits": [
        "music/sounds you used in your pack",
        "in the form of a list (no line limit)"
    ],
    "musicReplacements": { Replace music/audio (pulls from audio/, so the example wind would be audio/audiofile.mp3) (Do not delete "musicReplacements" as it will stop your pack from working)
        "wind": "audiofile.mp3",   Replace the "wind" audio (delete if unchanged)
        "forest": "audiofile.mp3", Replace the "forest" audio (delete if unchanged)
        "death": "audiofile.mp3",  Replace the "death" audio (delete if unchanged)
        "record": "audiofile.mp3", Replace the "record" audio (delete if unchanged)
        "credits": "audiofile.mp3" Replace the "credits" audio (delete if unchanged)
    },
    "paralaxBase": 0,    How high above the ground the paralax considers 0 (16 == 1 tile)
    "paralaxDefault": 0, The height added to make the paralax start scrolled (not really sure how this value works lol)
    "forceTime": "D",    Force time to be always at a certain time (D, FD, TN, N, FN, TD, false)
    "creator": "your name here", Your name goes here
    "version": 2         Version, use 1 for 1.0.4 sky colours, 2 for modern
}

!!!IMPORTANT!!!
DO NOT delete any files from the pack, as the assets deleted will appear invisible in game

You can delete the "D.png", "FD.png", "FN.png", "N.png", "TD.png" and "TN.png" files in the "sky" folder if you have "textureSky" set to false, "stars.png" is still required

HOW TO HOST TEXTURE PACK
Create a repository on Github and upload your pack to it, you can have multiple packs in a repo if they are in different folders
Open the pack.json file on the Github website and click the "RAW" button, this will open your pack.json on raw.githubusercontent.com
The URL should look something like this:
https://raw.githubusercontent.com/USERNAME/REPOSITORY/refs/heads/main/TEXTUREPACK/pack.json

Just remove the "pack.json" from the end of the link and you have a sharable texture pack URL!
You don't need to update the URL when updating the pack, it should stay the same