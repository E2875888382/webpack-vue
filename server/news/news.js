const express=require('express');
const router=express.Router();
const db = require('../mysql.js');

// 获取详情
router.get('/newsDetail',(req,res)=>{
    let newId = req.query.newId;
    let sqlAddView = `UPDATE news SET view = view + 1  WHERE newID = ${newId}`;
    let sqlNewDetail = `SELECT * FROM news WHERE newID = ${ newId }`;
    new Promise((resolve)=>{
        db(sqlAddView,()=>{
            resolve()
        })
    }).then(()=>{
        return new Promise((resolve)=>{
            db(sqlNewDetail,(data)=>{
                resolve(JSON.stringify(data))
            })
        })
    }).then((data)=>{
        res.type('text/javascript');
        res.status(200).send(`${req.query.callback}(${data})`);
    }).catch((err)=>{
        console.log(err)
    })
})

// 获取最新新闻
router.get('/news',(req,res)=>{
    let sqlNews = `SELECT title,newID FROM news ORDER BY RAND() LIMIT 10`;
    new Promise((resolve)=>{
        db(sqlNews,(data)=>{
            resolve(JSON.stringify(data))
        })
    }).then((data)=>{
        res.type('text/javascript');
        res.status(200).send(`${req.query.callback}(${data})`);
    }).catch((err)=>{
        console.log(err)
    })
})

module.exports=router;