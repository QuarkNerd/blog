function initialiseStickySocial() {
    function makeSticky() {
        var width = jQuery(window).width();
        if (width > 1023) {
            if (!jQuery(".sticky-social").length) {
                jQuery(".social-container").sticky({ topSpacing: 100, wrapperClassName: "sticky-social" });
            }
        } else {
            jQuery(".social-container").unstick();
        }
    }
    jQuery(document).ready(makeSticky);
    jQuery(window).on('resize', makeSticky);
}