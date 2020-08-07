module.exports = function(RED) {

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

    function SynPlatCreds(n) {
        RED.nodes.createNode(this,n);
        this.ip = n.ip,
        this.username = n.username;
        this.password = n.password;
        this.user_id = n.user_id;
        this.access_token = n.access_token;
        this.service_id = n.service_id;
        this.deploy_new = n.deploy_new;
        this.topics = n.topics;
        this.description = n.description;
        this.location = n.location;
        this.new_s_name = n.new_s_name;
        this.service_ontology = n.service_ontology;
        this.service_type = n.service_type;
        this.docker_image_built = n.docker_image_built;
        this.docker_container_running = n.docker_container_running;
        this.state = "n/a";
        this.ac = this.access_token;

        this.on('input', (msg) => {
            //console.log(this.user_id, this.access_token, this.service_id);
            const context = this.context();
            // TODO request statuses and update values
            var mydata = "username="+this.username+"&password="+this.password;
            // sevangelou - change url to https
            var url2 = "https://" + this.ip + "/users/"+this.user_id+"/services/"+this.service_id;
            //console.log(url2);
            var g = context.global.get('myrequest');
            const options = {
                url: url2,
                method: 'GET',
                mode: 'cors',
                strictSSL: false, // allow us to use our self-signed cert for testing
                rejectUnauthorized: false,
                headers: {
                    //'Accept': 'application/json',
                    //'Accept-Charset': 'utf-8',
                    'User-Agent': 'nodered-synaisthisi-node',
                    'Authorization': 'Bearer ' + this.ac
                }
                //body: mydata,
            };
            // console.log("Access token inside: " + this.ac);
            // console.log("Service id inside: " + this.service_id);
            g(options, (err, res, body) => {
                // console.log(err);
                // console.log(res);
                try{
                    // console.log('BODY_LOG: ', body);
                    let json = JSON.parse(body);this.state = json['service_is_running'];
                }
                catch(e){
                    return console.log(e);
                }
                //console.log("Global State:" + this.state);
                //msg.payload += " AT: " + this.ac;
                msg.payload += "=> |{ " + this.service_id;
                msg.payload += ", " + this.state+" }|";
                this.send(msg);
                
            });
            // g.get('http://localhost/services')
            //     .on('response', function(response) {
            //         console.log(response.statusCode) // 200
            //         console.log(response.headers['content-type']) // 'image/png'
            //         //console.log(response)      
            //         response.setEncoding('utf8');      
            //         response.on('data', function(chunk){console.log(chunk);body = chunk})
            //     })
                
            
            //msg.payload += token;
            
            

        });
    }
    RED.nodes.registerType("synaisthisi-service",SynPlatCreds);
}
