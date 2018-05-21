function loadClapCount() {
    var elements = jQuery(".clap").toArray();
    var urls = elements.map(function(el) {
        return el.getAttribute("data-url");
    });
    jQuery.ajax({
        url: "https://ltxkcod9s9.execute-api.us-east-1.amazonaws.com/production/get-multiple",
        method: "POST",
        data: JSON.stringify(urls),
        headers: {
            "Content-Type": "text/plain"
        },
        contentType: "text/plain"
    }).done(function(claps) {
        jQuery(".clap").each(function() {
            var elem = jQuery(this),
                url = elem.attr("data-url");
            var clapCount = claps.find(function(c) { return c.url === url; });
            if (clapCount && clapCount.claps > 0) {
                elem.css("display", "initial")
                    .find(".count")
                    .html(clapCount.claps);
            }
        });
    });
}