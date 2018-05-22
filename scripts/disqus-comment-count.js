function loadCommentCount() {
  var disqus_shortname = 'scottlogic';
  var disqus_publickey = 'Aj9eMiGDAUD3UtxJyfrldMc9nhkIvzk5CmQ7eNK3iSdseO9seaatoLdn4SghoTlZ';

  var disqus_ids = [];

  jQuery('.dq-comment-count').each(function () {
    disqus_ids.push('ident:' + jQuery(this).attr('data-disqus-identifier'));
    jQuery(this).find('.count').html('0');
  });

  while(disqus_ids.length > 0) {
    jQuery.ajax({
      type: 'GET',
      url: 'https://disqus.com/api/3.0/threads/set.jsonp',
      data: { forum: disqus_shortname, api_key: disqus_publickey, thread: disqus_ids.splice(0, 20) },
      cache: false,
      dataType: 'jsonp',
      success: function(result) {
        for(var i in result.response) {
          var num = result.response[i].posts;
          if (num > 0) {
            for(var j in result.response[i].identifiers) {
              jQuery('*[data-disqus-identifier="' + result.response[i].identifiers[j] + '"]')
                .css("display", "initial")
                .find('.count')
                .html(num);
            }
          }
        }
      }
    });
  }
};
if(siteGithubOwnerName == 'ScottLogic') {
  loadCommentCount();
}
