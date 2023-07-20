function makeObject(inventory){
    if (inventory == undefined){
        inventory = {}
    }

    try{
        if (inventory.count == NaN || inventory.count == undefined) {
            inventory.count = 0
        }
    } catch {
        inventory.count = 0
    }

    try{
        if (inventory.countR == NaN || inventory.countR == undefined) {
            inventory.countR = 0
        }
    } catch {
        inventory.countR = 0
    }

    try{
        if (inventory.size == NaN || inventory.size == undefined) {
            inventory.size = 0
        }
    } catch {
        inventory.size = 0
    }

    try{
        if (inventory.sizeR == NaN || inventory.sizeR == undefined) {
            inventory.sizeR = 0
        }
    } catch {
        inventory.sizeR = 0
    }

    return inventory
}

function inventoryRepair(inventory, IL = 1){
    for(let x = 0 ; x < IL ; x++){
        inventory[fishUltralist[x]] = makeObject(inventory[fishUltralist[x]])
    }

    return inventory
}