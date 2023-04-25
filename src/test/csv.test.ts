import { describe, it } from 'node:test';
import PegasusCSV from '../report-generator/report/csv';
import assert from 'assert';

describe('PegasusCSV', () => {
    describe('#convertToCSV()', () => {
        it('should convert object to CSV initial', () => {
            const data = {
                id: 1,
                name: 'John Doe',
                age: 30
            };
            const expected = '\n"1","John Doe","30"';
            const actual = PegasusCSV.convertToCSV(data, [], true);
            assert.strictEqual(actual, expected);
        });
        it('should convert object to CSV default', () => {
            const data = {
                id: 1,
                name: 'John Doe',
                age: 30
            };
            const expected = '"1","John Doe","30"';
            const actual = PegasusCSV.convertToCSV(data, ['id', 'name', 'age'], false);
            assert.strictEqual(actual, expected);
        });
    });
});
