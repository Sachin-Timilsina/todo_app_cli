/*
    todos CLI app with CRUD operations. 
    Libraries used: pg(Querying to PSQL Database) & commander(work with CLI in nodejs) 
*/
//Creates & Manages pools of connection to database.
const { Pool } = require('pg');

//Details of database from config.
const config = require('./config');

//Set up command line options
const program = require('commander');

//Create pool 
const pool = new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port
});

//Setup options.
program
    .version('1.0.0', '--version', 'Print the version of the application')
    .option('--new <task>', 'Add a new todo item, in task provide the todo.')
    .option('--list [filter]', 'List todo items, according to status provide true or false')
    .option('--done <id>', 'Mark a todo item as done, provide the id of todo')
    .option('--delete <id>', 'Delete a todo item, provide the id of todo')
    .option('--help', 'List all available options')
    .parse(process.argv);

const options = program.opts();

//CRUD Operations.
//Create Operation
const newTodo = async() => {
    try{
        const newTask = options.new; // Access the value directly from parsed options
    
        if (!newTask) {
          console.error('Error: --new <task> is required.');
          return;
        }
        const newQuery = 'INSERT INTO todos (task, status) VALUES ($1, $2)';
        const values = [newTask, false];

        await pool.query(newQuery, values);
        console.log('Data inserted successfully.');
    }catch(error){
        console.error('Error inserting data:', error);
    }
};
//Read Operation.
const listTodo = async() => {
    try {
        const listTask = options.list;
        const listQuery = `SELECT * FROM todos WHERE status = $1`;
        const result = await pool.query(listQuery, [listTask]);
        console.log('Selected Data: \n', result.rows);
    } catch (error) {
        console.error('Error selecting data:', error);
    }
};

//Update Operation.
const updateStatus = async() => {
    try {
        const updateTask = options.done;
        const updateQuery = 'UPDATE todos SET status = true WHERE id = $1';
        await pool.query(updateQuery, [updateTask]);
        console.log('Data updated successfully.');
    } catch (error) {
        console.error('Error updating data: ', error);
    }
};

//Delete Operation.
const deleteTodoItem = async () => {
    try {
        const deleteTask = options.delete;

        if (!deleteTask) {
            console.error('Error: --delete <id> is required.');
            return;
        }

        const deleteQuery = 'DELETE FROM todos WHERE id = $1';
        await pool.query(deleteQuery, [deleteTask]);
        console.log('Item successfully deleted.');
    } catch (error) {
        console.log('Error deleting item: ', error);
    }
};

function printVersion() {
    console.log('Todo App v1.0.0');
}

function helpOptions() {
    console.log(`
    --new <task>, 'Add a new todo item, in task provide the todo.\n
    --list [filter], 'List todo items, according to status provide true or false\n
    --done <id>, 'Mark a todo item as done, provide the id of todo\n
    --delete <id>, 'Delete a todo item, provide the id of todo\n
    --help, 'List all available options\n
    --version, 'Print the version of the application`);
}


if (options.new) {
    newTodo();
  } else if (options.list) {
    listTodo();
  } else if (options.done) {
    updateStatus();
  } else if (options.delete) {
    deleteTodoItem();
  } else if (options.version) { //Check if --version was not explicitely set.
    printVersion();
  } else if (options.help){
    helpOptions();
  } else {
    console.log('No valid options specified. Use --help for available options.');
  }

  //End the connection to database.
  pool.end();









