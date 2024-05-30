window.onload = function(){
    let whiteCar = $("#white"),
        blackLeftCar = $("#black_left"),
        blackRightCar = $("#black_right"),
        screen = $(window);

    const screenWidth = window.innerWidth,
        animationTime = 5,
        horizontalScale = 6,
        verticalScale = 4,
        whiteCarWidth = whiteCar.width(),
        whiteCarHeight = whiteCar.height(),
        blackCarWidth = blackLeftCar.width(),
        blackCarHeight = blackLeftCar.height();

    screen.scroll(function() {
        let scrollTop = screen.scrollTop(),
            horizontalMove = scrollTop * horizontalScale,
            verticalMove = scrollTop * verticalScale;

        whiteCar.animate({
            "left": horizontalMove - whiteCarWidth + "px",
            "top": verticalMove - whiteCarHeight + "px",
           }, animationTime);

        blackLeftCar.animate({
            "left": horizontalMove - blackCarWidth + "px",
            "top": verticalMove + "px",
            }, animationTime);

        blackRightCar.animate({
            "left": horizontalMove + "px",
            "top": verticalMove - blackCarHeight + "px",
            }, animationTime);

    });

};

