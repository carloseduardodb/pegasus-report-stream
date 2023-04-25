import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'assert';
import SharedVar from '../report-generator/global/shared-var';

describe('SharedVar', () => {
    let sharedVar: SharedVar;

    beforeEach(() => {
        sharedVar = SharedVar.getInstance();
    });

    afterEach(() => {
        // Reset sharedVar instance after each test
        sharedVar.data.pause = false;
        sharedVar.data.count = 0;
        sharedVar.data.filePicker = [];
    });

    it('should create a singleton instance of SharedVar class', () => {
        const sharedVar2 = SharedVar.getInstance();
        assert.equal(sharedVar, sharedVar2);
    });

    it('should set and get pause property', () => {
        sharedVar.data.pause = true;
        assert.equal(sharedVar.data.pause, true);
    });

    it('should set and get count property', () => {
        sharedVar.data.count = 10;
        assert.equal(sharedVar.data.count, 10);
    });

    it('should set and get filePicker property', () => {
        sharedVar.data.filePicker = [{ name: 'file1' }, { name: 'file2' }];
        assert.deepEqual(sharedVar.data.filePicker, [{ name: 'file1' }, { name: 'file2' }]);
    });
});
