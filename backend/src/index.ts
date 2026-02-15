let express = require("express");
let app = express();
app.use(express.json());

if (require.main === module) {
  app.listen(5000, function () {
    console.log(
      `Express App running at http://127.0.0.1:5000}/`
    );
  });
}

module.exports = app;