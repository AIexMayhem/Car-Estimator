window.onload = function(){
    $("#white").css({"margin-right": "2500px"});
    $("#white").css({"margin-bottom": "1000px"});
    $(window).scroll(function() {
        let scrollTop = $(window).scrollTop();
        console.log("scrollTop>>>" + scrollTop);
        $("#white").css(
            {"margin-left": ($(window).scrollTop()) * 4 + "px",
                   "margin-top": ($(window).scrollTop()) * 0.75 + "px"
                    });
    });

};

