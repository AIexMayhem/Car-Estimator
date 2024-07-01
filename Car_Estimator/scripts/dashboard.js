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

    let Model = localStorage.getItem("Model"),
        Year = localStorage.getItem("Year"),
        HP = localStorage.getItem("HP"),
        Body = localStorage.getItem("Body"),
        Yearsell = localStorage.getItem("Yearsell"),
        Odometer = localStorage.getItem("Odometer"),
        Color = localStorage.getItem("Color"),
        Price = 0;

    let xhr = null;
    let getXmlHttpRequestObject = function () {
        if (!xhr) {
            // Create a new XMLHttpRequest object
            xhr = new XMLHttpRequest();
        }
        return xhr;
    };

    function dataCallback() {
        // Check response is ready or not
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("User data received!");
            console.log(xhr.responseText);
        }
    }

    function sendDataCallback() {
        // Check response is ready or not
        if (xhr.readyState == 4 && xhr.status == 201) {
            console.log("Data creation response received!");
            Price = parseFloat(xhr.responseText);
            console.log(Price);
        }
    }

    function sendData() {
        let dataToSend = [Model, parseInt(Year), parseInt(HP), Body, parseInt(Yearsell), parseInt(Odometer), Color];
        if (!dataToSend) {
            console.log("Data is empty.");
            return;
        }
        console.log("Sending data: " + dataToSend);
        xhr = getXmlHttpRequestObject();
        xhr.onreadystatechange = sendDataCallback;
        // asynchronous requests
        xhr.open("POST", "http://localhost:6969/car", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // Send the request over the network
        xhr.send(JSON.stringify({"data": dataToSend}));
    }

    function getCarInfo() {
        console.log("Get car info...");
        xhr = getXmlHttpRequestObject();
        xhr.onreadystatechange = dataCallback;
        // asynchronous requests
        xhr.open("GET", "http://localhost:6969/car", true);
        // Send the request over the network
        xhr.send(null);
    }

    getCarInfo();
    sendData();

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