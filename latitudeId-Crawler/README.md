Howto Use/Install
=================
1. Install NodeJs (http://nodejs.org/) and NPM (https://npmjs.org/)    
On Ubuntu:

    sudo apt-get install nodejs
    sudo apt-get install npm

2. get dependencies:

    npm install jsdom

3. Start Crawler:

    node Crawler.js

Files/Objects
=============
Crawler -> the main class: prints IDs on stdout    
IdFilter -> Parses input strings (html) and extracts Google-Latitude Ids    
Search -> searches for links in websites    
HTTPRequest -> API to easily get the body of a website by sending HTTP-Request    

Description
===========
Just testing....
