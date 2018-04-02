
exports.seed = function(knex, Promise) {
  return knex('marsItems').del()
    .then(function () {
      return knex('marsItems').insert([
        {itemName: 'socks', packed: false},
        {itemName: 'shoes', packed: true},
        {itemName: 'underwear', packed: false}
      ])
      .then(() => {
        console.log('Seeding Complete')
      })
      .catch(error => {
        console.log(`Error seeding data: ${error.message}`)
      });
    })
    .catch(error => {
      console.log(`Error seeding data: ${error.message}`)
    });
};
