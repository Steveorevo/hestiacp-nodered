module.exports = {
    apps: [{
        name: (function() {
            /**
             * Name the app based on the domain name from the current directory path.
             */
            let domain = __dirname.split('/')[4];
            return 'nodered-' + domain;
        })(),
        script: (function() {
            /**
             * Specify the Node-RED version to run.
             * 
             * TODO: Read the settings.js file and find a suitable Node-RED version specified from it,
             * or default to the latest Node-RED version.
             */
            return "/opt/node-red/v3.0.2/node-red/red.js";
        })(),
        interpreter: (function() {
            /**
             * Specify the node interpreter to use.
             * 
             * Read the .nvmrc file and find a suitable node version specified from it,
             * or default to the latest node version.
             */

            let file = __dirname + '/.nvmrc';
            let ver = 'current';
            const fs = require('fs');
            if (fs.existsSync(file)) {
                ver = fs.readFileSync(file, {encoding:'utf8', flag:'r'}).trim();
            }
            const { execSync } = require('child_process');
            ver = execSync('/bin/bash -c "source /opt/nvm/nvm.sh && nvm which ' + ver + '"').toString().trim();
            if (!fs.existsSync(ver)) {
                console.error(ver);
                process.exit(1);
            }else{
                return ver;
            }
        })(),       
        args: (function() {
            /**
             * Pass the allocated port number and current folder as userDir to Node-RED.
             * 
             * The port number is read from a file in /opt/hcpp/ports/%username%/%domain%.ports,
             * we know the username and domain name from the current directory path.
             */

            let file = __dirname;
            file = file.replace('/home/', '/opt/hcpp/ports/').replace('/web/', '/').replace('/nodeapp', '.ports');
            const fs = require('fs');
            let port = fs.readFileSync(file, {encoding:'utf8', flag:'r'});
            port = parseInt(port.trim().split(' ').pop());
            return "-p " + port + " -u " + __dirname;
        })(),
        watch: [".restart"],
        ignore_watch: [],
        watch_delay: 5000,
        restart_delay: 5000
    }]
}
