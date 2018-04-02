
const addItem = event => {
  event.preventDefault()
  const $itemName = $('.input').val()
  $('.item-container').prepend(`
    <article>
      <div class="top-of-card">
        <h2>${$itemName}</h2>
        <button>Delete</button>
      </div>
      <input type="checkbox" id="checkbox">
      <label for="check">Packed</label>
    </article>
  `)
  $('.input').reset()
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
        id="checkbox${id}"
        ${packed ? 'checked' : ''}
      >
      <label for="checkbox${id}">Packed</label>
    </article>
  `)
  })
}

const getItemList = async () => {
  console.log('yo')
  const initialFetch = await fetch('http://localhost:3000/api/v1/marsItems')
  const marsItems = await initialFetch.json();
  renderItems(marsItems);
}

const deleteItem = async event => {
  const { id } = event.target;
  const initialFetch = await fetch(`http://localhost:3000/api/v1/marsItems/${id}`, {
    method: 'DELETE'
  })
  $(`#item${id}`).remove() 
}

$('.item-container').on('click', 'button', deleteItem)
$('.submit').on('click', addItem)
$('document').ready(getItemList)