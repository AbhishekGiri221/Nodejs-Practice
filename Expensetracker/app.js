const fs = require('fs/promises');
const EventEmitter = require("events");

const emitter = new EventEmitter();

async function getExpense() {
    const expenses = await fs.readFile("expenses.json","utf-8");

    if (expenses.trim() === ""){
        return [];
    }

    return JSON.parse(expenses);
}

const command = process.argv[2]
const name = process.argv[3];
const amount = process.argv[4];
const category = process.argv[5];
const date = new Date().toISOString().split("T")[0];


console.log(`${command} ${name} ${amount} ${category} ${date}`);

emitter.on("add",async()=>{
    const getPreviousData = await getExpense();
    const data = {
        id : getPreviousData.length+1,
        name : name,
        amount : amount,
        category : category,
        date : date,
    }

    getPreviousData.push(data);

    await fs.writeFile("./expenses.json",JSON.stringify(getPreviousData,null,2));

    console.log("expense added successfully");
    
})
emitter.emit(command)


// note : if fs is not imported as promise then it will throw error to use await with the fs read or write