const inventory = document.querySelector(".inventory")

let inv = []

function invadd(item, count){
    for (let x = 0; x < inv.length; x++){
        if (item == inv[x].item && inv[x].count < itemconfig[item].stack){
            if (inv[x].count + count > itemconfig[item].stack){
                count = (inv[x].count + count) -itemconfig[item].stack
                inv[x].count == itemconfig[item].stack

                document.querySelector(("." + inv[x].ID)).textContent = inv[x].count
            } else {
                inv[x].count += count
                
                document.querySelector(("." + inv[x].ID)).textContent = inv[x].count

                return
            }
        }
    }

    
    while(count > 0){
        if (inv.length >= 36) {console.log("INVENTORY FULL"); return}

        let reqId = "id" + Math.round(Math.random()*1e5) + "" + Date.now()
        
        let invel = document.createElement("div")
        invel.className = reqId
        invel.style.backgroundImage = "url(textures/" + item + ".png)"
        invel.style.backgroundSize = "64px"
        invel.style.width = "64px"
        invel.style.height = "64px"
        invel.style.margin = "4px"
        invel.title = item
        invel.onclick = function(){invrem(item, 1)}
            
        if (count > itemconfig[item].stack){
            invel.textContent = itemconfig[item].stack
            if (itemconfig[item].hp != null){
                invel.textContent = itemconfig[item].hp
            }
            inventory.appendChild(invel)

            let newItem = {"item": item, "count": itemconfig[item].stack, "ID": reqId}
            if (itemconfig[item].hp != null){
                newItem.hp = itemconfig[item].hp
            }
            inv.push(newItem)
            count -=itemconfig[item].stack
        } else {
            invel.textContent = count
            if (itemconfig[item].hp != null){
                invel.textContent = itemconfig[item].hp
            }
            inventory.appendChild(invel)
            let newItem = {"item": item, "count": count, "ID": reqId}
            if (itemconfig[item].hp != null){
                newItem.hp = itemconfig[item].hp
            }
            inv.push(newItem)
            count = 0
        }
    }
}

function invrem(item, count){
    let splicelist = []
    for (let x = 0; x < inv.length; x++){
        if (item == inv[x].item){
            if (inv[x].count - count < 1){
                document.querySelector(("." + inv[x].ID)).remove()
                splicelist.push(x)
            } else {
                inv[x].count -= count
                
                document.querySelector(("." + inv[x].ID)).textContent = inv[x].count
                return
            }
        }
    }
    for (let x = 0; x < splicelist.length; x++){
        inv.splice(splicelist[x], 1)
    }
}

function invcheck(item){
    let fullcount = 0
    for (let x = 0; x < inv.length; x++){
        if (item == inv[x].item){
            fullcount += inv[x].count
        }
    }
    return fullcount
}

function damage(item, dmg){
    let splicelist = []
    for (let x = 0; x < inv.length; x++){
        if (item == inv[x].item && dmg != 0){
            inv[x].hp -= dmg
            dmg = 0
            document.querySelector(("." + inv[x].ID)).textContent = inv[x].hp
            if (inv[x].hp < 1){
                document.querySelector(("." + inv[x].ID)).remove()
                splicelist.push(x)
            }
        }
    }
    for (let x = 0; x < splicelist.length; x++){
        inv.splice(splicelist[x], 1)
    }
}