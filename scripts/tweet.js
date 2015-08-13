function loadTweetCount() {
    var API_URL = "//cdn.api.twitter.com/1/urls/count.json",
        TWEET_URL = "https://twitter.com/intent/tweet";

    jQuery(".tweet").each(function() {
        var elem = jQuery(this),
            // Use current page URL as default link
            url = encodeURIComponent(elem.attr("data-url") || document.location.href);

        if (elem.find(".count").is(':empty')) {
            // Get count and set it as the inner HTML of .count
            jQuery.getJSON(API_URL + "?callback=?&url=" + url, function(data) {
                if (data.count > 0) {
                    elem.css("opacity", 1)
                        .find(".count")
                        .html(data.count);
                }
            });
        }
    });
};
loadTweetCount();