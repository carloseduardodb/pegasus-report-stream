import { HandleReport } from '../util/handle-report';
import MyEventEmitter from '../util/my-event-emitter';

/**
 * @author Carlos Eduardo Dias Batista
 * @class PegasusCSV
 * @description
 * This class is used to convert a Readable stream to a CSV file.
 * The file is saved in the user's local storage.
 * The file name is the report name.
 * The file extension is .csv.
 * The file type is text/csv.
 * The file is saved in the root directory of the user's local storage.
 */
export class PegasusCSV {
    /**
     * @param data
     * @param columns
     * @param first
     * @returns string
     * @description
     * Receives an object and converts it to a CSV string.
     */
    static convertToCSV(data: object | any, columns: any[] = [], first: boolean = false): string {
        const rows = [];
        const keys = Object.keys(data);
        if (first) {
            const header = columns.join(',');
            rows.push(header);
        }
        const values = keys.map((key) => `"${data[key]}"`).join(',');
        rows.push(values);
        return rows.join('\n');
    }

    /**
     * @param payload - An AsyncGenerator that provides the data to be streamed.
     * @param writableStream - A writable stream to which the data is written.
     * @param cut (optional) - Not used in CSV.
     * @param columns (optional) - An array of strings that represent the columns of the CSV. If not provided, the default behavior is to use the keys of the first object of the payload as column names.
     * @returns void
     * @emits progress - An event that is emitted every time a chunk of data is written to the stream.
     * @description
     * Receives an AsyncGenerator that provides the data to be streamed, and a
     * writable stream to which the data is written in real-time, without fully
     * buffering it in memory. If columns are not provided, the default behavior
     * is to use the keys of the first object of the payload as column names.
     */
    static async feedStreamData(payload: AsyncGenerator<any, any, unknown>, writableStream: any, _: number, columns: any[] = []) {
        let i = 0;
        for await (const data of payload) {
            if (data === null) {
                writableStream.close();
                break;
            }
            let csvData = '';
            if (i === 0) {
                csvData = this.convertToCSV(data, columns, true);
            } else {
                csvData = this.convertToCSV(data);
            }
            if (typeof window !== 'undefined' && window.localStorage) {
                writableStream.write(csvData + '\n');
            } else {
                console.error('Armazenamento interno não suportado no ambiente de execução.');
            }
            i++;
            MyEventEmitter.dispatchEvent('progress', { progress: i });
        }
    }

    /**
     * This static async function generates a CSV report file from the given payload of data, and writes it to a new file using a handle obtained from the HandleReport class.
     *
     * @param payload An async generator that yields the data to be included in the CSV report.
     * @param cut (optional) The number of lines to include in each chunk of data written to the CSV file.
     * @param reportName (optional) The name of the report file to be created.
     * @param columns (optional) An array of column names to include in the CSV report.
     * @param qttFilePicker (optional) The number of files to allow the user to pick when selecting a file path to save the report.
     * @returns It doesn't return anything it just warns the reading event the amount of data read
     */
    static async reportCSV(payload: AsyncGenerator<any, any, unknown>, cut: number = 500, reportName = 'report', columns: any[] = [], qttFilePicker: number = 1): Promise<void> {
        try {
            const newHandle = await HandleReport.getHandle(reportName, 'CSV', qttFilePicker);
            const writableStream = await newHandle.createWritable();
            await this.feedStreamData(payload, writableStream, cut, columns);
        } catch (error) {
            console.error('Erro ao criar arquivo:', error);
        }
    }
}

export default PegasusCSV;
