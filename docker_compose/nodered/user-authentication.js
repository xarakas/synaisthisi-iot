var request = require('request')
var RABBITMQ = process.env.RABBITMQ
var FLASK_APP = process.env.FLASK_APP
var FLASK_PORT = process.env.FLASK_PORT

module.exports = {
   type: "credentials",
   users: function(username) {
       
      // valid = true
       return new Promise(function(resolve) {
           // Do whatever work is needed to check username is a valid
           // user.
           // console.log(resolve)
           // if (valid) {
            // console.log("valid")
               // Resolve with the user object. It must contain
               // properties 'username' and 'permissions'
               var user = { username: username, permissions: "*" };
               resolve(user);
           // } else {
               // Resolve with null to indicate this user does not exist
               // console.log("invalid")
               // resolve(null);
           // }
       });
   },
   authenticate: function(username,password) {
       return new Promise(function(resolve) {
           // Do whatever work is needed to validate the username/password
           // combination.
           valid = false;
           mydata = username;
           mydatap = password;
           if (!mydata){username1 = ''}
           else {username1 = mydata}
           if (!mydatap){password1 = ''}
           else {password1 = mydatap}
           var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/json'
           }
           
           // Configure the request 
           //rejectUnauthorized, requestCert, agent added by sevangelou
           var options = {
            url: `https://${FLASK_APP}/mqtt/auth`,
            method: 'POST',
            headers: headers,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,
            form: {'username': username1, 'password': password1}
           }

           // console.log("URL " + options.url)
            // Start the request
            request(options, function (error, response, body) {
              console.log(response);
              if(typeof(response) != "undefined"){
                console.log("Portal response status code4: " + response.statusCode)
                if (!error && response.statusCode == 200) {            
                    var user = { username: username1, permissions: "*" };
                    resolve(user);
                }
                else {resolve(null);}
                }
              
            });
          });
     },


   default: function() {
       return new Promise(function(resolve) {
        // console.log("default invalid")
           // Resolve with the user object for the default user.
           // If no default user exists, resolve with null.
           resolve(null);
       });
   }
}