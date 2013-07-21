var mongoDB = require('./mongoDB.js')
var fs = require('fs');

function importFromDirectory(dir){
var output = 'var sixtusGeodata = [';
walk(dir, function(file, stat){
    output += JSON.stringify(readDataFromFile(file));
    output += ',';
    //console.log(readDataFromFile(file)+',');
	//mongoDB.insertWaypoint(readDataFromFile(file));
}, function(){
    output = output.substring(0,output.length - 1);
    output += '];';
    console.log(output);
});
}



function readDataFromFile(filename){
	var parsedJSON = require(filename);
	return parsedJSON;
}

/**
 * dir: path to the directory to explore
 * action(file, stat): called on each file or until an error occurs. file: path to the file. stat: stat of the file (retrived by fs.stat)
 * done(err): called one time when the process is complete. err is undifined is everything was ok. the error that stopped the process otherwise
 * @author: Samuel Rossille (http://stackoverflow.com/questions/7041638/walking-a-directory-with-node-js)
 */
var walk = function(dir, action, done) {

    // this flag will indicate if an error occured (in this case we don't want to go on walking the tree)
    var dead = false;

    // this flag will store the number of pending async operations
    var pending = 0;

    var fail = function(err) {
        if(!dead) {
            dead = true;
            done(err);
        }
    };

    var checkSuccess = function() {
        if(!dead && pending == 0) {
            done();
        }
    };

    var performAction = function(file, stat) {
        if(!dead) {
            try {
                action(file, stat);
            }
            catch(error) {
                fail(error);
            }
        }
    };

    // this function will recursively explore one directory in the context defined by the variables above
    var dive = function(dir) {
        pending++; // async operation starting after this line
        fs.readdir(dir, function(err, list) {
            if(!dead) { // if we are already dead, we don't do anything
                if (err) {
                    fail(err); // if an error occured, let's fail
                }
                else { // iterate over the files
                    list.forEach(function(file) {
                        if(!dead) { // if we are already dead, we don't do anything
                            var path = dir + "/" + file;
                            pending++; // async operation starting after this line
                            fs.stat(path, function(err, stat) {
                                if(!dead) { // if we are already dead, we don't do anything
                                    if (err) {
                                        fail(err); // if an error occured, let's fail
                                    }
                                    else {
                                        if (stat && stat.isDirectory()) {
                                            dive(path); // it's a directory, let's explore recursively
                                        }
                                        else {
                                            performAction(path, stat); // it's not a directory, just perform the action
                                        }
                                        pending--; checkSuccess(); // async operation complete
                                    }
                                }
                            });
                        }
                    });
                    pending--; checkSuccess(); // async operation complete
                }
            }
        });
    };

    // start exploration
    dive(dir);
};

//Start:
importFromDirectory("./import");