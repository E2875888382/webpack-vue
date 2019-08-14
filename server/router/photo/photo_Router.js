var express=require('express');
var router=express.Router();
var db = require('../../mysql.js');

// 查询一组相簿
router.get('/getPhoto',(request,response) => {
    var begin = (request.query.group -1)*10;
    var sql = `SELECT photo.src,photo.title,photo.photoID,user.avatar,user.nickName
    FROM USER,photo
    WHERE user.userID = photo.userID
    LIMIT ${begin},10`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,photo:result });
    })
})
// 查询相簿的数量
router.get('/getPhotoCount',(request,response) => {
    var sql = `SELECT COUNT(*) FROM photo`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,photoCount:result[0]["COUNT(*)"] });
    })
})
// 查询相簿详细内容
router.post('/getPhotoDetails',(request,response) => {
    var sql = `SELECT photo.title,user.avatar,user.nickName,photo.tags,photo.view,photo.praise,photo.time,user.level,photo.photo,user.userID
    FROM USER,photo
    WHERE user.userID = photo.userID
    AND photoID = ${request.body.photoID}`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,photoDetails:result });
    })
})
// 查询评论
router.post('/getPhotoReplyByTime',(request,response)=>{
    var begin = (request.body.currentPage -1)*5;
    var sql = `SELECT user.nickName,photoreply.time,photoreply.content,photoreply.praise,user.avatar,photoreply.down,photoreply.photoReplyID
    FROM USER,photoreply
    WHERE user.userID = photoreply.userID
    AND photoID = ${request.body.photoID} ORDER BY time DESC LIMIT ${begin},5`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,photoReplyByTime:result });
    })
})
// 查询评论
router.post('/getPhotoReply',(request,response)=>{
    var begin = (request.body.currentPage -1)*5;
    var sql = `SELECT user.nickName,photoreply.time,photoreply.content,photoreply.praise,user.avatar,photoreply.down,photoreply.photoReplyID
    FROM USER,photoreply
    WHERE user.userID = photoreply.userID
    AND photoID = ${request.body.photoID} ORDER BY praise DESC LIMIT ${begin},5`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,photoReply:result });
    })
})
// 查询评论数量
router.post('/getPhotoCount',(request,response) => {
    var sql = `SELECT  COUNT(*)
    FROM photoreply
    WHERE  photoID = ${request.body.photoID}`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,photoCount:result });
    })
})



// 增加评论
router.post('/addPhotoReply',(request,response)=>{
    var sql = `INSERT INTO photoreply(photoID,userID,TIME,content)
    VALUES (${request.body.photoID},${request.session.user},'${request.body.time}','${request.body.content}')`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'评论成功' });
    })
})
// 增加点赞量
router.post('/photoPraise',(request,response)=>{
    var sql = `UPDATE photo SET praise = praise + 1 WHERE photoID = ${request.body.photoID}`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'success'});
    })
})
// 增加阅读量
router.post('/addPhotoView',(request,response) =>{
    var sql = `UPDATE photo SET view = view + 1  WHERE photoID =${request.body.photoID} `;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'阅读量增加' });
    })
})
// 增加评论点赞量
router.post('/photoReplyPraise',(request,response)=>{
    var sql = `UPDATE photoreply SET praise = praise + 1 WHERE photoReplyID = ${request.body.photoReplyID}`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'success'});
    })
})
// 增加评论踩
router.post('/photoReplyDown',(request,response)=>{
    var sql = `UPDATE photoreply SET down = down + 1 WHERE photoReplyID = ${request.body.photoReplyID}`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'success'});
    })
})
// 增加相簿
router.post('/addNewPhoto',(request,response)=>{
    var sql = `INSERT INTO photo (userID,tags,src,title,TIME,photo)
    VALUES(${request.session.user},'${request.body.tags}',
    '${request.body.src}','${request.body.title}','${request.body.time}',
    '${request.body.photo}')`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'success'});
    })
})



// 修改点赞量
router.post('/cancelPhotoPraise',(request,response)=>{
    var sql = `UPDATE photo SET praise = praise - 1 WHERE photoID = ${request.body.photoID}`;
    db(sql,(result)=>{
        response.status(200).json({ code:200,message:'success'});
    })
})



//导出router
module.exports=router;