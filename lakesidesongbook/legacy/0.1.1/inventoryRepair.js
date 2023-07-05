function countSize(inventory){
    try{
        inventory.count++
        inventory.count--
    } catch {
        inventory.count = 0
    }

    try{
        inventory.size++
        inventory.size--
    } catch {
        inventory.size = 0
    }

    return inventory
}

function inventoryRepair(inventory){
    inventory[0].imgSrc = "invImgs/DEBUGFISH.png"
    inventory[0].title = "DEBUG.FISH"
    inventory[0].description = "The first"

    inventory[0] = countSize(inventory[0])
    
    inventory[1].imgSrc = "invImgs/realfakefish.png"
    inventory[1].title = "Real fake fish"
    inventory[1].description = "A plastic fish indistinguishable from a real one, at least at its initial time of production, it's broken now."

    inventory[1] = countSize(inventory[1])

    return inventory
}