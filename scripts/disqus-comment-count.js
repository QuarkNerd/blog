var disqus_shortname = 'scottlogic';

var disqus_publickey = "Aj9eMiGDAUD3UtxJyfrldMc9nhkIvzk5CmQ7eNK3iSdseO9seaatoLdn4SghoTlZ";
var disqus_ids = [];

(function() {
  jQuery('.dq-comment-count').each(function () {
    disqus_ids.push('ident:' + jQuery(this).attr('data-disqus-identifier'));
    jQuery(this).html('0 comments');
  });

  while(dq_ids.length > 0) {
    jQuery.ajax({
      type: 'GET',
      url: 'https://disqus.com/api/3.0/threads/set.jsonp',
      data: { api_key: disqus_publickey, forum: disqus_shortname, thread: disqus_ids.splice(0, 20) },
      cache: false,
      dataType: 'jsonp',
      success: function(result) {
        for(var i in result.response) {
          var num = result.response[i].posts;
          var txt = (num == 1) ? ' comment' : ' comments';

          for(var j in result.response[i].identifiers) {
            jQuery('div[data-disqus-identifier="' + result.response[i].identifiers[j] + '"]').html(num + txt);
          }
        }
      }
    });
  }
}());