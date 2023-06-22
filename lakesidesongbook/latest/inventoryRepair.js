function makeObject(inventory, img, title, description){
    if (inventory == undefined){
        inventory = {}
    }

    inventory.imgSrc = img
    inventory.name = title
    inventory.description = description

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
    inventory[0] = makeObject(
        inventory[0],
        "invImgs/DEBUGFISH.png",
        "DEBUG.FISH",
        "The first"
    )

    inventory[1] = makeObject(
        inventory[1],
        "invImgs/realfakefish.png",
        "Real fake fish",
        "A plastic fish indistinguishable from a real one, at least at its initial time of production, it's broken now."
    )

    inventory[2] = makeObject(
        inventory[2],
        "invImgs/flopper.png",
        "Flopper",
        "An uncommon fish from a far away land... Rumour has it that the island it came from is forever changing..."
    )

    inventory[3] = makeObject(
        inventory[3],
        "invImgs/flopperG.png",
        "Green flopper",
        "An uncommon fish from a far away land... Rumour has it that the island it came from is forever changing..."
    )

    inventory[4] = makeObject(
        inventory[4],
        "invImgs/flopperB.png",
        "Blue flopper",
        "An uncommon fish from a far away land... Rumour has it that the island it came from is forever changing..."
    )

    inventory[5] = makeObject(
        inventory[5],
        "invImgs/cheepcheep.png",
        "Cheep cheep",
        "That fish got them dick sucking lips!"
    )

    return inventory
}