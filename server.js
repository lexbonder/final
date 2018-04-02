const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars Packer';

app.use(express.static('public'));

app.get('/api/v1/marsItems', (request, response) => {
  database('marsItems').select()
    .then(items => {
      response.status(200).json(items)
    })
    .catch(error => {
      response.status(500).send({ error })
    })
})

app.post('/api/v1/marsItems', (request, response) => {
  const { itemName } = request.body;
  if (!itemName) {
    return response.status(422).send({error: 'You need to include an item name'})
  }

  database('marsItems').where('itemName', itemName).select()
    .then(result => {
      if(result.length) {
        return response.status(400).send({error: 'That is alreay on the list'})
      } else {
        database('marsItems').insert({ itemName, packed: false }, 'id')
          .then(id => {
            response.status(201).json(id)
          })
          .catch(error => {
            response.status(500).send({ error })
          })
      }
    })
    .catch(error => {
      response.status(500).send({ error })
    })
})

app.delete('/api/v1/marsItems/:id', (request, response) => {
  const { id } = request.params;
  database('marsItems').where('id', id).del()
    .then( rows => {
      if (rows) {
        response.status(200).json(`${rows} items deleted successfully`)
      } else {
        response.status(404).json('You cannot delete what does not exist')
      }
    })
    .catch( error => {
      response.status(500).send({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});