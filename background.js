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
  if (request.pk) {
    window.localStorage[sender.tab.id] = request.pk
  }
})

var extensionAction = function(){
  chrome.tabs.query({active:true, currentWindow:true}, function(tab){
	$.get('http://192.168.62.127/csrf/', function(res) {
		$.post('http://192.168.62.127/feed/action/', 
		   {pk:window.localStorage[tab[0].id],
			url: tab[0].url},
		   function(res) {
		if (res.url) {
		  if (res.url.match(/^http/)) {
			chrome.tabs.update({url: res.url});
		  } else {
			chrome.tabs.create({url:'http://192.168.62.127' + res.url});
		  }
		}
	  })
	})
  })
}

chrome.commands.getAll(function(data){
  console.log(data)
})

chrome.commands.onCommand.addListener(function(command){
  console.log('extension action')
  console.log(command)
  if (command === '_extension_action') {
    extensionAction();
  }
})

chrome.browserAction.onClicked.addListener(extensionAction)

chrome.tabs.onUpdated.addListener(function(tabId, data){
  chrome.tabs.query({active:true, currentWindow:true}, function(tab) {
	if (tabId === tab[0].id && data.status === 'loading' && data.url) {
	  $.get('http://192.168.62.127/csrf/', function(res) {
	    csrftoken = res.match(/value=\'(.+)\'/)[1]
		$.post('http://192.168.62.127/feed/check_url/', 
			   {url:data.url},
			   function(res) {
		  if (res.pk) {
			window.localStorage[tabId] = res.pk
			chrome.browserAction.setIcon({path: './assets/icons/check.png'})
		  } else {
			chrome.browserAction.setIcon({path: './assets/icons/add.png'})
		  }
		})	  
	  })
	}
  })
})