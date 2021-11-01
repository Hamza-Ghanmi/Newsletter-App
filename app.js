const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: "11ea2170f8f8bb0e59080e01ee0084ee",
  server: "us5",
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  

const listId = "c7ba0bb5aa";
const subscriberHash = md5(email.toLowerCase());

const subscription = async () => {
  const addMember = await client.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
    }
  });
  
}

async function subscriptionStatus() {
  try {
    const response = await client.lists.getListMember(
      listId,
      subscriberHash
    );
    res.sendFile(__dirname + "/failure.html");
  } catch (e) {
    if (e.status === 404) {
      subscription();
      res.sendFile(__dirname + "/success.html");
    } 
  }
}
subscriptionStatus();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
//11ea2170f8f8bb0e59080e01ee0084ee-us5
//c7ba0bb5aa