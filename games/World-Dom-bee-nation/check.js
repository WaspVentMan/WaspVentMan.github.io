let truehive = {
    "beeswax": 0,
    "honey": 0,
    "nectar": 0,
    "bees": 1
}

let truebees = {
    "swarmqueue": 0,
    "swarm": {"pos": 0, "to": true, "nectar": 0, "bees": 0},
    "worker": {"bees": 0},
    "constructors": {"bees": 0},
    "queen": {"bees": 0}
}

function savecheck(){
    let hiveparts = ["beeswax", "honey", "nectar", "bees"]
    let beesparts = ["swarmqueue", "swarm", "worker", "constructors", "queen"]

    for (let x = 0; x < hiveparts.length; x++){
        if (hive[hiveparts[x]] == undefined){
            hive[hiveparts[x]] = truehive[hiveparts[x]]
        }
    }

    for (let x = 0; x < beesparts.length; x++){
        if (bees[beesparts[x]] == undefined){
            bees[beesparts[x]] = truebees[beesparts[x]]
        }
    }

    if (achievements == 0){
        achievements = rawstring
    }
}