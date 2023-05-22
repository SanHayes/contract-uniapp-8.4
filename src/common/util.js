//*********更换站点域名时需要改动的地方**********************

const apidomain = 'http://43.131.250.214/webapi/dapp_api.php'
const isdebug = true
const nver = '1.0.0'

function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}
	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function add0(m){return m<10?'0'+m:m }
function formatDate(shijianchuo){
	var newdate = parseInt(shijianchuo)*1000
	var time = new Date(newdate);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}

function istel(tel) {
	var myreg = /^((1[3-9]{1})+\d{9})$/;
	if (!myreg.test(tel)) {
		return false
	} else {
		return true
	}
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}
	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)
	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

function str_arr(str){
	var arrt = str.split(',')
	var arrback = {}
	for (var i=0;i<arrt.length;i++){
		var arrtt = arrt[i].split('|')
		arrback[arrtt[0]] = arrtt[1]
	}
	return arrback
}

function jsalert(strcontent,confirmText,gourl,strtype='redirectTo'){
	uni.hideLoading()
	if (!confirmText){
		confirmText = '确定'
	}
	uni.showModal({	
		content: strcontent,
		confirmText: confirmText,
		showCancel: false,
		confirmColor: '#f55850',
		cancelColor: '#39B54A',
		success: (res) => {
			if(strtype && strtype=='back') {  
				uni.navigateBack()
			}else if(res.confirm && gourl && strtype=='switchTab') {  
				uni.switchTab({url: gourl});
			}else if(res.confirm && gourl) {  
				uni.redirectTo({url: gourl});
			}  
		}
	})	
}

function msg(strcontent){
	uni.hideLoading()
	if (strcontent){
		uni.showToast({title:strcontent,icon: 'none'})
	}
}

const ApiSync = (_data, _method='POST')=>{
	_data['ver'] = nver;	
	return new Promise((resolve, reject)=>{
		uni.request({ 
			url: apidomain,
			method: _method,
			data: _data,
			success: (res)=>{
				resolve(res.data);
				uni.hideLoading()
			},
			fail: (err)=>{
				let res = {}
				res['status'] = 0
				resolve(res);
				uni.hideLoading()
			}
		})
	})
}

function log(object){
	if (isdebug){	
		console.log(object)		
	}
}
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}

function getFloat(number, nb=5) {
	number = Math.floor(number*10**nb)/(10**nb);
	if (number<=0){
		number = Number(number).toFixed(nb);
	}
	return number;
};

function delarrkey(data, key){
    data.forEach((item, index) => {
        if (item.key === key) {
            data.splice(index, 1)
        }
    })
	return data;
}
function urlencode(str) {  
    str = (str + '').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
}
function utc2beijing(utc_datetime) {
	// 转为正常的时间格式 年-月-日 时:分:秒
	var T_pos = utc_datetime.indexOf('T');
	var Z_pos = utc_datetime.indexOf('Z');
	var year_month_day = utc_datetime.substr(0,T_pos);
	var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
	var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

	// 处理成为时间戳
	timestamp = new Date(Date.parse(new_datetime));
	timestamp = timestamp.getTime();
	timestamp = timestamp/1000;
	// 增加8个小时，北京时间比utc时间多八个时区
	var timestamp = timestamp+8*60*60;

	// 时间戳转为时间
	var beijing_datetime = formatDate(timestamp);
	return beijing_datetime; // 2017-03-31 16:02:06
} 
function strsubstr(str,ns,ne=0){
	if (str && str.length>0){
		if (ns<0){
			ns = str.length + ns
		}
		if (ne>0){
			str = str.substr(ns,ne)
		}else{
			str = str.substr(ns,str.length-ns)			
		}
	}
	return str
}

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	ApiSync: ApiSync,
	log:log,
	jsalert: jsalert,
	isEmpty: isEmpty,
	msg: msg,
	formatDate: formatDate,
	str_arr: str_arr,
	nver: nver,
	istel: istel,
	apidomain: apidomain
}

//<uni-icons type="paperplane" size="20"></uni-icons>
//uni.setStorageSync("newid",newsid);
//uni.getStorageSync("newid")
//uni.navigateTo({url: '../info/info?id='+newsid});
//uni.showLoading({title:"加载中...."})
//uni.hideLoading();
//uni.setNavigationBarTitle({title: res.data.title})
//uni.showToast({title:"关注成功" })
//console.log(e)
//https://blog.csdn.net/qq_39418742/article/details/109184806
