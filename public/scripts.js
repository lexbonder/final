
const addItem = async event => {
  event.preventDefault();
  const itemName = $('.input').val()
  const initialFetch = await fetch('/api/v1/marsItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ itemName })
  })
  if ( initialFetch.status === 201 ) {  
    renderNewItem(itemName);
  }
}

const renderNewItem = itemName => {
  $('.item-container').prepend(`
    <article>
      <div class="top-of-card">
        <h2>${itemName}</h2>
        <button>Delete</button>
      </div>
      <input type="checkbox" id="checkbox">
      <label for="check">Packed</label>
    </article>
  `);
  $('form')[0].reset();
}

const renderItems = marsItems => {
  marsItems.forEach( marsItem => {
    let { itemName, packed, id} = marsItem;
    $('.item-container').prepend(`
    <article id="item${id}">
      <div class="top-of-card">
        <h2>${itemName}</h2>
        <button class='delete' id=${id}>Delete</button>
      </div>
      <input 
        type="checkbox"
        class="checkbox"
        id="checkbox${id}"
        ${packed ? 'checked' : ''}
      >
      <label for="checkbox${id}">Packed</label>
    </article>
  `)
  })
}

const getItemList = async () => {
  const initialFetch = await fetch('/api/v1/marsItems')
  const marsItems = await initialFetch.json();
  renderItems(marsItems);
}

const deleteItem = async event => {
  const { id } = event.target;
  const initialFetch = await fetch(`/api/v1/marsItems/${id}`, {
    method: 'DELETE'
  })
  $(`#item${id}`).remove() 
}

const togglePacked = async event => {
  const { checked, id } = event.target;
  const target = id.substr(8)
  console.log(target)
  const initialFetch = await fetch(`/api/v1/marsItems/${target}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ packed: checked })
  })
}


$('.item-container').on('click', 'button', deleteItem)
$('.item-container').on('change', '.checkbox', togglePacked)
$('.submit').on('click', addItem)
$('document').ready(getItemList)