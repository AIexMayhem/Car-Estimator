window.onload = function() {
    let screen = $(window),
        gallery = $(".scroll-container"),
        prevArrow = $(".prev"),
        nextArrow = $(".next"),
        page = $(".dash_header"),
        galleryWidth = (gallery.get(0).scrollWidth - gallery.width()),
        gallery_scroll = gallery.scrollLeft(),
        scrollTop = screen.scrollTop(),
        flagPressedPrev = false,
        flagPressedNext = false;

    prevArrow.on("mousedown", function() {
        flagPressedPrev = true;
        gallery.scrollLeft(gallery_scroll - 5);
    })

    nextArrow.on("mousedown", function() {
        flagPressedNext = true;
        gallery.scrollLeft(gallery_scroll + 5);
    })

    nextArrow.on("mouseup", function() { flagPressedNext = false; })
    prevArrow.on("mouseup", function() { flagPressedPrev = false; })

    gallery.scroll(function() {
        gallery_scroll = gallery.scrollLeft();
        galleryWidth = (gallery.get(0).scrollWidth - gallery.width());

        if (gallery_scroll / galleryWidth * 100 > 10) { prevArrow.css({opacity: 1}); }
        else { prevArrow.css({opacity: 0}); }

        if (gallery_scroll / galleryWidth * 100 >= 90) { nextArrow.css({opacity: 0}); }
        else { nextArrow.css({opacity: 1}); }

        if (flagPressedPrev) { gallery.scrollLeft(gallery_scroll - 5); }
        if (flagPressedNext) { gallery.scrollLeft(gallery_scroll + 5); }
    })

    screen.scroll(function() {
        scrollTop = screen.scrollTop();

    })
}