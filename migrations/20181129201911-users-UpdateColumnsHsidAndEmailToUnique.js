module.exports = {
  up: queryInterface => Promise.all([
    queryInterface.addConstraint(
      'users',
      ['email'], {
        type: 'unique',
        name: 'unique_email',
      },
    ),
    queryInterface.addConstraint(
      'users',
      ['hsid'], {
        type: 'unique',
        name: 'unique_hsid',
      },
    ),
  ]),
  down: queryInterface => Promise.all([
    queryInterface.removeConstraint(
      'users',
      'unique_email',
    ),
    queryInterface.removeConstraint(
      'users',
      'unique_hsid',
    ),
  ]),
};
