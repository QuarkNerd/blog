(function($, window) {

    $('.carousel-cell').click(function() {
        window.location = $(this).data('article-link')
    });

    $('.carousel-cell').hover(function() {
        $(this).find('.carousel-caption').addClass('hover');
    },
    function() {
        $(this).find('.carousel-caption').removeClass('hover');
    });

}(jQuery, window));