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

})