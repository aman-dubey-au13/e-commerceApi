const express = require('express');
const Admin = require('../../models/Admin');
const Customer = require('../../models/Customer');
const DeliveryPerson = require("../../models/DeliveryPerson")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../credentials/config');
const router = express.Router();

async function findAdmin(email) {
    try {
        let admin = await Admin.findOne({email}).lean();
        console.log(admin)
        if(admin) {
            return {err: false, found: true, admin};
        } else {
            return {err: false, found: false, error:'Invalid email'}
        }
    } catch(e) {
        return {err:true, error: e};
    }
}

async function findCustomer(email) {
    try {
        let customer = await Customer.findOne({email}).lean();
        if(customer) {
            return {err: false, found: true, customer};
        } else {
            return {err: false, found: false, error:'Invalid email'}
        }
    } catch(e) {
        return {err:true, error: e};
    }
}
async function findDeliveryPerson(email) {
    try {
        let deliveryPerson = await DeliveryPerson.findOne({email}).lean();
        if(deliveryPerson) {
            return {err: false, found: true, deliveryPerson};
        } else {
            return {err: false, found: false, error:'Invalid email'}
        }
    } catch(e) {
        return {err:true, error: e};
    }
}


router.post('/login', async function(req, res, next) {
    if(req.body.email && req.body.password && req.body.method && req.body.method=="Customer") {
        let result = await findCustomer(req.body.email);
        if(result.err || !result.found) {
            return res.status(400).send({error: result.error});
        } else {
            let isValidPassword = await bcrypt.compare(req.body.password, result.customer.password);
            if(isValidPassword) {
                let token = jwt.sign({_id: result.customer._id, user_type:'Customer'}, config.jwt_secret_key);
                res.json({Customer:result.customer, token});
            } else {
                return res.status(400).send({error: 'Invalid password'});
            }
        }
    } else if(req.body.email && req.body.password && req.body.method && req.body.method=="deliveryPerson") {
        let result = await findDeliveryPerson(req.body.email);
        if(result.err) {
            return res.status(400).send({error: result.error});
        } else {
            let isValidPassword = await bcrypt.compare(req.body.password, result.deliveryPerson.password);
            if(isValidPassword) {
                let token = jwt.sign({_id: result.deliveryPerson._id, user_type:'deliveryPerson'}, config.jwt_secret_key);
                res.json({deliveryPerson:result.deliveryPerson, token});
            } else {
                return res.status(400).send({error: 'Invalid password'});
            }
        }
    }else if(req.body.email && req.body.password && req.body.method && req.body.method=="Admin") {
        let result = await findAdmin(req.body.email);
        if(result.err) {
            return res.status(400).send({error: result.error});
        } else {
            let isValidPassword = await bcrypt.compare(req.body.password, result.admin.password);
            if(isValidPassword) {
                let token = jwt.sign({_id: result.admin._id, user_type:'Admin'}, config.jwt_secret_key);
                res.json({admin:result.admin, token});
            } else {
                return res.status(400).send({error: 'Invalid password'});
            }
        }
    }
     else {
        return res.status(400).send({error: 'Invalid/Not enough paramters'});
    }
});


router.post('/signup', async function(req, res, next) {
    if(req.body.email && req.body.password && req.body.name && req.body.method && req.body.method=="customer") {
        let result = await findCustomer(req.body.email);
        if(result.err) {
            return res.status(400).send({error: result.error});
        } else if(result.found) {
            return res.status(400).send({error: 'Email already exists'});
        } else {
            let hash = await bcrypt.hash(req.body.password, 10);
            let new_customer = await Customer.create({email: req.body.email, password: hash, name: req.body.name});
            let token = jwt.sign({_id: new_customer._id, user_type:'customer'}, config.jwt_secret_key);
            res.json({customer: new_customer, token});
        }
    } else if(req.body.email && req.body.password && req.body.name && req.body.method && req.body.method=="deliveryPerson") {
        let result = await findDeliveryPerson(req.body.email);
        if(result.err) {
            return res.status(400).send({error: result.error});
        } else if(result.found) {
            return res.status(400).send({error: 'Email already exists'});
        } else {
            let hash = await bcrypt.hash(req.body.password, 10);
            let new_deliveryPerson = await DeliveryPerson.create({email: req.body.email, password: hash, name: req.body.name});
            let token = jwt.sign({_id: new_deliveryPerson._id, user_type:'deliveryPerson'}, config.jwt_secret_key);
            res.json({deliveryPerson: new_deliveryPerson, token});
        }
    }else if(req.body.email && req.body.password && req.body.name && req.body.method && req.body.method=="Admin") {
        let result = await findAdmin(req.body.email);
        if(result.err) {
            return res.status(400).send({error: result.error});
        } else if(result.found) {
            return res.status(400).send({error: 'Email already exists'});
        } else {
            let hash = await bcrypt.hash(req.body.password, 10);
            let new_admin = await Admin.create({email: req.body.email, password: hash, name: req.body.name});
            let token = jwt.sign({_id: new_admin._id, user_type:'admin'}, config.jwt_secret_key);
            res.json({admin: new_admin, token});
        }
    }
     else {
        return res.status(400).send({error: 'Invalid/Not enough paramters'});
    }
});

module.exports=router;