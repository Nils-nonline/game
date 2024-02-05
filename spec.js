var fileNames = {
	"FBX/Revolver_02.fbx": { //checked
		scale: 0.002, x:0,y:0,z:0,tx: 0, ty: 180, tz: 0, name: "NYX 357", publicinf: {
			name: "NYX .357",
			repeated: true,
			mag: 6,
			reloadtime: 2000,
			fastreloadtime: 1500,
			cooldown: 460,
			damage: 95,
			recoil:8,
			bsa:0.08
		}
	},
	"FBX/AssaultRifle_02.fbx": {
		scale: 0.004,x:0,y:0,z:0, tx: 90, ty: 0, tz: 0, name: "M4", publicinf: {
			name: "M4", //checked
			repeated: true,
			mag: 30,
			reloadtime: 2000,
			fastreloadtime: 1600,
			cooldown: 80,
			damage: 35,
			recoil:5,
			bsa:0.04
		}
	},
	"FBX/fn-scar.fbx": {
		scale: 0.002,x:0,y:0,z:0, tx: 0, ty: 0, tz: 0, name: "herstal 762", publicinf: {
			name: "Herstal 762", //checked
			repeated: true,
			mag: 20,
			fastreloadtime: 1800,
			reloadtime: 2100,
			cooldown: 97,
			damage: 40,
			recoil:7,
			bsa:0.025
		}
	},

	"FBX/AssaultRifle_03.fbx": {
		scale: 0.004,x:0,y:0,z:0.25, tx: 0, ty: 180, tz: 0, name: "thevis 223", publicinf: {
			name: "Thevis .223", //checked
			repeated: true,
			mag: 30,
			fastreloadtime: 1900,
			reloadtime: 2400,
			cooldown: 72,
			damage: 33,
			recoil:3,
			bsa:0.075
		}
	},
	"FBX/AssaultRifle_02.fbx": {
		scale: 0.004,x:0,y:0,z:0.2, tx: 0, ty: 0, tz: 0, name: "thevis 9mm", publicinf: {
			name: "Thevis 9mm", //checked
			repeated: true,
			mag: 30,
			fastreloadtime: 1400,
			reloadtime: 1600,
			cooldown: 68,
			damage: 29,
			recoil:4,
			bsa:0.07
		}
	},
	/*"FBX/Kerbrat_MP.fbx":{scale:0.004,x:0,y:0,z:0,tx:0,ty:0,tz:0,name:"kerbrat mp",publicinf:{name:"Kerbrat MP", //checked
																																										 repeated:true,
																																										 mag:30,
																																										 fastreloadtime:1500,
																																										 reloadtime:1900,
																																										 cooldown:50,
																																										 damage:25,
																																											recoil:1,
			bsa:0.15
																																										 }
	},*/
	"FBX/SubmachineGun_04.fbx": {
		scale: 0.004,x:0,y:-0.2,z:1.2, tx: 0, ty: 180, tz: 0, name: "izhmash bizon", publicinf: {
			name: "Izhmash Bizon", //checked
			repeated: true,
			mag: 64,
			reloadtime: 2200,
			fastreloadtime: 1800,
			cooldown: 90,
			damage: 32,
			recoil:0.5,
			bsa:0.07
		}
	},
	"FBX/SniperRifle_02.fbx": {
		scale: 0.0025,x:0,y:0,z:0.1, tx: 0, ty: 0, tz: 0, name: "sniper", publicinf: {
			name: "Sniper",
			repeated: false,
			cooldown: 2000,
			damage: 1000
		}
	},
	"FBX/Shotgun_03.fbx": {
		scale: 0.0025,x:0,y:0,z:0, tx: 0, ty: 0, tz: 0, name: "shotgun", publicinf: {
			name: "Shotgun",
			repeated: true,
			cooldown: 1000,
			damage: 500
		}
	},
	"FBX/SubmachineGun_02.fbx": {
		scale: 0.0025,x:0,y:0,z:0, tx: 0, ty: 0, tz: 0, name: "smg", publicinf: {
			name: "SMG",
			repeated: true,
			cooldown: 200,
			damage: 100
		}
	}
};
export { fileNames }