$.get('http://192.168.62.127/feed/redirect', function(res){
  if (res.url.slice(0,4) === 'http') {
    chrome.runtime.sendMessage({pk: res.pk}); 
	window.location = res.url
  } else {
     window.location = 'http://192.168.62.127' + res.url;
  }
})