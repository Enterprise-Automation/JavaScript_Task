const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const todo_test = require('./todo.js');
const prompts = require('prompts');
const fs = require('fs');
const assert = require('assert');
const sinon = require('sinon');

describe("Create New CSV", function() {
    it('Should Create New CSV File In data_store Folder', async () => {
        const csvWriters = createCsvWriter({
            path: "data_store/tst_data.csv",
            header: [
                {id: 'Tst1', title: 'TSTa'},
                {id: 'Tst2', title: 'TSTb'},
                {id: 'Tst3', title: 'TSTc'},
                {id: 'todo_task', title: 'TODO_TASK'}
        ]});
        const records = [
            {id: 0, Tst1: 'a', Tst2: 'a', tTst3: 'a'},
            {id: 1, Tst1: 'b', Tst2: 'b', tTst3: 'b'},
            {id: 2, Tst1: 'c', Tst2: 'c', tTst3: 'c'},
        ];
        await todo_test.create_csv(csvWriters,records)
        const fileExists = fs.existsSync("data_store/tst_data.csv");
        assert.strictEqual(fileExists, true, 'File Created');
    });
        
});

describe('fileExists', function() {
    it('Should Return True If File Exists', function() {
        const filePath = 'test.csv';
        fs.writeFileSync(filePath, 'Test content');
        const result = todo_test.fileExists(filePath);
        assert.strictEqual(result, true);
        fs.unlinkSync(filePath);
    });
    it('should return false if file does not exist', function() {
        const result = todo_test.fileExists('non_existing_file.txt');
        assert.strictEqual(result, false);
    });
});
describe("add_username function", () => {
    it('Should Allow And Collect Username Data And As String', async () => {
        prompts.inject(["William22422"])
        const result = await todo_test.add_username();
        assert.strictEqual(typeof result, 'string');
        assert.strictEqual(result, 'William22422');
    });
});
describe("add_sector function", () => {
    it('Should Allow And Collect Sector Data And As String', async () => {
        prompts.inject(["Tesco"])
        const result = await todo_test.add_sector();
        assert.strictEqual(typeof result, 'string');
        assert.strictEqual(result, 'Tesco');
    });
});
describe("add_task function", () => {
    it('Should Allow And Collect Task Data And As String', async () => {
        prompts.inject(["Purchase Eggs"])
        const result = await todo_test.add_task();
        assert.strictEqual(typeof result, 'string');
        assert.strictEqual(result, 'Purchase Eggs');
    });
});
describe("add_duedate function", () => {
    it('Should Allow And Collect Due Date Data And As String', async () => {
        prompts.inject(new Date('2026-11-11'));
        const result = await todo_test.add_duedate();
        assert.strictEqual(typeof result, 'string');
    });
});
describe("add_priority function", () => {
    it('Should Allow And Collect Priority Data And As String', async () => {
        prompts.inject(['HIGH'])
        const result = await todo_test.add_priority();
        assert.strictEqual(result, 'HIGH');
        assert.strictEqual(typeof result, 'string');
    });
});
describe('create_record function', () => {
    it('should append record to file', async () => {
        const { expect } = await import('chai');
        await todo_test.create_record({
            user_id: '50',
            username: 'jimmy',
            sector: 'tester',
            task: 'sdsadkhjdskhjsdkhj',
            creation_date: '11-11-2026',
            duedate: '11-11-2027',
            priority: 'HIGH',
            overdue: 'no'
        });
        const fileread = fs.readFileSync("data_store/todo_data.csv", "utf8");
        expect(fileread).to.contain('50,jimmy,tester,sdsadkhjdskhjsdkhj,11-11-2026,11-11-2027,HIGH,no');
    });
});

describe("input_id function", () => {
    it('Should Allow And Collect ID For Deletion Data And As Number', async () => {
        prompts.inject([6])
        const result = await todo_test.input_id();
        assert.strictEqual(result, 6);
        assert.strictEqual(typeof result, 'number');
    });
});











