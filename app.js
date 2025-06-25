const itemInput = document.getElementById('itemInput');
const quantityInput = document.getElementById('quantityInput');
const notesInput = document.getElementById('notesInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const groceryList = document.getElementById('groceryList');
const itemCount = document.getElementById('itemCount');

window.addEventListener('DOMContentLoaded', loadListFromStorage);

addBtn.addEventListener('click', function () {
  const itemText = itemInput.value.trim();
  const quantity = quantityInput.value.trim() || '1';
  const notes = notesInput.value.trim();

  if (itemText !== '') {
    const fullText = `${itemText} (Qty: ${quantity})${notes ? ' - ' + notes : ''}`;
    addItemToList(fullText);
    saveListToStorage();
    itemInput.value = '';
    quantityInput.value = '';
    notesInput.value = '';
    updateItemCount();
  }
});

clearBtn.addEventListener('click', function () {
  if (confirm('Are you sure you want to clear the list?')) {
    groceryList.innerHTML = '';
    localStorage.removeItem('groceryList');
    updateItemCount();
  }
});

function addItemToList(itemText, purchased = false) {
  const li = document.createElement('li');
  li.textContent = itemText;

  if (purchased) {
    li.classList.add('purchased');
  }
  li.addEventListener('click', function () {
    li.classList.toggle('purchased');
    saveListToStorage();
  });

  li.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    groceryList.removeChild(li);
    saveListToStorage();
    updateItemCount();
  });

  li.addEventListener('dblclick', function () {
    const newItem = prompt('Edit item:', li.textContent);
    if (newItem !== null && newItem.trim() !== '') {
      li.textContent = newItem.trim();
      saveListToStorage();
    }
  });

  groceryList.appendChild(li);
}
function saveListToStorage() {
  const items = [];
  groceryList.querySelectorAll('li').forEach(li => {
    items.push({
      text: li.textContent,
      purchased: li.classList.contains('purchased')
    });
  });

  localStorage.setItem('groceryList', JSON.stringify(items));
}

function loadListFromStorage() {
  const items = JSON.parse(localStorage.getItem('groceryList')) || [];

  items.forEach(item => {
    addItemToList(item.text, item.purchased);
  });

  updateItemCount();
}

function updateItemCount() {
  const count = groceryList.querySelectorAll('li').length;
  itemCount.textContent = `Total Items: ${count}`;
}
function filterList(type) {
  const items = groceryList.querySelectorAll('li');
  items.forEach(li => {
    if (type === 'all') {
      li.style.display = '';
    } else if (type === 'purchased') {
      li.style.display = li.classList.contains('purchased') ? '' : 'none';
    } else if (type === 'notPurchased') {
      li.style.display = li.classList.contains('purchased') ? 'none' : '';
    }
  });
}

function sortList() {
  const items = Array.from(groceryList.querySelectorAll('li'));
  items.sort((a, b) => a.textContent.localeCompare(b.textContent));
  groceryList.innerHTML = '';
  items.forEach(li => groceryList.appendChild(li));
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

itemInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});
