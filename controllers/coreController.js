const admin = require('firebase-admin');
let raw = require('../models/raw')
var promise = require('bluebird');




var serviceAccount = require("../routes/mira-65899-firebase-adminsdk-tgvkn-e97813abda.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mira-65899.firebaseio.com"
});

var db = admin.database();
var hit_areas = db.ref("hits");
var SOS = db.ref("sos");
var relief = db.ref("relief");



hit_areas.on("value",(snapshot)=> {
	let hitAreas = snapshot.val();
	if(hitAreas){
		let v=Object.keys(hitAreas).map((key)=>{
			let x={
				"name":key,
				"lat":hitAreas[key].lat,
				"long":hitAreas[key].long
			}
			return raw.hits.push(x);
		});
	}
});

relief.on("value",(snapshot)=>{
	let data=snapshot.val();
	console.log(data)
	if(data){
		let v = Object.keys(data).map((key)=>{
			let x={
				"name":key,
				"lat":data[key].lat,
				"long":data[key].long
			}
			return raw.relief.push(x);
		});
	}
});

SOS.on("value",(snapshot)=>{
	
});



exports.SOS=(lat,long)=>{
	return new promise((full,rej)=>{
		console.log("sos");
		promise.all([
			getNearestHits(lat,long),
			getNearestRelief(lat,long)
		])
		.then(([r1,r2])=>{
			full([r1,r2]);
		})
		.catch((er)=>{
			console.log(er);
		});
	});
}

let getNearestHits=(lat,long)=>{
	let coordinates=[];
	let dis=[];
	return new promise((full,rej)=>{
		let v=raw.hits.map((value)=>{
			return new promise((f1,r1)=>{
				let latN=parseFloat(lat)*111;
				let longN=parseFloat(long)*88;
				let vLatN=parseFloat(value.lat)*111;
				let vLongN=parseFloat(value.long)*88;
				let d=Math.sqrt(((vLatN-latN)*(vLatN-latN))+((vLongN-longN)*(vLongN-longN)))
				dis.push("hits "+d);
				if(d<10 || d<20 || d<30){
					let c={
						"name":value.name,
						"lat":value.lat,
						"long":value.long
					}
					coordinates.push(c);
				}
				f1();
			});
		});
		
		promise.all(v)
		.then(()=>{
			console.log(dis);
			full(coordinates);
		})
		.catch((e)=>{
			rej(e);
		});
	});
}

let getNearestRelief=(lat,long)=>{
	let coordinates=[];
	let dis=[];
	return new promise((full,rej)=>{
		let v=raw.relief.map((value)=>{
			return new promise((f1,r1)=>{
				let latN=parseFloat(lat)*111;
				let longN=parseFloat(long)*88;
				let vLatN=parseFloat(value.lat)*111;
				let vLongN=parseFloat(value.long)*88;
				let d=Math.sqrt(((vLatN-latN)*(vLatN-latN))+((vLongN-longN)*(vLongN-longN)))
				dis.push("relief "+d);
				if(d<10 || d<20 || d<30){
					let c={
						"name":value.name,
						"lat":value.lat,
						"long":value.long
					}
					coordinates.push(c);
				}
				f1();
			});
		});
		
		promise.all(v)
		.then(()=>{
			console.log(dis);
			full(coordinates);
			//console.log(coordinates);
		})
		.catch((e)=>{
			rej(e);
		});
	});
}
