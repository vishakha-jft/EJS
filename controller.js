const Db = require('./models')

async function getemps(req,res){
    try{
        const dbs = await Db.findall()
        if(typeof req.session.edit!=='object'){
            req.session.edit=false
        }
        res.render('ui',{
            dbs,
            edit:req.session.edit
        })
    } catch(error){
        console.log(error)
    }
}
async function getemp(req,res,id){
    try{
        req.session.edit= await Db.findbyid(id)   
        res.redirect('/employee')
    } catch(error){
        console.log(error)
    }
}
async function createemp(req,res){
    try{
        const emp = req.body
        await Db.create(emp)
        res.redirect('/employee')
    } catch(error){
        console.log(error)
    }
}
async function updateemp(req,res,id){
    try{
        const empdata= req.body;
        await Db.update(id,empdata)
        req.session.edit=false
        res.redirect('/employee')    
    } catch(error){
        console.log(error)
    }
}
async function removeemp(req,res,id){
    try{
        await Db.remove(id) 
        res.redirect('/employee')
    } catch(error){
        console.log(error)
    }
}

module.exports = {
    getemps,getemp,createemp,updateemp,removeemp
}
