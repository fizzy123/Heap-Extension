$(function() {
  $('#iframe').prop('checked', window.localStorage['iframe'])
  $('#iframe').change(function() {  
    window.localStorage['iframe'] = (this.checked === 'true');
  });
})