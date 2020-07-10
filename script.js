const express =require('express');
const bodyPasrer =require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors =require('cors');
const knex =require('knex')
const db =knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '17701023cse_cu',
    database : 'smart-brain' 
  }
});

const app=express();
app.use(bodyPasrer.json());
app.use(cors());

app.get('/',(req,res)=> {
		db.select('*').from('users').then(user => res.json(user))
})
app.post('/login',(req,res)=>{
	db.select('email','hash').from('login').where({email: req.body.email})
	.then(user=> {
		if(bcrypt.compareSync(req.body.password, user[0].hash)) {
		 	return db.select('*')
		 	.from('users')
		 	.where({email:req.body.email})
			.then(data=> res.json(data[0]) )
			.catch(err => res.status(400).json("Something is"))
		}
		else {
			res.status(400).json("Not such User")
		}
		
	})
	.catch(err => res.status(400).json('Something is Wrong'))
})
app.post('/register',(req,res)=>{
	const {name,email,password}=req.body;
	const hash =bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash:hash,
			email:email
		})
		.into('login')
		.returning('email')
		.then(LoginEmail => {
			return trx('users')
			.returning('*')
			.insert({
				email:LoginEmail[0],
			    name:name,
				joined:new Date()
			})
			.then(user => {
					res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Unable to Register'))
})
app.get('/profile/:id',(req,res)=> {
	const {id} =req.params;
	db.select('*').from('users').where({id})
	.then(user=> {
		if(user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('Not Found')
		}
	}).catch(err => res.status(400).json('Error Getting user'))
})
app.put('/image',(req,res)=> {
	const {id} =req.body;
	db('users')
	  .where('id', '=', id)
	  .increment('entris', 1)
	  .returning('entris')
	  .then(entris => {
	  	res.json(entris[0])
	  }).catch(err => res.status(400).json('Unable to get entris'))
})

app.listen(3000,()=>{
	console.log('This is working');
});
