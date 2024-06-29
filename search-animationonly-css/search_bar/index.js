'use strict';

document.querySelectorAll('.dropdown-container').forEach(function(container) {
  var inputField = container.querySelector('.chosen-value');
  const layoutForm = $("#layout_form");
  var dropdown = container.querySelector('.value-list');
  var dropdownItems = Array.from(dropdown.querySelectorAll('li'));
  // dropdown.classList.add('open');
  // inputField.focus();

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
    });
  });

  inputField.addEventListener('focus', function () {
    layoutForm.css({"border-radius": "10px 0 0 0", "border-bottom": "0"});
    inputField.placeholder = 'Type to filter';
    dropdown.classList.add('open');
    dropdownItems.forEach(function (item) {
      item.classList.remove('closed');
    });
  });

  inputField.addEventListener('blur', function () {
    inputField.placeholder = 'Select state';
    dropdown.classList.remove('open');
    layoutForm.css({"border-radius": "10px 0 0 10px", "border-bottom": "2px solid #D9D9D9"});
  });

  document.addEventListener('click', function (evt) {
    var isDropdown = dropdown.contains(evt.target);
    var isInput = inputField.contains(evt.target);
    if (!isDropdown && !isInput) {
      dropdown.classList.remove('open');
    }
  });

});
