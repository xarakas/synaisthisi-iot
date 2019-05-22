/**
 * Ponte configuration file for interfacing with SYNAISTHISI AuthN/Z
 */
var request = require('request')
var bunyan = require('bunyan')
var log = new bunyan({name: 'ponteConfigLog', streams: [
    {
      stream: process.stdout
    },
    {
      path: '/var/log/ponteConfigLog.log'
    }
  ]/*, ... */});


module.exports = {
  logger: {
    level: 30,
    name: "Config Logger"
  },

  broker: {
    // same as https://github.com/mcollina/ascoltatori#mqtt
    type: "mqtt",
    port: "1885",
    host: "localhost"
  },

  coap: {
    /**
     * @param {Object} req The incoming message @link https://github.com/mcollina/node-coap#incoming
     * @param {Function} callback The callback function. Has the following structure: callback(error, authenticated, subject)
     */
    authenticate: function(req, callback) {
      // Examples:
      //   Error:             callback(error);
      //   Authenticated:     callback(null, true, { username: 'someone' });
      //   Not authenticated: callback(null, false);
      mydata = req.options[2].value
      mydatap = req.options[3].value
      if (!mydata){username = ''}
      else {username = mydata}
      if (!mydatap){password = ''}
      else {password = mydatap}
      log.info("Authenticate CoAP called -- URL: " + req.url + " User: "+username+ " Password: "+password )
      
      var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/auth',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'password': password}
        }

        // Start the request
        request(options, function (error, response, body) {
          if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {            
                callback(null, true, { username: username } );
            }
            else if (error) {
                callback(error);
            }
            else 
            {
                callback(null, false);
            }
          }
        });
    },
    /**
     * @param {Object} subject The subject returned by the authenticate function
     * @param {string} topic The topic
     * @param {Function} callback The callback function. Has the following structure: callback(error, authorized)
     */
    authorizeGet: function(subject, topic, callback) {
      // Examples:
      //   Error:          callback(error);
      //   Authorized:     callback(null, true);
      //   Not authorized: callback(null, false);
      if (!subject.username){username = ''}
      else {username = subject.username}
     
      log.info("Authorize GET CoAP called -- Topic: " + topic + " User: "+username )
      var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/acl',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'topic': topic, 'acc': 1}
        }
        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true);
            }
            else if (error) {
                  callback(error);
            }
            else 
            {
                 callback(null, false);
            }
          }
        });
    },
    /**
     * @param {Object} subject The subject returned by the authenticate function
     * @param {string} topic The topic
     * @param {Buffer} payload The payload
     * @param {Function} callback The callback function. Has the following structure: callback(error, authorized)
     */
    authorizePut: function(subject, topic, payload, callback) {
      // Examples:
      //   Error:          callback(error);
      //   Authorized:     callback(null, true);
      //   Not authorized: callback(null, false);

      if (!subject.username){username = ''}
      else {username = subject.username}
      
      log.info("Authorize PUT CoAP called -- Topic: " + topic + " User: "+username)
      var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/acl',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'topic': topic, 'acc': 2}
        }

        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true);
            }
            else if (error) {
               callback(error);
            }
            else 
            {
                 callback(null, false);
            }
          }
        });
    }
  },
  http: {
    /**
     * @param {Object} req The request object
     * @param {Function} callback The callback function. Has the following structure: callback(error, authenticated, subject)
     */
    authenticate: function(req, callback) {
      // See coap.authenticate

      if (!req.headers.username){username = ''}
      else {username = req.headers.username}
      if (!req.headers.password){password = ''}
      else {password = req.headers.password}
      log.info("Authenticate HTTP called -- URL: " + req.url + " User: "+username+ " Password: "+password )

      var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/auth',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'password': password}
        }

        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true, { username: username } );
            }
            else if (error) {
                 callback(error);
            }
            else 
            {
                 callback(null, false);
            }
          }
        });
    },
    /**
     * @param {Object} subject The subject returned by the authenticate function
     * @param {string} topic The topic
     * @param {Function} callback The callback function. Has the following structure: callback(error, authorized)
     */
    authorizeGet: function(subject, topic, callback) {
      // See coap.authorizeGet
      if (!subject.username){username = ''}
      else {username = subject.username}

      log.info("Authorize GET HTTP called -- Topic: " + topic + " User: "+username )
      var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/acl',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'topic': topic, 'acc': 1}
        }
        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true);
            }
            else if (error) {
                 callback(error);
            }
            else 
            {
                 callback(null, false);
            }
          }
        });
    },
    /**
     * @param {Object} subject The subject returned by the authenticate function
     * @param {string} topic The topic
     * @param {string} payload The payload
     * @param {Function} callback The callback function. Has the following structure: callback(error, authorized)
     */
    authorizePut: function(subject, topic, payload, callback) {
      // See coap.authorizePut
      if (!subject.username){username = ''}
      else {username = subject.username}
      log.info("Authorize PUT HTTP called -- Topic: " + topic + " User: "+username )
      var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/acl',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'topic': topic, 'acc': 2}
        }

        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true);
            }
            else if (error) {
                callback(error);
            }
            else 
            {
                callback(null, false);
            }
          }
        });
    }
  },
  mqtt: {
    /**
     * @link https://github.com/mcollina/mosca/wiki/Authentication-&-Authorization
     */
    authenticate: function(client, username, password, callback) {
        // Set the headers
        log.info("Authenticate MQTT called -- User: "+username+ " Password: "+password )
        var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/auth',
            method: 'POST',
            headers: headers,
            form: {'username': username, 'password': password}
        }

        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true, { username: username } );
                client.user = username;
            }
            else if (error) {
                callback(error);
            }
            else 
            {
                callback(null, false);
            }
          }
        });
    },
    authorizePublish: function(client, topic, payload, callback) {
        // Set the headers
        log.info("Authorize PUB MQTT called -- Topic: " + topic + " User: "+client.user )
        var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/acl',
            method: 'POST',
            headers: headers,
            form: {'username': client.user, 'topic': topic, 'acc': 2}
        }

        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true);
            }
            else if (error) {
                callback(error);
            }
            else 
            {
                callback(null, false);
            }
          }
        });
    },
    authorizeSubscribe: function(client, topic, callback) {
        log.info("Authorize SUB MQTT called -- Topic: " + topic + " User: "+client.user )
        var headers = {
            'User-Agent':       'PonteBroker/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: 'http://localhost:80/mqtt/acl',
            method: 'POST',
            headers: headers,
            form: {'username': client.user, 'topic': topic, 'acc': 1}
        }
        // Start the request
        request(options, function (error, response, body) {
           if(typeof(response) != "undefined"){
            log.info("Portal response status code: " + response.statusCode)
            if (!error && response.statusCode == 200) {
                callback(null, true);
            }
            else if (error) {
                callback(error);
            }
            else 
            {
                callback(null, false);
            }
          }
        });
    }
  }
}