
window.onload = function(){
    let screen = $(window),
        cars = $("#cars"),
        page = $(".logo_page"),
        wrapper = $("#logo_wrapper"),
        arrowUp = $("#arrow_up"),
        arrowDown = $("#arrow_down"),
        description = $(".description"),
        weCanDo = $(".we_can_do"),
        logo = $("#logo"),

        screenWidth = page.width(),
        screenHeight = page.height(),
        scrollTop = screen.scrollTop(),
        ratio = screenWidth / screenHeight;

    const carGroupWidth = cars.width(),
        carGroupHeight = cars.height();

    window.scrollTo(0, 0);
    logo.css({"opacity": 1})

    arrowUp.on("click", function() {
        window.scrollTo(0, scrollTop - 1 + (scrollTop % screenHeight));
    })

    arrowDown.on("click", function() {
        window.scrollTo(0, screenHeight + 1 + scrollTop - (scrollTop % screenHeight));
    })

    screen.scroll(function() {
        screenWidth = page.width();
        screenHeight = page.height();
        scrollTop = screen.scrollTop();
        ratio = screenWidth / screenHeight;

        if (15 < scrollTop / screenHeight * 100 && scrollTop / screenHeight * 100 < 185) {
            arrowUp.css({ visibility: "visible" })
            arrowDown.css({ visibility: "visible" })
        }
        else if (scrollTop / screenHeight * 100 < 15) {
            arrowUp.css({ visibility: "hidden" })
        }
        else if (scrollTop / screenHeight * 100 > 185) {
            arrowDown.css({ visibility: "hidden" })
        }

        let maxPercentage = ratio * 100,
            horizontalMove = 3 * scrollTop * ratio,
            verticalMove = 4 * scrollTop;

        cars.css({
            "left": Math.min(2 * 100, (horizontalMove - carGroupWidth) / screenWidth * 100) + "%",
            "top": Math.min(2 * 100, (verticalMove - carGroupHeight) / screenHeight * 100) + "%"
           });

        if (66 <= scrollTop / screenHeight * 100 && scrollTop / screenHeight * 100 <= 133) {
            weCanDo.css({ transform: "scale(1)", opacity: 1 })
            description.css({ transform: "scale(1)", opacity: 1 })
        }
        else {
            weCanDo.css({ transform: "scale(0)", opacity: 0 })
            description.css({ transform: "scale(0)", opacity: 0 })
        }

        wrapper.css({
            "clip-path":
                "polygon(" +
                    "0%" + (verticalMove / screenHeight * 100) + "%, " + // p1
                    (horizontalMove / screenWidth / ratio * 100 - 10) + "% " + // p2_x
                        (verticalMove / screenHeight * 100) + "%, " + // p2_y
                    (horizontalMove / screenWidth / ratio * 100) + "% " + // p3_x
                        (verticalMove / screenHeight * 100 - 10) + "%, " + // p3_y
                    ((horizontalMove - carGroupWidth + maxPercentage) / screenWidth * 100) + "% " + // p4_x
                        ((verticalMove - carGroupHeight + maxPercentage) / screenHeight * 100) + "%, " + // p4_y
                    (horizontalMove / screenWidth * 100 - 10) + "% " + // p5_x
                        (verticalMove / screenHeight / ratio * 100) + "%, " + // p5_y
                    (horizontalMove / screenWidth * 100) + "% " + // p6_x
                        (verticalMove / screenHeight / ratio * 100 - 10) + "%, " + // p6_y
                    (horizontalMove / screenWidth * 100) + "% 0%, " + // p7
                    "100% 0%, " + // p8
                    "100% 100%, " + // p9
                    "0% 100%" + // p10
                ")"
        })
    });
};
