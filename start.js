const file_check = require('./todo.js');
var figlet = require("figlet");
const { exec } = require('child_process');
const prompts = require('prompts');
const fs = require('fs');

async function start_app(){
    exec('printf "\\e[8;$(tput cols);$(tput lines)t"'); 
    
    const txtcol_red = '\x1b[31m';
    const txtcol_yellow = '\x1b[33m';
    const reset_col = '\x1b[0m';

    txt_header = '========'
    txt_body = 'ToDo  Program!!!'
    txt_footer = '========';

    try {
        var header = await figlet.textSync(txt_header, { font: 'Doom' });
        var body =  await figlet.textSync(txt_body, { font: 'Doom' });
        var footer = await figlet.textSync(txt_footer, { font: 'Doom' });
        var col_fig_header = await `${txtcol_red}${header}${reset_col}`;6
        var col_fig_body = await  `${txtcol_yellow}\n${body}${reset_col}`;
        var col_fig_footer = await `${txtcol_red}${footer}${reset_col}`;
        console.log(col_fig_header + col_fig_body + col_fig_footer);
    } 
    catch (error) {
        console.error(error);
    }
    await press_enter();
    file_check.file_check();
}

async function press_enter(){
    const my_prompt = await prompts({
        type: 'text',
        name: 'enter',
        message: 'Press Enter To Start',
    });
    return my_prompt.sector;
}

start_app()

