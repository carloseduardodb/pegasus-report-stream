import { describe } from 'node:test';
import assert from 'assert';
import { it } from 'node:test';
import { HandleReport } from '../report-generator/util';

describe('getType', () => {
    it('should return object with correct file type information for XLSX', () => {
        const xlsxType = HandleReport.getType('XLSX');
        assert.equal(
            JSON.stringify(xlsxType),
            JSON.stringify({
                description: 'File XLSX',
                accept: {
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                }
            })
        );
    });

    it('should return object with correct file type information for PDF', () => {
        const pdfType = HandleReport.getType('PDF');
        assert.equal(
            JSON.stringify(pdfType),
            JSON.stringify({
                description: 'File PDF',
                accept: {
                    'application/pdf': ['.pdf']
                }
            })
        );
    });

    it('should return object with correct file type information for CSV', () => {
        const csvType = HandleReport.getType('CSV');
        assert.equal(
            JSON.stringify(csvType),
            JSON.stringify({
                description: 'Arquivo CSV',
                accept: {
                    'text/csv': ['.csv']
                }
            })
        );
    });
});
