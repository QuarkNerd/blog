var disqus_shortname = 'scottlogic';

var dq_publickey = "Aj9eMiGDAUD3UtxJyfrldMc9nhkIvzk5CmQ7eNK3iSdseO9seaatoLdn4SghoTlZ";
var dq_urls = [];

// API Query
(function() {
  jQuery('.dq-comment-count').each(function () {
    dq_urls.push(jQuery(this).attr('data-disqus-identifier'));
  });

  jQuery.ajax({
    type: 'GET',
    url: 'https://disqus.com/api/3.0/threads/set.jsonp',
    data: { api_key: dq_publickey, forum: disqus_shortname, thread: dq_urls },
    cache: false,
    dataType: 'jsonp',
    success: function(result) {
      for(var i in result.response) {
        var num = result.response[i].posts;
        var txt = (num == 1) ? ' comment' : ' comments';
        jQuery('div[data-disqus-identifier="' + result.response[i].link + '"]').html(num + txt);
      }
    }
  });
}());

// Disqus automatic count generation
(function () {
  var s = document.createElement('script');
  s.async = true; s.type = 'text/javascript'; s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
  (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());