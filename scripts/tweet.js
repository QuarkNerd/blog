(function() {
    var API_URL = "http://cdn.api.twitter.com/1/urls/count.json",
        TWEET_URL = "https://twitter.com/intent/tweet";

    jQuery(".tweet").each(function() {
        var elem = jQuery(this),
            // Use current page URL as default link
            url = encodeURIComponent(elem.attr("data-url") || document.location.href),
            // Use page title as default tweet message
            text = elem.attr("data-text") || document.title;

        // Set href to tweet page
        elem.attr({
            href: TWEET_URL + "?source=tweetbutton&text=" + text + "&url=" + url,
            target: "_blank"
        });

        // Get count and set it as the inner HTML of .count
        jQuery.getJSON(API_URL + "?callback=?&url=" + url, function(data) {
            elem.find(".count").html(data.count);
        });
    });
}());