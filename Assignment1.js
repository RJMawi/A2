var express = require('express');
var application = express();
var fs = require("fs");
var bParser = require("body-parser");
var users = require("./users.json");
//var userdata = JSON.parse(data).users;
application.use(bParser.json());

function getUserName (user) {
	//console.log(user["username"])
	return user["username"];
}
//RETURN ALL USERS
application.get('/user', function (req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		var users = JSON.parse(data).users;	
		var names = users.map(getUserName);
		JSON.stringify(names);
		console.log( names );
		res.end(JSON.stringify(names));
	})
});
//RETURN SPECIFIC USER
application.get('/user/:userID', function (req, res) {
	let userID = req.params.userID;
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		var users = JSON.parse(data).users;	
		const user = users.find(u => u.id == userID);
		console.log(user);
		res.end(JSON.stringify(user));
	})
});
//CREATE NEW USER
application.post('/user', function (req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		var userdata = JSON.parse(data);
		let newID = userdata.users.length + 1;
		let newUserID = {"id":newID};
		let postData = req.body;
		let newUser = {
			...newUserID,
			...postData
		}
		userdata.users.push(newUser);
		fs.writeFile("./users.json", JSON.stringify(userdata), function(err) {});
		//res.json(newUser);
		res.json(newID);
	})
});
//CHANGE A USER'S ELEMENTS
application.put('/user/:userID', function(req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		let userID = req.params.userID;
		var userdata = JSON.parse(data);
		//let newData = req.body;
		const user = userdata.users.find(u => u.id == userID);
		var index = userdata.users.indexOf(user);	//get index to change
		if (index === -1) {
			res.end("User does not exist");
		} else {
			userdata.users[index] = {
				...user,
				...req.body
			};
			fs.writeFile("./users.json", JSON.stringify(userdata), function (err) {});
			console.log("user id: " + userID + " updated");
		}
		res.end();
	})
});
//DELETE A USER
application.delete('/user/:userID', function (req, res) {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
	//assign variables
		let userID = req.params.userID;
	//create userdata
		var userdata = JSON.parse(data);
	//find user index to delete
		const user = userdata.users.find(u => u.id == userID);
		var index = userdata.users.indexOf(user);
	//if index does not exist
		if (index === -1) {	
				res.end("User does not exist");
		} else {
	//delete entry
			userdata.users.splice(index, 1);
	//write file and terminate
			fs.writeFile("./users.json", JSON.stringify(userdata), function (err) {});
			console.log("user id: " + userID + " deleted");
		}
		res.end();
	});
})



var server = application.listen(5000, function() {
	var host = server.address().address
	var port  = server.address().port
	console.log("Example application listening at http://%s:%s", host, port)
});