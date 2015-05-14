var csrftoken

function setCookie(key, value) {
	var expires = new Date();
	expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
	document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.url) {
    window.localStorage[sender.tab.id] = request.url
  }
})

var extensionAction = function(){
  chrome.tabs.query({active:true, currentWindow:true}, function(tab){
	$.get('http://heap.nobr.me/csrf/', function(res) {
	  $.post('http://heap.nobr.me/feed/action/', 
		     {url: tab[0].url},
		      function(res) {
		if (res.url) {
		  if (res.url.match(/^http/)) {
			chrome.tabs.update({url: res.url});
		  } else {
			chrome.tabs.create({url:'http://heap.nobr.me' + res.url});
		  }
		}
		checkUrl(tab[0].id, tab[0].url);
	  })
	})
  })
}

chrome.commands.getAll(function(data){
  console.log(data)
})

chrome.commands.onCommand.addListener(function(command){
  if (command === '_extension_action') {
    extensionAction();
  }
})

chrome.browserAction.onClicked.addListener(extensionAction)

var changeIcon = function(tab) {
  if (window.localStorage[tab.id]) {
	chrome.browserAction.setIcon({path: './assets/icons/check.png'})
  } else {
	chrome.browserAction.setIcon({path: './assets/icons/add.png'})
  }
}

var checkUrl = function(tabId, url) {
  $.get('http://heap.nobr.me/csrf/', function(res) {
	csrftoken = res.match(/value=\'(.+)\'/)[1]
	$.post('http://heap.nobr.me/feed/check_url/', 
			 {url: url},
			 function(res) {
	  if (res.url) {
		window.localStorage[tabId] = res.url
		chrome.browserAction.setIcon({path: './assets/icons/check.png'})
	  } else {
		delete window.localStorage[tabId]
		chrome.browserAction.setIcon({path: './assets/icons/add.png'})
	  }
	})	  
  })
}

chrome.tabs.onUpdated.addListener(function(tabId, data){
  chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
	if (tabId === tabs[0].id && data.status === 'loading' && data.url) {
	  checkUrl(tabId, data.url)
	}
  })
})  

chrome.tabs.onActivated.addListener(function() {
  chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
	changeIcon(tabs[0])
  });
})

chrome.windows.onFocusChanged.addListener(function() {
  chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
	changeIcon(tabs[0])
  });
})