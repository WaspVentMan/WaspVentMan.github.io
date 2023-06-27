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
        if (inventory.size == NaN || inventory.size == undefined) {
            inventory.size = 0
        }
    } catch {
        inventory.size = 0
    }

    return inventory
}

function inventoryRepair(inventory, IL = 1){
    for(let x = 0 ; x < IL ; x++){
        inventory[x] = makeObject(inventory[x])
    }

    return inventory
}