
window.onload = function() {
    let gallery = $(".scroll-container"),
        prevArrow = $(".prev"),
        nextArrow = $(".next"),
        galleryWidth = (gallery.get(0).scrollWidth - gallery.width()),
        gallery_scroll = gallery.scrollLeft(),
        flagPressedPrev = false,
        flagPressedNext = false;

    let Model = localStorage.getItem("Model"),
        Year = localStorage.getItem("Year"),
        HP = localStorage.getItem("HP"),
        Body = localStorage.getItem("Body"),
        Yearsell = localStorage.getItem("Yearsell"),
        Odometer = localStorage.getItem("Odometer"),
        Color = localStorage.getItem("Color"),
        Price = 0,
        Photo,
        Sells = 0;
    document.title = Model + Year;
    document.getElementById("car_name").innerHTML = Model;
    document.getElementById("car_info").innerHTML = Year + " г. | " + Color + " | " + Body;

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
            let response = JSON.parse(xhr.responseText);
            Price = response["Price"];
            Photo = response["Photos"];
            Sells = response["Sell"]
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

    setTimeout(() => {
        let gallery_container = document.getElementById("scroll_gallery");
        if (Photo.length === 0) {
            for (let i = 0; i < 3; i++) {
                let imgs = document.createElement("img");
                imgs.src = "../assets/images/car.png";
                gallery_container.appendChild(imgs);
            }
        }
        else if (Photo.length < 3) {
            for (let i = 0; i < 3; i++) {
                let imgs = document.createElement("img");
                imgs.src = Photo[Math.floor(Math.random() * Photo.length)];
                gallery_container.appendChild(imgs);
            }
        }
        for (let i = 0; i < Photo.length; i++) {
            let imgs = document.createElement("img");
            imgs.src = Photo[i];
            gallery_container.appendChild(imgs);
        }
    }, 2000);

    setTimeout(() => {
        let img= document.createElement("img");
        img.src = "../backend/graph.png"
        img.id = "year_graph_pic"
        let year_div = document.getElementById("year_graph");
        year_div.appendChild(img);
        document.getElementById("year_text").innerHTML = ("Цена в " + Yearsell + " году будет: ");
        document.getElementById("car_price").innerHTML = ('~' + Price + '$');
        document.getElementById("sell_text").innerHTML = ("Количество продаж за последние 8 лет:");
        document.getElementById("car_sell").innerHTML = ('~' + Sells + ' шт.');
        }, 2000);

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


}