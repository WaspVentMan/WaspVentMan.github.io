function makeObject(inventory){
    if (inventory == undefined){
        inventory = {}
    }

    inventory.imgSrc = undefined
    inventory.name = undefined
    inventory.description = undefined

    try{
        if (inventory.count == NaN) {
            inventory.count = 0
        }
    } catch {
        inventory.count = 0
    }

    try{
        if (inventory.size == NaN) {
            inventory.size = 0
        }
    } catch {
        inventory.size = 0
    }

    return inventory
}

function inventoryRepair(inventory){
    inventory[0] = makeObject(inventory[0])
    inventory[1] = makeObject(inventory[1])
    inventory[2] = makeObject(inventory[2])
    inventory[3] = makeObject(inventory[3])
    inventory[4] = makeObject(inventory[4])
    inventory[5] = makeObject(inventory[5])
    inventory[6] = makeObject(inventory[6])
    inventory[7] = makeObject(inventory[7])

    return inventory
}