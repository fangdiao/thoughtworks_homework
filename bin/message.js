

const message = (type) => {
  const messageMap = {
    'notExist': 'Error: the booking being cancelled does not exist!',
    'success': 'Success: the booking is accepted!',
    'exist': 'Error: the booking conflicts with existing bookings',
    'invalid': 'Error: the booking is invalid!'
  }
  return console.log(messageMap[type]);
}

module.exports = message;
