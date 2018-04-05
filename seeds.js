const Profile = require('./models/profile');
const faker = require('faker');
const debug = require('debug')('app');

const Profiles = [];

for (let i = 0; i < 20; i += 1) {
  const Person = {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    street: faker.address.streetName(),
    city: faker.address.city(),
    postalcode: faker.address.zipCode(),
    country: faker.address.country(),
    countrycode: faker.address.countryCode(),
    registered: faker.date.past(),
    gender: Math.random() < 0.5 ? 'Female' : 'Male',
    age: Math.floor((Math.random() * 50) + 1),
    born: faker.date.past(),
    profileImage: `${i}.jpg`,
    description: faker.company.catchPhraseDescriptor(),
  };
  Profiles.push(Person);
}

function SeedDB() {
  Profile.remove({}, (error) => {
    if (error) {
      debug(error);
    }
    debug('Removed Profiles');
    Profiles.forEach((seed) => {
      Profile.create(seed, (error) => {
        if (error) {
          debug(error);
        }
      });
    });
  });
}

module.exports = SeedDB;
