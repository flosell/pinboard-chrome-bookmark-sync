pinboard-chrome-bookmark-sync
=============================

**pre-alpha, not very well tested. do not use this on your production-browser unless you know what you are doing and have good backups**

About
-----

Does exactly what the title says: Syncs your Pinboard.in with Google-Chrome Bookmarks so you feel like you are working with your browsers bookmarks but still have all the nice features of pinboard. 

This tool syncs bookmarks on a tag-query level, i.e. it puts everything that matches a set of tags into one bookmark-folder. 

Usage
-----

* Install the extension in Google Chrome 
* Set User Credentials (no UI for this yet)
* Create a folder to contain some of your bookmarks
* In this folder, create a bookmark named `-> Open in Pinboard!` (exactly like this) with a URL pointing to pinboard-tags (like `https://pinboard.in/u:someuser/t:foo/t:bar` to have a folder that contains all bookmarks having tags "foo" and "bar")
* Start Syncing (no UI for this yet)

Still in Development: 

* Push Bookmarks back to the server
* UI to set User Credentials and Sync
* Autosync
* Packaging and Deployment
* Easier creation of new sync-folders
* Automated Testing and other code quality
