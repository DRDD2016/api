export const newEvent = {
  name: 'Birthday party',
  description: 'I am getting older!',
  note: 'Not sure about some stuff. Watch this space!',
  _what: ['Bowling', 'Drinking', 'Dancing'],
  _where: ['Old Street', 'Shoreditch'],
  _when: ['2016-12-12T11:32:19.349Z', '2017-12-12T00:00:00.000Z'],
  is_poll: true,
  host_user_id: 1,
  event_id: 1,
  code: 'FAKECODE4'
};

export const event_1 = {
  name: 'Lounge party',
  description: 'Celebrating life',
  note: '',
  what: ['Dancing', 'Skydiving'],
  where: ['Forest', 'Camping'],
  when: ['2017-01-03T00:00:00.000Z', '2017-02-14T00:00:00.000Z'],
  is_poll: true,
  host_user_id: 1,
  event_id: 1,
  code: 'FAKECODE'
};

export const event_2 = {
  name: 'Beach party',
  description: 'Celebrating summer',
  note: '',
  what: ['Swimming', 'Sunbathing'],
  where: ['Mallorca', 'Barbados'],
  when: ['2017-01-03T00:00:00.000Z'],
  is_poll: true,
  host_user_id: 1,
  event_id: 2,
  code: 'FAKECODE2'
};

export const event_3 = {
  name: 'Beach party',
  description: 'Celebrating summer',
  note: '',
  what: ['Swimming'],
  where: ['Mallorca'],
  when: ["2017-01-03T00:00:00.000Z"],
  is_poll: false,
  host_user_id: 3,
  event_id: 3,
  code: 'FAKECODE3'
};

export const newUser = {
  firstname: 'Homer',
  surname: 'Simpson',
  email: 'homer@spark.com',
  password: 'fake'
};

export const existingUser = {
  user_id: '2',
  firstname: 'Dave',
  surname: 'Jones',
  email: 'dave@spark.com',
  password: 'spark'
};

export const vote = {
  what: [0, 1],
  where: [1, 1]
};

export const hostEventChoices = {
  what: ['Dodgeball'],
  where: ['Hoxton'],
  when: ['2017-04-03T00:00:00.000Z']
};

export const rsvps_1 = {
  not_responded: [
    { firstname: 'Dave', photo_url: 'http://placehold.it/100x100', surname: 'Jones' },
    { firstname: 'Sohil', photo_url: 'http://placehold.it/100x100', surname: 'Pandya' }
  ]
};

// no invitees exist for event 2

export const rsvps_3 = {
  going: [
    {
      firstname: 'Dave',
      surname: 'Jones',
      photo_url: 'http://placehold.it/100x100'
    },
    {
      firstname: 'Mickey',
      surname: 'Mouse',
      photo_url: 'http://placehold.it/100x100'
    }
  ],
  not_going: [{
    firstname: 'Sohil',
    surname: 'Pandya',
    photo_url: 'http://placehold.it/100x100'
  }]
};

export const editedEvent = {
  name: 'Dinner Party',
  description: 'Celebrating life',
  note: 'Don\'t forget it is byob',
  what: ['Dinner'],
  where: ['Greedy Cow'],
  when: ['2017-05-03T00:00:00.000Z'],
  event_id: 3,
  edited: true
};

export const feedItem = {
  timestamp: '2017-02-09T12:24:49.699Z',
  event_id: 3,
  firstname: 'Sohil',
  surname: 'Pandya',
  photo_url: 'http://placehold.it/100x100',
  name: 'Beach party',
  what: ['Swimming'],
  where: ['Mallorca'],
  when: ["2017-01-03T00:00:00.000Z"],
  is_poll: false,
  host_user_id: 3,
  viewed: false
};

export const inviteesIds = [ 2, 3, 4];
