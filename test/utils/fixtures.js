export const avatarUrl = 'https://s3.eu-west-2.amazonaws.com/spark-native/avatar.png';
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
  code: 'FAKECODE100'
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

export const event_4 = {
  name: 'Spring party',
  description: 'Celebrating spring',
  note: '',
  what: ['Picnic'],
  where: ['Victoria Park'],
  when: ["2017-04-03T00:00:00.000Z"],
  is_poll: false,
  host_user_id: 1,
  event_id: 4,
  code: 'FAKECODE4'
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
  going: [],
  maybe: [],
  not_going: [],
  not_responded: [
    { firstname: 'Dave', photo_url: avatarUrl, surname: 'Jones' },
    { firstname: 'Sohil', photo_url: avatarUrl, surname: 'Pandya' }
  ]
};

// no invitees exist for event 2
export const emptyRsvps = {
  going: [],
  maybe: [],
  not_going: [],
  not_responded: []
};


export const rsvps_3 = {
  going: [
    {
      firstname: 'Sohil',
      surname: 'Pandya',
      photo_url: avatarUrl
    },
    {
      firstname: 'Mickey',
      surname: 'Mouse',
      photo_url: avatarUrl
    }
  ],
  maybe: [],
  not_going: [{
    firstname: 'Dave',
    surname: 'Jones',
    photo_url: avatarUrl
  }],
  not_responded: []
};

export const rsvps_4 = {
  going: [],
  maybe: [],
  not_going: [],
  not_responded: [
    {
      firstname: 'Dave',
      surname: 'Jones',
      photo_url: avatarUrl
    },
    {
      firstname: 'Sohil',
      surname: 'Pandya',
      photo_url: avatarUrl
    }
  ]
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
  photo_url: avatarUrl,
  name: 'Beach party',
  what: ['Swimming'],
  where: ['Mallorca'],
  when: ["2017-01-03T00:00:00.000Z"],
  is_poll: false,
  host_user_id: 3,
  viewed: false
};

export const inviteesIds = [ 2, 3, 4];

export const userData = {
  firstname: 'Mona',
  surname: 'Lisa'
};

export const updatedRsvp = {
  going: [{ firstname: 'Sohil', surname: 'Pandya', photo_url: avatarUrl }],
  maybe: rsvps_4.maybe,
  not_going: rsvps_4.not_going,
  not_responded: [rsvps_4.not_responded[0]]
};

export const updatedRsvp_2 = {
  going: rsvps_4.going,
  maybe: rsvps_4.maybe,
  not_going: [{ firstname: 'Sohil', surname: 'Pandya', photo_url: avatarUrl }],
  not_responded: [rsvps_4.not_responded[0]]
};

export const existingUserWithToken = {
  reset_password_token: 'someuniquestring1',
  user_id: 1
};

export const feedItems = [{
  event_id: 3,
  timestamp: '2017-02-19T21:20:26.481Z',
  firstname: 'Bob',
  surname: 'Dylan',
  photo_url: 'https://s3.eu-west-2.amazonaws.com/spark-native/avatar.png',
  what: ['Go to France'],
  where: ['France'],
  when: ['2017-03-19T12:00:00.000Z'],
  is_poll: false,
  host_user_id: '2',
  subject_user_id: '2',
  viewed: true,
  name: 'Day trip to France'
}];
