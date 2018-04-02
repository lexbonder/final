
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

$('.submit').on('click', addItem)