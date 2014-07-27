var App = function(pinboardModule, bookmarksModule) {
  var module = {};

  module.sync = function() {
    bookmarksModule.findTargetFolders(function(targetFolders) {
      targetFolders.forEach(function(targetFolder) {
        pinboardModule.getBookmarksForTags(targetFolder.tags,function(bookmarks) {
          bookmarksModule.setBookmarks(targetFolder.folderId,bookmarks);
        });
      });
    });
  };

  return module;
  
}

var Pinboard = function(settings) {
  var module = {};

   var bookmarkUrl = function(tags,callback) {
    
    settings.getAuthToken(function(authToken) {
      var tagQuery = "tag="+tags.join(",");
      callback("https://api.pinboard.in/v1/posts/all?auth_token="+authToken+"&format=json&"+tagQuery);
    });
  }

  module.getBookmarksForTags = function(tags,callback) {
    bookmarkUrl(tags,function(url) {
      $.getJSON(url,function(data) {
        var bookmarks = data.map(function(entry) {
          return {
            url: entry.href,
            title: entry.description
          }
        });

        callback(bookmarks);
      });
    });
  };
  return module;
};

var Bookmarks = function() {
  var module = {};

  var createBookmark = function(parentId, bookmark) {
    var children = chrome.bookmarks.getChildren(parentId,function(children) {
      var existingBookmarksWithSameUrl = children.filter(function(child) {
        return child.url.indexOf(bookmark.url)!=-1 && Math.abs(child.url.length - bookmark.url.length) <=1; // hacky way to check for equal but tolerating trailing / that chrome mitght put in
      });

      if (existingBookmarksWithSameUrl.length === 0) {
        chrome.bookmarks.create({
            title: bookmark.title,
            url: bookmark.url, 
            parentId: parentId
        },function() {
          console.log("Added",bookmark);
        });
      } else {
        console.log("Bookmark for URL "+bookmark.url+" already exists");
      }
    });
    
  }

  module.setBookmarks = function(folderId, bookmarks) {
    bookmarks.forEach(function(bookmark) {
      createBookmark(folderId,bookmark);
    })
  };

  var tagsForUrl = function(url) {
    return url.substr(url.indexOf("t:")).split("/").map(function(part) { return part.replace("t:",""); });
  };

  // we treat everything as a target-folder that has a bookmark to a tags-overview in a particular format
  module.findTargetFolders = function(callback) {
    chrome.bookmarks.search({
      title: "-> Open in Pinboard!"
    },function(result) {
      var targetFolders = result.filter(function(elem) {
        return elem.url.indexOf("https://pinboard.in/") === 0;
      }).map(function(elem) {
        return {
          folderId: elem.parentId,
          tags: tagsForUrl(elem.url)
        };
      });

      callback(targetFolders);
    })
  }
  

  return module;
}

var Settings = function() {
  // can we find a more secure way of storing those credentials?
  var module = {}
  module.getAuthToken = function(callback) {
    chrome.storage.local.get("auth_token",function(result) {
      callback(result.auth_token)
    });
  }

  module.setAuthToken = function(token) {
    chrome.storage.local.set({'auth_token':token});
  }
  return module;
}