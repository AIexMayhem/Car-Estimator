document.querySelectorAll('.dropdown-container').forEach(function(container) {
  var inputField = container.querySelector('.chosen-value');
  var dropdown = container.querySelector('.value-list');
  var dropdownItems = Array.from(dropdown.querySelectorAll('li'));

  var valueArray = [];
  dropdownItems.forEach(function (item) {
    valueArray.push(item.textContent);
  });

  var closeDropdown = function closeDropdown() {
    dropdown.classList.remove('open');
  };

  inputField.addEventListener('input', function () {
    dropdown.classList.add('open');
    var inputValue = inputField.value.toLowerCase();
    if (inputValue.length > 0) {
      for (var j = 0; j < valueArray.length; j++) {
        if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
          dropdownItems[j].classList.add('closed');
        } else {
          dropdownItems[j].classList.remove('closed');
        }
      }
    } else {
      dropdownItems.forEach(function (item) {
        item.classList.remove('closed');
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
    if (inputField.id === 'layout_form') {
      $('#layout_form').css({"border-radius": "10px 0 0 0", "border-bottom": "0"});
    }
    if (inputField.id === 'model_form') {
      $('#model_form').css({"border-bottom": "0"});
    }
    if (inputField.id === 'year_form') {
      $('#year_form').css({"border-bottom": "0"});
    }
    if (inputField.id === 'color_form') {
      $('#color_form').css({"border-bottom": "0"});
    }
    if (inputField.id === 'body_form') {
      $('#body_form').css({"border-bottom": "0"});
    }
    if (inputField.id === 'odometr_form') {
      $('#odometr_form').css({"border-radius": "0 10px 0 0", "border-bottom": "0"});
    }

    dropdown.classList.add('open');
    dropdownItems.forEach(function (item) {
      item.classList.remove('closed');
    });
  });

  inputField.addEventListener('blur', function () {
    if (inputField.id === 'layout_form') {
      $('#layout_form').css({"border-radius": "10px 0 0 10px", "border-bottom": "2px solid #D9D9D9"});
    }
    if (inputField.id === 'model_form') {
      $('#model_form').css({"border-bottom": "2px solid #D9D9D9"});
    }
    if (inputField.id === 'year_form') {
      $('#year_form').css({"border-bottom": "2px solid #D9D9D9"});
    }
    if (inputField.id === 'color_form') {
      $('#color_form').css({"border-bottom": "2px solid #D9D9D9"});
    }
    if (inputField.id === 'body_form') {
      $('#body_form').css({"border-bottom": "2px solid #D9D9D9"});
    }
    if (inputField.id === 'odometr_form') {
      $('#odometr_form').css({"border-radius": "0 10px 10px 0", "border-bottom": "2px solid #D9D9D9"});
    }
    closeDropdown();
  });

  document.addEventListener('click', function (evt) {
    var isDropdown = dropdown.contains(evt.target);
    var isInput = inputField.contains(evt.target);
    if (!isDropdown && !isInput) {
      closeDropdown();
    }
  });
});
