const jwt = require("jsonwebtoken");

//helper.js
function verifyRefresh(email, token) {
  try {
    const decoded = jwt.verify(token, "refresh_secret");
    return decoded.email === email;
  } catch (error) {
    return false;
  }
}
module.exports = { verifyRefresh };
