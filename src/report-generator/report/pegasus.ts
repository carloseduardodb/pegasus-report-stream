import * as Excel from 'exceljs';
import { SharedVar } from '../global/shared-var';
import { FilterImage } from '../util/filter-image';
import MyEventEmitter from '../util/my-event-emitter';
import { PegasusCSV } from './csv';
import PegasusPDF from './pdf';
import PegasusXLSX from './xlsx';

interface ReportType {
    name: string;
    stream: ReadableStreamDefaultReader<Uint8Array> | undefined;
    filters: Object;
    refColumns: Partial<Excel.Column>[];
    type: 'CSV' | 'XLSX' | 'PDF';
    closeByRegisterLimit: number;
    cut: number;
    qttFilePicker: number;
    delimiter: string;
}

/**
 * @author Carlos Eduardo Dias Batista
 * @class Pegasus
 * @description
 * This class is used to generate a report.
 * The report can be in CSV, XLSX or PDF format.
 */
export class Pegasus {
    /**
     * @function getCSV
     * @async
     * @param {ReportType} data - The report data to be exported to CSV
     * @returns {Promise<void>}
     * @description Generates a CSV report with the given report data
     */
    static async getCSV(data: ReportType): Promise<void> {
        const directKey = () => {
            return data.refColumns.map((column) => column.header);
        };
        const myDataGenerator = this.generateData(data);
        PegasusCSV.reportCSV(myDataGenerator, data.cut, data.name, directKey(), data.qttFilePicker);
    }

    /**
     * @description Generates a CSV report
     * @param {ReportType} data  - Data to be included in the report
     * @returns A promise that resolves to void
     */
    static async getXLSX(data: ReportType): Promise<void> {
        const filterImage = await FilterImage.generateImage(data.filters);
        const myDataGenerator = this.generateData(data);
        PegasusXLSX.reportXLSX(myDataGenerator, filterImage, data.cut, data.name, data.refColumns, data.qttFilePicker);
    }

    /**
     * @description Generates a PDF report from a data stream, based on the provided report type.
     * @param data The report type containing information about the data to be used.
     * @returns A Promise that resolves when the PDF report is generated.
     */
    static async getPDF(data: ReportType): Promise<void> {
        const directKey = () => {
            return data.refColumns.map((column) => column.header);
        };
        const filterImage = await FilterImage.generateImage(data.filters);
        const myDataGenerator = this.generateData(data);
        PegasusPDF.reportPDF(myDataGenerator, filterImage, data.cut, data.name, directKey(), data.qttFilePicker);
    }

    /**
     * @description Generates data from a data stream, interpreting them as JSONs, and sends them to an async generator.
     * @param stream The data stream to read from.
     * @param closeByRegisterLimit The limit of records to close the stream.
     * @param delimiter The delimiter used to separate the records.
     * @returns An async generator that will produce each JSON object read from the stream.
     **/
    static async *generateData({ stream, closeByRegisterLimit, delimiter }: ReportType): AsyncGenerator<any> {
        delimiter = '\n';
        const decoder = new TextDecoder();
        let enqueueInStream: any;
        let closeStream: any;
        let buffer = '';
        const streamable = new ReadableStream({
            start(controller) {
                enqueueInStream = function (data: any) {
                    controller.enqueue(data);
                };
                closeStream = function () {
                    controller.close();
                };
            }
        });

        const processChunk = async (chunk: any) => {
            buffer += decoder.decode(chunk);
            let jsonDelimiterIndex = buffer.indexOf(delimiter);

            while (jsonDelimiterIndex !== -1) {
                const jsonStr = buffer.slice(0, jsonDelimiterIndex);
                buffer = buffer.slice(jsonDelimiterIndex + 1);
                try {
                    const jsonObj = JSON.parse(jsonStr);
                    enqueueInStream(jsonObj);
                    if (SharedVar.getInstance().data.pause) {
                        SharedVar.getInstance().data.count++;
                        if (SharedVar.getInstance().data.count >= closeByRegisterLimit) {
                            stream?.cancel();
                            closeStream();
                        }
                    }
                } catch (error) {
                    console.error('Erro no parsing do JSON:', error);
                }
                jsonDelimiterIndex = buffer.indexOf('\n');
            }
        };

        const read: any = () => {
            if (!stream) return;
            return stream
                .read()
                .then(async ({ done, value }) => {
                    if (done) {
                        console.log('Todos os dados foram lidos.');
                        closeStream();
                        buffer = '';
                        return;
                    }
                    processChunk(value);
                    return read();
                })
                .catch((error) => {
                    console.error('Erro na leitura dos dados chunked:', error);
                });
        };

        read();

        const reader = streamable.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                yield null;
                break;
            }
            yield value;
        }
    }

    static async splitData(data: ReportType) {
        try {
            if (data.type === 'CSV') this.getCSV(data);
            if (data.type === 'XLSX') this.getXLSX(data);
            if (data.type === 'PDF') this.getPDF(data);
            return MyEventEmitter;
        } catch (error) {
            MyEventEmitter.dispatchEvent('error', error);
            console.log('Error in splitData', error);
        }
    }
}

export default Pegasus;
