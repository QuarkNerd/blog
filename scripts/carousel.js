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

    var mobileMargin = 40
    $('.small-carousel').scrollLeft(mobileMargin);;

}(jQuery, window));