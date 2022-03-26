let httpUrl = 'https://www.1905.com/vod/';//所爬取网站：“电影1905”
let request = require('request');//导入所需第三方包request
let fs = require('fs');
let httpAllUrl = 'https://www.1905.com/vod/list/n_1/o3p1.html';//爬取电影全部分类

//获取电影热门分类
async function getClassUrl(){
    let init = {};
    init = await req(httpUrl);
    let reg = /<div class="center_a nav_1905all">(.*?)<\/div>/igs;
    let reslut = reg.exec(init.body)[1];
    //定义对象数组
    let moveTop = [];
    //定义分类的链接
    let regs = /<a href="(.*?)" target="_blank">(.*?)<\/a>/igs
    let res;
    while(res = regs.exec(reslut)){
        let obj = {
            Name:res[2],
            url:res[1]
        }
        moveTop.push(obj);
    }
    return moveTop;
}

//爬取全部电影分类以及对应分类中所有电影信息的函数
async function getClassUrlAll(){
    let init = {};
    init = await req(httpAllUrl);
    let reg = /<p class="search-index-R">(.*?)<\/p>/igs;
    let regs = /<a href="(.*?)" (.*?)>(.*?)<\/a>/igs;//获取全部的分类信息
    let str = /onclick="location.href='(.*?)'/;
    let reslut;//获取初步的筛选
    let urls;
    let response;//获取最终的结果
    let moiveAllName = [];
    while(reslut = reg.exec(init.body)){
        while(response = regs.exec(reslut[0])){
            urls = str.exec(response);
            if(urls){ 
                let obj = {
                    url:urls[1],
                    moiveName:response[3],
                }
                let arr = await getAllMoive(obj.url);
                obj.moiveIno = arr;
                moiveAllName.push(obj);
            }
            else{
                let obj = {
                    url:response[1],
                    moiveName:response[3]
                }
                let arr = await getAllMoive(response[1]);
                obj.moiveIno = arr;
                moiveAllName.push(obj);
            }
        }
        
    } 
    return moiveAllName;
}

//获取对应分类中各个电影的函数
async function getAllMoive(url){
    let init = await req(url);
    let reg = /<section class="mod row search-list">(.*?)<\/section>/igs;//定位电影信息栏目
    let reg2 = /<a class="pic-pack-outer" target="_blank" href="(.*?)" title="(.*?)">(.*?)<\/a>/igs;//爬取每个电影的基本信息
    let res = reg.exec(init.body);
    let response;
    let moiveInform = [];
    if(res==null){
        return 'null'
    }
    while(response = reg2.exec(res[1])){
        let obj = {
            url:response[1],
            Name:response[2],
        }
        moiveInform.push(obj);
    }
    return moiveInform;
}
//请求函数
function req(url){
    return new Promise((reslove,reject)=>{
        request.get(url,(err,res,body)=>{
            if(err){
                reject(err);
            }else{
                reslove(res,body);
            }
        })
    })
}

//调用爬取电影热门分类的函数
getClassUrl();

//爬取全部电影分类以及对应分类中所有电影信息的函数
getClassUrlAll();
