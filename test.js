function getByValue(map, searchValue, field) {
    // for (let [key, value] of map.entries()) {
    //     if (value[field] === searchValue)
    //         return value;
    // }
    let res = []
    for (let [key, value] of map.entries()) {
        let client = searchValue.find(x => x == value[field])
        if (client)
            res.push(client)
    }
    return res
}



const onlineGates = new Set(...companyUsers.map(x => x.gateway))
const clientToSend = getByValue(users, onlineGates, gateway)

let obj = {
    type: 'online',
    online: true
}
clientToSend.forEach(x => {
    x.send(JSON.stringify(obj))
})