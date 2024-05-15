module.exports = {create_csv, fileExists, add_username, add_sector, add_task, add_duedate, add_priority, create_record, input_id, to_csv, is_record_overdue, file_check}

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser')
const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const { parse } = require('json2csv');
const prompts = require('prompts');

let id = 0
const inputCsvJson = [];
let modifiedCsvJson = [];
const pth = "data_store/todo_data.csv"

const csvWriter = createCsvWriter({
    path: pth,
    header: [
        {id: 'id', title: 'ID'},
        {id: 'user_username', title: 'USER_USERNAME'},
        {id: 'user_sector', title: 'USER_SECTOR'},
        {id: 'todo_task', title: 'TODO_TASK'},
        {id: 'todo_creation_date', title: 'TODO_CREATION_DATE'},
        {id: 'todo_due_date', title: 'TODO_DUE_DATE'},
        {id: 'todo_priority', title: 'TODO_PRIORITY'},
        {id: 'todo_overdue', title: 'TODO_OVERDUE'}
    ]
});


async function file_check(){
    if (fileExists(pth) == false){
        await create_csv()
    }
    col(pth);
}

function fileExists(pth){
    try{
        fs.accessSync(pth, fs.constants.F_OK)
        return true;
    }
    catch (err){
        return false;
    }
}

function col(pth){
    let lastrow = null;
    fs.createReadStream(pth)
        .pipe(csv())
        .on('data', (row) => {
        lastRow = row;
    })
    .on('end', () => {
        const variable = lastRow ? lastRow['ID'] :null
        id = Number(variable)
        menu();
    })
}

async function create_csv(){
    const date_now = new Date().toISOString().split('T')[0];
    const records = [
        {id: 0, user_username: 'a', user_sector: 'a', todo_task: 'a', todo_creation_date: 'a', todo_due_date: 'a', todo_priority: "a", todo_overdue: "a" },
        {id: 1, user_username: 'william22422', user_sector: 'Full Stack Development', todo_task: 'Something Bad', todo_creation_date: date_now, todo_due_date: '01-01-2077', todo_priority: "HIGH", todo_overdue: "no" },
        {id: 2, user_username: 'thomas44244', user_sector: 'Devops Engineer', todo_task: 'Something Good', todo_creation_date: date_now, todo_due_date: '02-02-2077', todo_priority: "LOW", todo_overdue: "no" }
    ];
    await csvWriter.writeRecords(records)
}

async function menu() {
    await is_record_overdue();
    const response = await prompts({
        type: 'select',
        name: 'menuchoice',
        message: 'Please Choose A Function',
        choices: [
            { title: 'View All Records', value: view_all },
            { title: 'View Filtered Records', value: filter_view },
            { title: 'Add A New ToDo Record', value: add_record },
            { title: 'Edit A ToDo Record', value: edit_record },
            { title: 'Delete A ToDo Record', value: delete_record },
            { title: 'Exit Program', value: system_shutdown },
        ],
    });
    let csv_json = await to_json();
    await response.menuchoice(csv_json); // Print the user's choice

    await menu();
}

async function add_record() {
    let data_to_add = {};
    data_to_add.user_id = (id + 1);
    data_to_add.username = await add_username();
    data_to_add.sector = await add_sector();
    data_to_add.task = await add_task();
    var creation_date = new Date().toISOString().split('T')[0];
    data_to_add.creation_date = creation_date.split("-").reverse().join("-");
    var duedate = await add_duedate();
    data_to_add.duedate = duedate.split("-").reverse().join("-");
    data_to_add.priority = await add_priority();
    data_to_add.overdue = "no";
    id = (id + 1)
    create_record(data_to_add);
}

async function add_username(){
    const my_prompt = await prompts({
        type: 'text',
        name: 'username',
        message: 'Please Enter A Username',
        validate: value => value.trim() === '' ? 'Username cannot be blank' : true
    });
    return my_prompt.username;
}

async function add_sector(){
    const my_prompt = await prompts({
        type: 'text',
        name: 'sector',
        message: 'Please Enter Your Sector',
        validate: value => value.trim() === '' ? 'Sector cannot be blank' : true
    });
    return my_prompt.sector;
}

async function add_task(){
    const my_prompt = await prompts({
        type: 'text',
        name: 'task',
        message: 'Please Enter Your ToDo Task',
        validate: value => value.trim() === '' ? 'Task cannot be blank' : true
    });
    return my_prompt.task;
}

async function add_duedate(){
    const my_prompt = await prompts({
        type: 'date',
        name: 'duedate',
        message: 'Please Enter Your ToDo Due Date',
        format: date => date.toISOString().slice(0, 10),
        validate: date => date < Date.now() ? 'Due Date Cannot Be Set Before Today' : true
    });
    console.log(my_prompt.duedate)
    return my_prompt.duedate;
}

async function add_priority() {
    const my_prompt = await prompts({
        type: 'select',
        name: 'priority',
        message: 'Please Enter Your ToDo Priority',
        choices: [
            { title: 'HIGH', value: 'HIGH' },
            { title: 'MEDIUM', value: 'MEDIUM' },
            { title: 'LOW', value: 'LOW' },
        ]
    });
    return my_prompt.priority;
}

async function create_record(data_to_add){
    const record = `${data_to_add.user_id},${data_to_add.username},${data_to_add.sector},${data_to_add.task},${data_to_add.creation_date},${data_to_add.duedate},${data_to_add.priority},${data_to_add.overdue}\n`
    fs.appendFileSync(pth, record, function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    });
}

async function delete_record() {
    let csv_json = await to_json();
    if (csv_json !== "Error Converting CSV To Json"){
        if (csv_json.length > 1) {
            let delete_by_id = await input_id()
            let does_exist = await anything_exists(delete_by_id, "ID", csv_json)
            if (does_exist !== "No Records Such As That Exist"){
                const filteredData = csv_json.filter(item => {
                    const itemID = item['ID']
                    return parseInt(itemID) !== delete_by_id;
                });
                await to_csv(filteredData);
            }
            else{
                console.log(does_exist)
            }
        }
        else {
            console.log("No Records To Delete");
        }
    }
    else{
        console.log(csv_json)
    }
}

async function input_id(){
    const my_prompt = await prompts({
        type: 'number',
        name: 'id',
        message: 'Please Enter The ID Of The Record You Want Deleted',
        validate: value => value === '' || value === 0 ? 'ID cannot be Null' : true
    });
    return my_prompt.id;
}


async function edit_record() {
    let csv_json = await to_json();
    if (csv_json !== "Error Converting CSV To Json") {
        if (csv_json.length > 1){
            let edited = false;
            let result = await edit_idents(csv_json);
            if (typeof result === 'object') {
                let { identcolumns, identvalues } = result;
                let { cols_to_edit, edit_vals } = await edit_vars();
                let idntcol = identcolumns;
                let idntval = identvalues;

                const edits = (csv_json, idntcol, idntval, cols_to_edit, edit_vals) => {
                    for (let i = 0; i < csv_json.length; i++){
                        if (csv_json[i][idntcol] == idntval){
                            csv_json[i][cols_to_edit] = edit_vals;
                            edited = true;
                        }
                    }
                    return edited;
                };
               
                const my_new_edit = await edits(csv_json, idntcol, idntval, cols_to_edit, edit_vals);
                await to_csv(csv_json)
            }
            else{
                console.log(result)
            }
        }
        else{
            console.log("No Records To Edit");
        }
    }
    else{
        console.log(csv_json)
    }
}


async function edit_idents(csv_json) {
    const identcolumn = await prompts({
        type: 'select',
        name: 'identcols',
        message: 'Please Enter How You Want To Filter Through The Database',
        choices: [
            { title: 'ID', value: 'ID' },
            { title: 'USER_USERNAME', value: 'USER_USERNAME' },
            { title: 'USER_SECTOR', value: 'USER_SECTOR' },
            { title: 'TODO_TASK', value: 'TODO_TASK' }
        ]
    });
    const identval = await prompts({
        type: 'text',
        name: 'ident',
        message: `Enter The Value Of ${identcolumn.identcols} You Would Want To Edit`,
        validate: value => value.trim() === '' ? 'Username cannot be blank' : true
    });
    var idents_exist = await anything_exists(identval.ident, identcolumn.identcols, csv_json)
    if (idents_exist === true){
        return {
            identcolumns: identcolumn.identcols,
            identvalues: identval.ident
        };
    }
    else{
        console.log(idents_exist)
        return idents_exist
    }
}

async function edit_vars() {
    const columns_to_edit = await prompts({
        type: 'select',
        name: 'columnsedit',
        message: 'Please Select The Column You Want To Edit',
        choices: [
            { title: 'USER_SECTOR', value: "USER_SECTOR" },
            { title: 'TODO_TASK', value: "TODO_TASK" },
            { title: 'TODO_DUE_DATE', value: "TODO_DUE_DATE" },
            { title: 'TODO_PRIORITY', value: "TODO_PRIORITY" }
        ],
    });
    let edit_val;
    switch(columns_to_edit.columnsedit){
        case "USER_SECTOR":
            edit_val = await add_sector();
            break;
        case "TODO_TASK":
            edit_val = await add_task();
            break;
        case "TODO_DUE_DATE":
            edit_val = await add_duedate();
            break;
        case "TODO_DUE_DATE":
            edit_val = await add_priority();
            break;
    }
    return {
        cols_to_edit: columns_to_edit.columnsedit,
        edit_vals: edit_val
    };
}

async function filter_view() {
    let csv_json = await to_json();
    if (csv_json !== "Error Converting CSV To Json") {
        if (csv_json.length > 1){
            let { cols_to_filter, filter_choice, filter_type } = await filter_column();
            if (filter_type === "Basic"){
                var filtered_json_data = await basic_filter(cols_to_filter, filter_choice)
                if (filtered_json_data !== "No Records Such As That Exist"){
                    await view_all(filtered_json_data)
                }
                else{
                    console.log(filtered_json_data)
                }
            }
            else{
                var filtered_json_data = await advanced_filter(cols_to_filter, filter_choice)
                if (filtered_json_data !== "No Records Such As That Exist" || filtered_json_data !== "No Records Found Before Date" || filtered_json_data !== "No Records Found After Date"){
                    await view_all(filtered_json_data)
                }
                else{
                    console.log(filtered_json_data)
                }
            }
        }
        else{
            console.log("No Records To View");
        }
    }
    else{
        console.log(csv_json)
    }
}

async function filter_column() {
    const columns_to_filter = await prompts({
        type: 'select',
        name: 'columnsfilter',
        message: 'Please Select The Column You Want To Filter From',
        choices: [
            { title: 'ID', value: "ID" },
            { title: 'USER_USERNAME', value: "USER_USERNAME" },
            { title: 'USER_SECTOR', value: "USER_SECTOR" },
            { title: 'TODO_CREATION_DATE', value: "TODO_CREATION_DATE" },
            { title: 'TODO_DUE_DATE', value: "TODO_DUE_DATE" },
            { title: 'TODO_PRIORITY', value: "TODO_PRIORITY" },
            { title: 'TODO_OVERDUE', value: "TODO_OVERDUE" }
        ],
    });
    let filterchoice;
    let filterType;
    switch(columns_to_filter.columnsfilter){
        case "ID":
            filterchoice = 0;
            filterType = "Basic";
            break;
        case "USER_USERNAME":
            filterchoice = 1;
            filterType = "Basic";
            break;
        case "USER_SECTOR":
            filterchoice = 2;
            filterType = "Basic";
            break;
        case "TODO_CREATION_DATE":
            filterchoice = 3;
            filterType = "Advanced";
            break;
        case "TODO_DUE_DATE":
            filterchoice = 4;
            filterType = "Advanced";
            break;
        case "TODO_PRIORITY":
            filterchoice = 5;
            filterType = "Basic";
            break;
        case "TODO_OVERDUE":
            filterchoice = 6;
            filterType = "Basic";
            break;
    }
    return {
        cols_to_filter: columns_to_filter.columnsfilter,
        filter_choice: filterchoice,
        filter_type: filterType
    };
}

async function basic_filter(cols_to_filter, filter_choice){
    const filter_oper = await prompts({
        type: 'select',
        name: 'filterOps',
        message: `Please Choose How You Want To Filter ${cols_to_filter}`,
        choices: [
            { title: `You only Want To View Records With Your Selected ${cols_to_filter}`, value: filter_equals },
            { title: `You Want To View All Records Without Your Selected ${cols_to_filter}`, value: filter_notequals },
        ],
    });
    var filtered_json = await filter_oper.filterOps(cols_to_filter);
    return filtered_json
}

async function advanced_filter(cols_to_filter, filter_choice){
    const filter_oper = await prompts({
        type: 'select',
        name: 'filterOps',
        message: `Please Choose How You Want To Filter ${cols_to_filter}`,
        choices: [
            { title: `You only Want To View Records With Your Selected ${cols_to_filter}`, value: filter_equals },
            { title: `You Want To View All Records Without Your Selected ${cols_to_filter}`, value: filter_notequals },
            { title: `You Only Want To View Logs Before ${cols_to_filter}`, value: filter_before },
            { title: `You Only Want To View Logs After ${cols_to_filter}`, value: filter_after },
        ],
    });
    var filtered_json = await filter_oper.filterOps(cols_to_filter);
    return filtered_json
}

async function filter_equals(cols_to_filter){
    const my_filter_equals = await prompts({
        type: 'text',
        name: 'eqls',
        message: `Please Select A ${cols_to_filter} You Want To View`,
        validate: value => value.trim() === '' ? `${cols_to_filter} cannot be blank` : true
    });
    let csv_json = await to_json();
    var filter_exist = await anything_exists(my_filter_equals.eqls, cols_to_filter, csv_json)
    if (filter_exist === true){
        var jsonFilter = csv_json.filter(item => item[cols_to_filter] === my_filter_equals.eqls)
        return jsonFilter
    }
    else{
        console.log(filter_exist)
        return filter_exist
    }
}

async function filter_notequals(cols_to_filter){
    const my_filter_notequals = await prompts({
        type: 'text',
        name: 'noteqls',
        message: `Please Select A ${cols_to_filter} You Want To View`,
        validate: value => value.trim() === '' ? `${cols_to_filter} cannot be blank` : true
    });
    let csv_json = await to_json();
    var filter_exist = await anything_exists(my_filter_notequals.noteqls, cols_to_filter, csv_json)
    if (filter_exist === true){
        var jsonFilter = csv_json.filter(item => item[cols_to_filter] !== my_filter_notequals.noteqls)
        return jsonFilter
    }
    else{
        console.log(filter_exist)
        return filter_exist
    }
}

async function filter_before(cols_to_filter) {
    const my_filter_bfr = await prompts({
        type: 'date',
        name: 'bfr',
        message: `Please Select A Date To Only Show ${cols_to_filter} Before Your Selected Date`,
        initial: new Date(),
        format: date => date.toISOString().slice(0, 10)
    });

    let csv_json = await to_json();
    let date_filter_value = new Date(my_filter_bfr.bfr).toISOString().slice(0, 10);

    let new_filtered_data = csv_json.filter(item => {
        const compdate = item[cols_to_filter];
        return new Date(compdate) < new Date(date_filter_value);
    });

    if (new_filtered_data.length !== "") {
        console.log(new_filtered_data)
        return new_filtered_data;
    } else {
        return `No Records Found Before Date`;
    }
}


async function filter_after(cols_to_filter) {
    const my_filter_aft = await prompts({
        type: 'date',
        name: 'aft',
        message: `Please Select A Date To Only Show ${cols_to_filter} After Your Selected Date`,
        initial: new Date(),
        format: date => date.toISOString().slice(0, 10)
    });

    let csv_json = await to_json();
    let date_filter_value = new Date(my_filter_aft.aft).toISOString().slice(0, 10);

    let new_filtered_data = csv_json.filter(item => {
        const compdate = item[cols_to_filter];
        return new Date(compdate) > new Date(date_filter_value);
    });

    if (new_filtered_data.length !== "") {
        return new_filtered_data;
    } else {
        return `No Records Found After Date`;
    }
}


async function view_all(csv_json) {
        if (csv_json.length > 0){
            csv_json.sort((a,b) => {
                if (a.USER_USERNAME < b.USER_USERNAME) return - 1;
                if (a.USER_USERNAME > b.USER_USERNAME) return 1;
                return new Date(a.TODO_DUE_DATE - new Date(b.TODO_DUE_DATE))
            })
            csv_json.forEach(record => {
                if (record.ID === "0"){
                    return;
                }
                if (record.TODO_PRIORITY === "HIGH") {
                    txtcol = "\x1b[31m";
                }
                else if (record.TODO_PRIORITY === "MEDIUM") {
                    txtcol = "\x1b[33m";
                }
                else {
                    txtcol = "\x1b[32m";
                }
                console.log(`${txtcol}TODO_ID: ${record.ID}\nUsername: ${record.USER_USERNAME}\n\nUser Sector: ${record.USER_SECTOR}\n\nToDo Task Body: ${record.TODO_TASK}\nToDo Creation Date: ${record.TODO_CREATION_DATE}\nToDo Due Date: ${record.TODO_DUE_DATE}\nToDo Priority: ${record.TODO_PRIORITY}\nToDo OverDue?: ${record.TODO_OVERDUE}\n--------------------------------------\x1b[0m\n`)
            });
        }
        else{
            console.log("No Records To View");
        }
}

async function system_shutdown() {
    console.clear();
    console.log("Goodbye");
    process.exit();
}

async function to_json() {
    try{
        let json = await csvToJson.fieldDelimiter(',').getJsonFromCsv(pth);
        return json
    }
    catch(err){
        console.log(err)
        return("Error Converting CSV To Json")
    }
}

function anything_exists(selected_input, selected_column, csv_json){
    switch(selected_column){
        case "ID":
            num = 0;
            break;
        case "USER_USERNAME":
            num = 1;
            break;
        case "USER_SECTOR":
            num = 2;
            break;
        case "TODO_TASK":
            num = 3;
            break;
        case "TODO_CREATION_DATE":
            num = 4;
            break;
        case "TODO_DUE_DATE":
            num = 5;
            break;
        case "TODO_PRIORITY":
            num = 6;
            break;
        case "TODO_OVERDUE":
            num = 7;
            break;
    }

    if(selected_input.toString() == "0"){
        return "No Records Such As That Exist";
    }
    for (let i of csv_json){
        const j = Object.values(i)[num].split(',');
        if (j[0] === selected_input.toString()) {
        return true;
        }
    }
    return "No Records Such As That Exist";
}

async function to_csv(filteredData){
    try{
        const keys = Object.keys(filteredData[0]);
    
        const csvHeader = keys.join(',');
        const csvData = filteredData.map(obj =>
            keys.map(key => obj[key]).join(',')
        );
        const csvString = csvHeader + '\n' + csvData.join('\n') + '\n';;
    
        try{
            await fs.writeFileSync(pth, csvString);
        }
        catch (err) {
            console.log(err)
            return "Error Creating csv"
        }
    } catch (err){
        return "improperly formatted json"
    }
}

async function is_record_overdue(){
    let csv_json = await to_json();
    var date_now = new Date().toISOString().split('T')[0];
    date_now = date_now.split("-").reverse().join("-");

    csv_json.forEach(record => {
        var due_date = record.TODO_DUE_DATE
        if (due_date < date_now){
            record.TODO_OVERDUE = "yes";
        }
        else {
            record.TODO_OVERDUE = "no";
        }

        });
    await to_csv(csv_json);
}
