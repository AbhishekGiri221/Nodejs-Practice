const fs = require('fs/promises');
const EventEmitter = require("events");
const { emit } = require('process');

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
    
});

emitter.on("list",async()=>{
    const getPreviousData = await getExpense();

    getPreviousData.forEach((data)=>{
        console.log(`name : ${data.name}`);
        console.log(`date : ${data.date}`);
        console.log(`amount : ${data.amount} \n`);
    });
});

emitter.on("delete",async ()=>{
    // note : process.argv always gives string 
    const id = Number(process.argv[3]);

    const getPreviousData = await getExpense();

    const newData = getPreviousData.filter((data)=> data.id !== id);

    await fs.writeFile("./expenses.json",JSON.stringify(newData,null,2));
    console.log("Expenses deleted successfully");

})


emitter.on("search",async()=>{
    const getPreviousData = await getExpense();
    const category = process.argv[3]
    const fitlteredExpenses = getPreviousData.filter((data) => data.category === category)

    fitlteredExpenses.forEach((data)=>{
        console.log(`${data.name} - ${data.amount}`);
    })
})


emitter.on("total",async()=>{
    const getPreviousData = await getExpense();

    const total = getPreviousData.reduce((sum, data)=>{
        return sum + Number(data.amount);
    },0);

    console.log(`total spent : ${total}`);
});

emitter.on("update",async ()=>{
    const getPreviousData = await getExpense();
    const id  = process.argv[3];
    const name = process.argv[4];
    const amount = process.argv[5];
    const category = process.argv[6];

    const data = getPreviousData.find(d => d.id == Number(id));


    data.name = name;
    data.amount = amount;
    data.category = category;

    await fs.writeFile("./expenses.json",JSON.stringify(getPreviousData,null,2));
});

emitter.emit(command)


// note : if fs is not imported as promise then it will throw error to use await with the fs read or write