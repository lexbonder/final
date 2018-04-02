const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);

beforeEach(done => {
  database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
        .then(() => {
          return database.seed.run()
            .then(() => {
              done();
            })
        })
    }) 
})

describe('Mars Packer', () => {
  describe('GET /api/v1/marsItems', () => {
    it('should return all of the items in the database', () => {
      return chai.request(server)
        .get('/api/v1/marsItems')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.length.should.equal(3);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('itemName');
          response.body[0].itemName.should.equal('socks');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('POST /api/v1/marsItems', () => {
    it('should return a 201 status and the id of the new item', () => {
      return chai.request(server)
        post('/api/v1/marsItems')
        .send({
          itemName: 'food'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
        })
        .catch(error => {
          throw error;
        })
    })

    it('should return a 422 error if the user does not include a name', () => {
      return chai.request(server)
        .post('/api/v1/marsItems')
        .send({
          // itemName
        })
        .then(response => {
          response.should.have.status(422);
          response.body.error.should.equal('You need to include an item name')
        })
        .catch(error => {
          throw error;
        })
    })

    it('should return a 400 error if the item already exists', () => {
      return chai.request(server)
        .post('/api/v1/marsItems')
        .send({
          itemName: 'socks'
        })
        .then(response => {
          response.should.have.status(400);
          response.body.error.should.equal('That is alreay on the list')
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('PATCH /api/v1/marsItems/:id', () => {
    it('should update the packed status of the selected item', () => {
      return chai.request(server)
        .patch('/api/v1/marsItems/1')
        .send({
          packed: true
        })
        .then(response => {
          response.should.have.status(200);
          response.body.should.have.property('success');
          response.body.success.should.equal('Item updated');
        })
        .catch(error => {
          throw error;
        })
    })

    it('should return a 404 if the user targets an item that does not exist', () => {
      return chai.request(server)
        .patch('/api/v1/marsItems/999')
        .send({
          packed: true
        })
        .then(response => {
          response.should.have.status(404);
          response.body.should.have.property('error');
          response.body.error.should.equal('Cannot update what does not exist');
        })
        .catch(error => {
          throw error;
        })
    })

    it('should return a 422 error if the user does not include a new state', () => {
      return chai.request(server)
        .patch('/api/v1/marsItems/1')
        .send({
          // packed
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.have.property('error')
          response.body.error.should.equal('You need to include a new state < packed: true/false > in the body')
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('DELETE /api/v1/marsItems/:id', () => {
    it('should return a 200 messsage if the item is deleted successfully', () => {
      return chai.request(server)
        .delete('/api/v1/marsItems/1')
        .then(response => {
          response.should.have.status(200);
          response.body.should.have.property('success');
          response.body.success.should.equal('1 item(s) deleted successfully');
        })
        .catch(error => {
          throw error;
        })
    })

    it('sould return a 404 error if the targeted item does not exist', () => {
      return chai.request(server)
        .delete('/api/v1/marsItems/999')
        .then(response => {
          response.should.have.status(404);
          response.body.should.have.property('error');
          response.body.error.should.equal('You cannot delete what does not exist')
        })
        .catch(error => {
          throw error;
        })
    })
  })
})