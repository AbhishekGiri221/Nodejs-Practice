// const fs = require('fs');
const fs = require("fs/promises");
const EventEmitter = require("events");


const emitter = new EventEmitter();

const command = process.argv[2];
const taskTitle = process.argv[3];


async function loadNotes() {
    const data = await fs.readFile("./notesList.json", "utf-8");

    if(data.trim() === ""){
        return [];
    }
    return JSON.parse(data);
}


emitter.on("add",async ()=>{
    const note = await loadNotes();
    const task = { title : taskTitle};

    note.push(task);

    try{
        await fs.writeFile("./notesList.json",JSON.stringify(note,null,2));
        console.log("task added sucessfully");
    }
    catch{
        console.log("error while writing the file");
    }
    
})
emitter.on("delete",async()=>{
    const note = await loadNotes();

    const updatedTask = note.filter((task)=>task.title !== taskTitle)

   try{
    await fs.writeFile("./notesList.json",JSON.stringify(updatedTask,null,2));
    console.log("successfully delted");
   }
   catch{
    console.log("error occured while deleting the task");
   }
})

emitter.on("show",async()=>{
    const note = await loadNotes();
    note.forEach(task => {
        console.log(task.title);
    });
})


emitter.emit(command);






