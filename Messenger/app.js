'use strict'

const http = require('http')
const Bot = require('messenger-bot')
const mongoose = require('mongoose');
const request = require('request');

var User = require('./user');
var Config = require('./config');
var Group = require('./groups');
mongoose.connect('mongodb://localhost/DigitalOcean');
var unique = 1;
var groupId = 1;

var options = {
	access_token: "u1r_4oEFjcE5KGZ73tsNe2S9Lrh8eW8Pi9CNJoIWGu77V8mcNs1AnAvl0dh6Qt9pjMZGYOgYEZmGeqleLCPvbFECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP",
	client_id: "VcbiJETBEjY",
	client_secret: "e9501d3e5dce223d3a71d7b44fcd57a0cc5e0305"
};
var up = require('jawbone-up')(options);
		
var bot = new Bot({
  token: 'EAAW2d3RYVCgBANy6FptpxZAYzZAGS94IMfUjUdp9mBqH10PHMSy9wBykPDJql88RE2gu1CekmSPbLkt9lSdqKhbKYKOmjDOSBzrolFz9b0WKkpZC64wZBVcGUSroozvrYlk8kImPPxoYYj69czxpVZB5MpMWxrboYAzmyo8plqAZDZD',
  verify: 'my_voice_is_my_password_verify_me',
  app_secret: '1331890b2a4e2c7d40ed0880dc313792'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
	console.log(payload);
  var data = payload.message.text
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err
	if(data.toLowerCase() == "@config"){
		User.find({userId: payload.sender.id}, function(err, users) {
		  if (err) throw err;
		  // object of all the users
		  if(users.length == 0){
			var text = "Reply with unique id as '@unique <uniqueid>', eg. if unique id is 9 reply'@unique 9' to join else reply '@reply No'";
			reply({ text }, (err) => {
			  if (err) console.log(err);
			  console.log(`Echoed back`)
			})
		  }else{
			reply({ text:"Configuration is done already!!" }, (err) => {
			  if (err) console.log(err);
			  console.log(`Echoed back`)
			})
		  }
		});
		
	}
	if(data.toLowerCase().startsWith("@unique")){
		data = data.replace(" ","");
		var replyData = data.substring(7);
		Config.find({unique:replyData},function(err,data){
			if(err) throw err;
			if(data.length == 0){
				reply({ text:"Unique Id not found" }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
			}else{
				User.find({userId: payload.sender.id}, function(err, users) {
				  if (err) throw err;
				  // object of all the users
				  if(users.length == 0){
					var newUser = new User({userId: payload.sender.id, unique: replyData, firstName: profile.first_name, lastName: profile.last_name});
					newUser.save(function(err) {
					  if (err) throw err;
					  console.log('User saved successfully!' + profile.first_name);
					  text = "Please reply your role:\n1. Child\n2.Parents\n3. Doctor\n4. Medical Shop\neg. For child send '@reply 1'";
						reply({ text }, (err) => {
						  if (err) console.log(err);
						  console.log(`Echoed back`)
						})
					});
				  }
				});
		
				
			}
		});
	}else if(data.startsWith("@unique")){
		data = data.replace(" ","");
		var replyData = data.substring(6);
		
		var configData = {createdBy: payload.sender.id, unique: (unique-1),groupId:groupId,doctor:[],child:[],parent:"",medical:[]};
		
		if(replyData == "1"){
			configData.child.push(payload.sender.id);
			var newConfig = new Config(configData);
			newConfig.save(function(err) {
			  if (err) throw err;
			  console.log('Config saved successfully!');
			});
		}else if(replyData == "2"){
			configData.parent.push(payload.sender.id);
			var newConfig = new Config(configData);
			newConfig.save(function(err) {
			  if (err) throw err;
			  console.log('Config saved successfully!');
			});
		}else if(replyData == "3"){
			configData.doctor = (payload.sender.id);
			var newConfig = new Config(configData);
			newConfig.save(function(err) {
			  if (err) throw err;
			  console.log('Config saved successfully!');
			});
		}else if(replyData == "4"){
			configData.medical.push(payload.sender.id);
			var newConfig = new Config(configData);
			newConfig.save(function(err) {
			  if (err) throw err;
			  console.log('Config saved successfully!');
			});
		}else{
			reply({ text:"Invalid reply" }, (err) => {
			  if (err) console.log(err);
			  console.log(`Echoed back`)
			})
		}
	}
	if(data.toLowerCase().replace(" ","") == "@replyno"){
		User.find({userId: payload.sender.id}, function(err, users) {
		  if (err) throw err;
		  // object of all the users
		  if(users.length == 0){
			var newUser = new User({userId: payload.sender.id, unique: unique, firstName: profile.first_name, lastName: profile.last_name});
			newUser.save(function(err) {
			  if (err) throw err;
			  console.log('User saved successfully!' + profile.first_name);
			  unique++;
			  
			});
		  }
		});
		var text = "Your Unique Id is: " + (unique);
		reply({ text }, (err) => {
		  if (err) console.log(err);
		  console.log(`Echoed back`)
		})
		text = "Please reply your role:\n1. Child\n2.Parents\n3. Doctor\n4. Medical Shop\neg. For child send '@reply 1'";
		reply({ text }, (err) => {
		  if (err) console.log(err);
		  console.log(`Echoed back`)
		})
	}
	else if(data.startsWith("@reply")){
		data = data.replace(" ","");
		var replyData = data.substring(6);
		User.find({userId:payload.sender.id}, function(err,users){
			if(err) throw err;
			var uniqueId;
			if(users.lenght != 0){
				uniqueId = users[0].unique;
				Config.find({unique:uniqueId}, function(err,config){
					if(err) throw err;
					console.log(replyData);
					if(config.length != 0){
						if(replyData == "1"){
							config[0].child.push(payload.sender.id);
							config[0].save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							  Config.find({unique:uniqueId},function(err,datas){
								if(err) console.log(err);
								if(datas[0].child.length != 0 && datas[0].doctor.length != 0 && datas[0].medical.length != 0 && datas[0].parent.length != 0){
									var newGroup = new Group({groupId: groupId, child: datas[0].child, doctor: datas[0].doctor, medical: datas[0].medical, parent: datas[0].parent});
									newGroup.save(function(err) {
									  if (err) console.log(err);
									  console.log('Group saved successfully!');
									});
								}
							})
							});
						}else if(replyData == "2"){
							config[0].parent = (payload.sender.id);
							config[0].save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							  Config.find({unique:uniqueId},function(err,datas){
								if(err) console.log(err);
								if(datas[0].child.length != 0 && datas[0].doctor.length != 0 && datas[0].medical.length != 0 && datas[0].parent.length != 0){
									var newGroup = new Group({groupId: groupId, child: datas[0].child, doctor: datas[0].doctor, medical: datas[0].medical, parent: datas[0].parent});
									newGroup.save(function(err) {
									  if (err) console.log(err);
									  console.log('Group saved successfully!');
									});
								}
							})
							});
						}else if(replyData == "3"){
							config[0].doctor.push(payload.sender.id);
							config[0].save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							  Config.find({unique:uniqueId},function(err,datas){
								if(err) console.log(err);
								if(datas[0].child.length != 0 && datas[0].doctor.length != 0 && datas[0].medical.length != 0 && datas[0].parent.length != 0){
									var newGroup = new Group({groupId: groupId, child: datas[0].child, doctor: datas[0].doctor, medical: datas[0].medical, parent: datas[0].parent});
									newGroup.save(function(err) {
									  if (err) console.log(err);
									  console.log('Group saved successfully!');
									});
								}
							})
							});
						}else if(replyData == "4"){
							config[0].medical.push(payload.sender.id);
							config[0].save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							  Config.find({unique:uniqueId},function(err,datas){
								if(err) console.log(err);
								if(datas[0].child.length != 0 && datas[0].doctor.length != 0 && datas[0].medical.length != 0 && datas[0].parent.length != 0){
									var newGroup = new Group({groupId: groupId, child: datas[0].child, doctor: datas[0].doctor, medical: datas[0].medical, parent: datas[0].parent});
									newGroup.save(function(err) {
									  if (err) console.log(err);
									  console.log('Group saved successfully!');
									});
								}
							})
							});
						}
						
						return;
					}else{
						var configData = {createdBy: payload.sender.id, unique: (unique-1),groupId:groupId,doctor:[],child:[],parent:"",medical:[]};
		
						if(replyData == "1"){
							configData.child.push(payload.sender.id);
							var newConfig = new Config(configData);
							newConfig.save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							});
						}else if(replyData == "2"){
							configData.parent = (payload.sender.id);
							var newConfig = new Config(configData);
							newConfig.save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							});
						}else if(replyData == "3"){
							configData.doctor = (payload.sender.id);
							var newConfig = new Config(configData);
							newConfig.save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							});
						}else if(replyData == "4"){
							configData.medical.push(payload.sender.id);
							var newConfig = new Config(configData);
							newConfig.save(function(err) {
							  if (err) console.log(err);
							  console.log('Config saved successfully!');
							});
						}else{
							reply({ text:"Invalid reply" }, (err) => {
							  if (err) console.log(err);
							  console.log(`Echoed back`)
							})
						}
					
					
					}
				})
			}
		
		})
		
	}
	
	if(data.toLowerCase() == ("has my father eaten food")){
		Group.find({child: payload.sender.id}, function(err, users){
		if(err) console.log(err);
			if(users.length == 0){
				reply({ text:"Let his son do this work. Sorry!!!.." }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
			}else{
				reply({ text:"Please be patient, checking in a moment..." }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
				
				
				
				reply({ text:"Yes, your father had food" }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
			
			}
		});
		
		
	
	}
	var keyword1="food";
	var keyword2="lunch";
	var keyword3="dinner";
	if((data.toLowerCase().indexOf(keyword1) >-1)||(data.toLowerCase().indexOf(keyword2) >-1)||(data.toLowerCase().indexOf(keyword3) >-1)){
		Group.find({child: payload.sender.id}, function(err, users){
		if(err) console.log(err);
			if(users.length == 0){
				reply({ text:"Let his son do this work. Sorry!!!.." }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
			}else{
				up.sleeps.get({}, function(err, body) {
					console.log(body);
				});
				reply({ text:"Yes, your father had food" }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
			
			}
		});
	}
	
	if(data.toLowerCase() == "is my father asleep?"){
		Group.find({child: payload.sender.id}, function(err, users){
		if(err) console.log(err);
			if(users.length == 0){
				reply({ text:"Let his son do this work. Sorry!!!.." }, (err) => {
				  if (err) console.log(err);
				  console.log(`Echoed back`)
				})
			}else{
				up.sleeps.get({}, function(err, body) {
					if (err) {
						console.log('Error receiving Jawbone UP data');
					} else {
						var jawboneData = JSON.parse(body).data;
						var timeCompleted = (jawboneData.items[0].time_completed);
						console.log(timeCompleted);
						var forHours = jawboneData.items[0].title;
						var date = new Date(timeCompleted*1000);
						
						reply({ text:"Your parent have slept " + forHours + ", at " +  date.toString("MMM dd yyyy HH:MM")}, (err) => {
						  if (err) console.log(err);
						  console.log(`Echoed back`)
						})
					}
				});
			}
		});
	}
	

    
  })
})

http.createServer(bot.middleware()).listen(5000)
console.log('Echo bot server running at port 5000.')