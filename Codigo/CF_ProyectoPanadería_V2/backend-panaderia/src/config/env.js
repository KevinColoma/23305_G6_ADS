require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.error('❌ SECRET_KEY no definida');
  process.exit(1);
}
const PORT = process.env.PORT || 4000;
module.exports = { SECRET_KEY, PORT };
