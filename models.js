let dbs = require('./db.json') 
const fs = require('fs')
function findall(){
    return new Promise((resolve,reject)=>{
       resolve(dbs)
    })
} 

function findbyid(id){
    return new Promise((resolve,reject)=>{
        const db =dbs.find((p)=> p.id == id)
        resolve(db)
    })
}
function create(emp){
    return new Promise((resolve,reject)=>{
        let nid=Math.max(...dbs.map(i=>i.id))
        nid++
        const nemp= { id: nid, ...emp}
        dbs.push(nemp)
        fs.writeFileSync('./db.json',JSON.stringify(dbs),'utf8',(err) => {
            if(err){ console.log(err );}
        })
        resolve(nemp)
    })
}
function update(id,emp){
    return new Promise((resolve,reject)=>{
        const index = dbs.findIndex((p)=>p.id == id) 
        if(index === -1){
            reject({
                msg: "Invalid Id"
            })
        }
        dbs[index]={id, ...emp}
        fs.writeFileSync('./db.json',JSON.stringify(dbs),(err) => {
            if(err){ console.log(err );}
        })
        resolve(dbs[index])
    })
}
 
function remove(id){
    return new Promise((resolve,reject)=>{
        dbs = dbs.filter((p)=>p.id != id) 
        fs.writeFileSync('./db.json',JSON.stringify(dbs),'utf8',(err) => {
            if(err){ console.log(err );}
        })
        resolve()
    })
}
module.exports={
      findall,findbyid,create,update,remove
}