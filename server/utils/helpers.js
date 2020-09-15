function checkLogedUsersByEmail(database, obj) {
  database.find((user) => user.email === obj.email);
}

function getUserIndexByEmail(database, email) {
  return database.map((e) => e.email).indexOf(email);
}
module.exports.checkLogedUsersByEmail = checkLogedUsersByEmail;
module.exports.getUserIndexByEmail = getUserIndexByEmail;
