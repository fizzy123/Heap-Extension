$(function() {
var url
url = 'http://heap.nobr.me/feed/redirect'
$.get(url, function(res){
  console.log(res.url);
  if (res.url.slice(0,4) === 'http') {
    chrome.runtime.sendMessage({url: res.url}); 
	url = res.url
  } else {
     window.location = 'http://heap.nobr.me' + res.url;
	 return
  }
  console.log(res)
  if (!res.iframe) {
    window.location = url;
	return
  } else {
	var iframe = $('<iframe>').attr('src', url).attr('width', '100%').attr('height', '100%');
	$('body').append(iframe);
	window.localStorage['fakeUrl'] = url;
  }
})
});