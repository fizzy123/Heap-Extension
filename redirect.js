$.get('https://nobr10-80.terminal.com/feed/redirect', function(res){
  if (res.url.slice(0,4) === 'http') {
    chrome.runtime.sendMessage({pk: res.pk}); 
	window.location = res.url
  } else {
     window.location = 'https://nobr10-80.terminal.com' + res.url;
  }
})