const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const todo_test = require('./todo.js');
const prompts = require('prompts');
const fs = require('fs');
const assert = require('assert');
const sinon = require('sinon');
import { expect } from 'chai';

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

describe("to_csv function", () => {
    it('Should Allow The Creation Of CSV Strings From A Structured JSON Format And Write To CSV', async () => {
        const writeFileSyncStub = sinon.stub(fs, 'writeFileSync');

        const filteredData = [
            {id: 1, user_username: 'b', user_sector: 'b', todo_task: 'b', todo_creation_date: 'b', todo_due_date: 'b', todo_priority: "b", todo_overdue: "b"},
            {id: 2, user_username: 'c', user_sector: 'c', todo_task: 'c', todo_creation_date: 'c', todo_due_date: 'c', todo_priority: "c", todo_overdue: "c"},
            {id: 3, user_username: 'd', user_sector: 'd', todo_task: 'd', todo_creation_date: 'd', todo_due_date: 'd', todo_priority: "d", todo_overdue: "d"},
            {id: 4, user_username: 'e', user_sector: 'e', todo_task: 'e', todo_creation_date: 'e', todo_due_date: 'e', todo_priority: "e", todo_overdue: "e"},
            {id: 5, user_username: 'f', user_sector: 'f', todo_task: 'f', todo_creation_date: 'f', todo_due_date: 'f', todo_priority: "f", todo_overdue: "f"},
            {id: 6, user_username: 'g', user_sector: 'g', todo_task: 'g', todo_creation_date: 'g', todo_due_date: 'g', todo_priority: "g", todo_overdue: "g"},
            {id: 7, user_username: 'h', user_sector: 'h', todo_task: 'h', todo_creation_date: 'h', todo_due_date: 'h', todo_priority: "h", todo_overdue: "h"},
            {id: 8, user_username: 'i', user_sector: 'i', todo_task: 'i', todo_creation_date: 'i', todo_due_date: 'i', todo_priority: "i", todo_overdue: "i"},
            {id: 9, user_username: 'j', user_sector: 'j', todo_task: 'j', todo_creation_date: 'j', todo_due_date: 'j', todo_priority: "j", todo_overdue: "j"},
            {id: 10, user_username: 'k', user_sector: 'k', todo_task: 'k', todo_creation_date: 'k', todo_due_date: 'k', todo_priority: "k", todo_overdue: "k"},
            {id: 11, user_username: 'l', user_sector: 'l', todo_task: 'l', todo_creation_date: 'l', todo_due_date: 'l', todo_priority: "l", todo_overdue: "l"},
            {id: 12, user_username: 'm', user_sector: 'm', todo_task: 'm', todo_creation_date: 'm', todo_due_date: 'm', todo_priority: "m", todo_overdue: "m"},
            {id: 13, user_username: 'n', user_sector: 'n', todo_task: 'n', todo_creation_date: 'n', todo_due_date: 'n', todo_priority: "n", todo_overdue: "n"},
            {id: 14, user_username: 'o', user_sector: 'o', todo_task: 'o', todo_creation_date: 'o', todo_due_date: 'o', todo_priority: "o", todo_overdue: "o"},
            {id: 15, user_username: 'p', user_sector: 'p', todo_task: 'p', todo_creation_date: 'p', todo_due_date: 'p', todo_priority: "p", todo_overdue: "p"}
        ];
            await todo_test.to_csv(filteredData);
            expect(writeFileSyncStub.calledOnce).to.be.true;
            expect(writeFileSyncStub.firstCall.args[0]).to.be.a('string');

    });
});













