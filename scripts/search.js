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

})(jQuery, this);
