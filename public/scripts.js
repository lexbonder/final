
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
    let { itemName, packed } = marsItem;
    let prePacked = packed ? 'checked' : ''
    $('.item-container').prepend(`
    <article>
      <div class="top-of-card">
        <h2>${itemName}</h2>
        <button>Delete</button>
      </div>
      <input type="checkbox" id="checkbox" ${prePacked}>
      <label for="check">Packed</label>
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

$('.submit').on('click', addItem)
$('document').ready(getItemList)