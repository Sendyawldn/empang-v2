const bcrypt = require('bcrypt');
const hash = "$2y$12$9.Mr5RkVBeFqWhjGRdykIusZ.TmBiwfHhJ3HleqzySEebWbBJ/VA2";
bcrypt.compare("password", hash).then(res => console.log("Result: ", res));
