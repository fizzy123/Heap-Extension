$.get('http://heap.nobr.me/feed/redirect', function(res){
  if (res.url.slice(0,4) === 'http') {
    chrome.runtime.sendMessage({pk: res.pk}); 
	window.location = res.url
  } else {
     window.location = 'http://heap.nobr.me' + res.url;
  }
})