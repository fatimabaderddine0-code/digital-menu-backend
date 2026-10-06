const bcrypt = require("bcryptjs");

const password = "#f@tbd";

const hashedPassword = bcrypt.hashSync(password, 10);

console.log(hashedPassword);
