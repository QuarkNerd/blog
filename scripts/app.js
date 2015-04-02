(function ($, window) {
	'use strict';

	var searchButton = $('#cse-search-box .searchbtn');

    function getEncodedTopSearchURI() {
	    if(typeof String.prototype.trim !== 'function') {
	        String.prototype.trim = function() {
	            return this.replace(/^\s+|\s+$/g, ''); 
	        }
	    }
	    var term = $('#cse-search-box .searchbox').val().trim();
	    if (term.length > 0) {
	        var form = $('#cse-search-box');
	        var formAction = form.attr('action');
	        return encodeURI(formAction + '?' + form.serialize());
	    }
	    return null;
    }

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            var uri = getEncodedTopSearchURI();
            if (uri !== null) {
                window.location.href = uri;
            }
            else {
                event.preventDefault();
                return false;
            }
        }
    });

    searchButton.click(function () {
        var uri = getEncodedTopSearchURI();
        if (uri !== null) {
            window.location.href = uri;
        }
    });

    searchButton.mouseover(function () {
        $(this).css('opacity', '1');
        var input = $('#cse-search-box .searchbox');
        if (input.css('opacity') !== "1") {
            input.show();
            input.animate({ opacity: 1 }, 200);
            input.animate({ filter: 'alpha(opacity=100)' }, 200);
        }
        input.focus();
    });

})(jQuery, this);