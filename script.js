const express =require('express');
const bodyPasrer =require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors =require('cors');
const app=express();
app.use(bodyPasrer.json());
app.use(cors());
const database = {
	users : [
	{
		id:'123',
		name:'rokan',
		email:'rokan55@gmail.com',
		password:'password',
		entris:0,
		date:new Date()
	},
	{
		id:'124',
		name:'minhaz',
		email:'minhaz@gmail.com',
		password:'password',
		entris:0,
		date:new Date()
	}
	]
}
app.get('/',(req,res)=> {
	res.send(database.users);
})
app.post('/login',(req,res)=>{
	
	if(req.body.email === database.users[0].email && req.body.password===database.users[0].password)
	{
		res.json(database.users[0]);
	} else
	{
		res.status(400).json('error log in');
	}
})
app.post('/register',(req,res)=>{
	const {name,email,password}=req.body;
	database.users.push({
		id:'125',
		name:name,
		email:email,
		password:password,
		date:new Date()
	})
	res.json(database.users[database.users.length-1]);
})
app.get('/profile/:id',(req,res)=> {
	const {id} =req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id===id){
			found=true;
			return res.send(user);
		}
	})
	if(!found) res.status(404).json('no such users');
})
app.put('/image',(req,res)=> {
	const {id} =req.body;
	 let found = false;
	database.users.forEach(user => {
		if(user.id===id){
			found=true;
			user.entris++;
			return res.json(user.entris);
		}
	})
	if(!found) res.sendstatus(404).json('no such users');
})

app.listen(3000,()=>{
	console.log('This is working');
});
