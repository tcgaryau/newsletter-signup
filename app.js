const express = require("express");
const app = express();
const https = require("https");
const mailChimpAPI = "c36b29d78b7e680ec81422b989d9fe9a-us20";
const listID = "032f0f52f5";


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us20.api.mailchimp.com/3.0/lists/${listID}`;

  const options = {
    method: "POST",
    auth: `binopeda:${mailChimpAPI}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

const port = 8000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// API Key
// c36b29d78b7e680ec81422b989d9fe9a-us20

//List ID
//032f0f52f5
