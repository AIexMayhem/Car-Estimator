let makes = new Map();
let loadMakeMap = function () {
    fetch("../files/Make_Model.txt")
        .then(response => response.text())
        .then(data => {
            let dataSplit = data.split('\n')

            for (let i = 0; i < dataSplit.length; i++) {
                let make = dataSplit[i].split(" | ")[0];
                let model = dataSplit[i].split(" | ")[1].slice(0, -1);
                if (!makes.has(make)) {
                    makes.set(make, [model]);
                }
                else {
                    makes.get(make).push(model);
                }
            }
        })
}

let loadUniqueDataToLi = function (input, path) {
    fetch(path)
        .then(response => response.text())
        .then(data => {
            let ul = document.getElementById(input);
            let dataSplit = data.split('\n')
            for (let i = 0; i < dataSplit.length; i++) {
                let li = document.createElement("li");
                li.appendChild(document.createTextNode(dataSplit[i]));
                ul.appendChild(li);
            }
        })
}

let addListenersToSearchContainer = function () {
    document.querySelectorAll('.dropdown-container').forEach(function(container) {
        const inputField = container.querySelector('.chosen-value');
        const dropdown = container.querySelector('.value-list');
        const dropdownItems = Array.from(dropdown.querySelectorAll('li'));

        const valueArray = [];

        inputField.addEventListener("keypress", function(event) {
            // If the user presses the "Enter" key on the keyboard
            if (event.key === "Enter") {
                // Cancel the default action, if needed
                event.preventDefault();
            }
        });
        dropdownItems.forEach(function (item) {
            valueArray.push(item.textContent);
        });
        console.log(valueArray);

        const closeDropdown = function closeDropdown() {
            dropdown.classList.remove('open');
        };

        inputField.addEventListener('input', function () {
            dropdown.classList.add('open');
            const inputValue = inputField.value.toLowerCase();
            let make = document.getElementById("make_form").value;
            if (inputValue.length > 0) {
                for (let j = 0; j < valueArray.length; j++) {
                    if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
                        dropdownItems[j].classList.add('closed');
                    } else {
                        if (inputField.id === "model_form" && make !== '') {
                            if (makes.get(make).includes(valueArray[j])) {
                                dropdownItems[j].classList.remove('closed')
                            }
                            else {
                                dropdownItems[j].classList.add('closed');
                            }
                        }
                        else {
                            dropdownItems[j].classList.add('closed');
                        }
                    }
                }
            } else {
                dropdownItems.forEach(function (item) {
                    if (inputField.id === "model_form" && make !== '') {
                        if (makes.get(make).includes(item.textContent)) {
                            item.classList.remove('closed')
                        }
                        else {
                            item.classList.add('closed');
                        }
                    }
                    else {
                        item.classList.remove('closed');
                    }
                });
            }
        });

        dropdownItems.forEach(function (item) {
            item.addEventListener('click', function () {
                inputField.value = item.textContent;
                dropdownItems.forEach(function (dropdown) {
                    dropdown.classList.add('closed');
                });
                closeDropdown();
            });
        });

        inputField.addEventListener('focus', function () {
            let form = $('#' + inputField.id);
            let make = document.getElementById("make_form").value;
            if (inputField.id === 'make_form') {
                form.css({"border-radius": "20px 0 0 0", "border-bottom": "0"});
            }
            else if (inputField.id === 'odometer_form') {
                form.css({"border-radius": "0 20px 0 0", "border-bottom": "0"});
            }
            else {
                form.css({"border-bottom": "0"});
            }


            dropdown.classList.add('open');

            dropdownItems.forEach(function (item) {
                if (inputField.id === "model_form" && make !== '') {
                    if (makes.get(make).includes(item.textContent)) {
                        item.classList.remove('closed')
                    }
                    else {
                        item.classList.add('closed');
                    }
                }
                else {
                    item.classList.remove('closed')
                }

            });
        });

        inputField.addEventListener('blur', function () {
            let form = $('#' + inputField.id);
            if (inputField.id === 'make_form') {
                form.css({"border-radius": "20px 0 0 20px", "border-bottom": "2px solid #D9D9D9"});
            }
            else if (inputField.id === 'odometer_form') {
                form.css({"border-radius": "0 20px 20px 0", "border-bottom": "2px solid #D9D9D9"});
            }
            else {
                form.css({"border-bottom": "2px solid #D9D9D9"});
            }
            closeDropdown();
        });

        document.addEventListener('click', function (evt) {
            const isDropdown = dropdown.contains(evt.target);
            const isInput = inputField.contains(evt.target);
            if (!isDropdown && !isInput) {
                closeDropdown();
            }
        });
    });

    document.querySelector('.next-arrow').addEventListener('click', function() {
        // Перемещение первой панели вверх
        document.querySelector('.panel-1').style.top = '-100%';
        // Перемещение второй панели на место первой
        document.querySelector('.panel-2').style.top = '0';
    });
}

window.onload = function(){
    let screen = $(window),
        cars = $("#cars"),
        page = $(".logo_page"),
        wrapper = $("#logo_wrapper"),
        logo = $("#logo"),
        arrowUp = $("#arrow_up"),
        arrowDown = $("#arrow_down"),
        description = $(".description"),
        weCanDo = $(".we_can_do"),

        searchContainer = $(".search-container"),
        searchText = $(".search_text"),
        newYear = $(".new-year"),
        newYearForm = document.getElementById("yearsell_form"),
        odometer = document.getElementById("odometer_form"),
        nextArrow = $(".next-arrow"),
        formEdit = $("form"),
        yearArrow = $(".year-arrow"),

        screenWidth = page.width(),
        screenHeight = page.height(),
        scrollTop = screen.scrollTop(),
        ratio = screenWidth / screenHeight;


    const carGroupWidth = cars.width(),
        carGroupHeight = cars.height();

    loadUniqueDataToLi("make_input", "../files/Make.txt");
    loadUniqueDataToLi("model_input", "../files/Model.txt");
    loadUniqueDataToLi("color_input", "../files/Color.txt");
    loadUniqueDataToLi("body_input", "../files/Body.txt");
    loadMakeMap();



    nextArrow.on("click", function () {
        nextArrow.css({ width: "0px", height: "0px" });
        newYear.css({ top: "40%" });
        formEdit.css({ left: "50%", visibility: "visible" });
        yearArrow.css({ top: "0%", opacity: 1, scale: 1, visibility: "visible" });
    })

    newYearForm.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            console.log('2442')
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("year_arrow").click();
        }
    });
    odometer.addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("next_arrow").click();
        }
    });
    window.scrollTo(0, 0);
    logo.css({ opacity: 1 });

    arrowUp.on("click", function() {
        window.scrollTo({
            left: 0,
            top: scrollTop - screenHeight + 1 - (scrollTop % screenHeight),
            behavior: "smooth"
        });
    })

    arrowDown.on("click", function() {
        window.scrollTo({
            left: 0,
            top: scrollTop + screenHeight + 1 - (scrollTop % screenHeight),
            behavior: "smooth"
        });
    })

    yearArrow.on("click", function() {
        let Make = document.getElementById("make_form").value,
            Model = document.getElementById("model_form").value,
            Year = document.getElementById("year_form").value,
            Color = document.getElementById("color_form").value,
            HP = document.getElementById("HP_form").value,
            Body = document.getElementById("body_form").value,
            Odometer = document.getElementById("odometer_form").value,
            Yearsell = document.getElementById("yearsell_form").value;
        if (Make === '' || Model === '' || Year === '' || Color === '' ||
            HP === '' || Body === '' || Odometer === '' || Yearsell === '') {
            alert("Введите все характеристики")
        }
        else {
            localStorage.setItem("Make", Make);
            localStorage.setItem("Model", Model);
            localStorage.setItem("Year", Year);
            localStorage.setItem("Color", Color);
            localStorage.setItem("HP", HP);
            localStorage.setItem("Body", Body);
            localStorage.setItem("Odometer", Odometer);
            localStorage.setItem("Yearsell", Yearsell);
            window.location.href = "dashboard.html";
        }
    })

    setTimeout(() => { addListenersToSearchContainer(); }, 1000);

    screen.scroll(function() {
        screenWidth = page.width();
        screenHeight = page.height();
        scrollTop = screen.scrollTop();
        ratio = screenWidth / screenHeight;

        let maxPercentage = ratio * 100,
            horizontalMove = 3 * scrollTop * ratio,
            verticalMove = 4 * scrollTop;

        if (scrollTop / screenHeight * 100 > 500 / 3) {
            searchContainer.css({ opacity: 1 })
            searchText.css({ opacity: 1 })
        }
        else {
            searchContainer.css({ opacity: 0 })
            searchText.css({ opacity: 0 })
        }

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

        cars.css({
            left: Math.min(120, (horizontalMove - carGroupWidth) / screenWidth * 100) + "%",
            top: Math.min(120, (verticalMove - carGroupHeight) / screenHeight * 100) + "%"
        });

        if (38 <= scrollTop / screenHeight * 100 && scrollTop / screenHeight * 100 <= 450 / 3) {
            weCanDo.css({ transform: "scale(1)", opacity: 1 });
            description.css({ transform: "scale(1)", opacity: 1 });
        }

        else {
            weCanDo.css({ transform: "scale(0)", opacity: 0 });
            description.css({ transform: "scale(0)", opacity: 0 });

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