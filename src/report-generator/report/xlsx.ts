import * as Excel from 'exceljs';
import { SharedVar } from '../global/shared-var';
import { ImageDimensions } from '../util/image-dimensions';
import { HandleReport } from '../util/handle-report';
import MyEventEmitter from '../util/my-event-emitter';

/**
 * @author Carlos Eduardo Dias Batista
 * @class PegasusXLSX
 * @description Class that generates XLSX reports
 * @export PegasusXLSX
 */
export class PegasusXLSX {
    /**
     * @param refColumns - An array of column definitions for the Excel worksheet
     * @param filterImage - An optional image buffer to add to the worksheet
     * @returns An object containing the Excel workbook and worksheet
     * @description Creates an Excel workbook and worksheet with the given column definitions and optional image buffer
     */
    private static async getWorksheet(refColumns: any[] = [], filterImage: any) {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        const { height, width } = await ImageDimensions.get(filterImage);
        worksheet.mergeCells('A1:G1');
        if (filterImage) {
            const imageId = workbook.addImage({
                buffer: filterImage,
                extension: 'png'
            });
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                ext: { width, height }
            });
            worksheet.getRow(1).height = height - 50;
        }
        worksheet.getRow(3).values = refColumns.map((c) => c.header);
        worksheet.columns = refColumns;
        worksheet.spliceRows(4, 0, ['', '', '', '', '', '', '', '']);
        return { workbook, worksheet };
    }

    /**
     * @param payload - Async generator function that provides data to be written in the XLSX report.
     * @param filterImage - Buffer of the image to be added to the report.
     * @param cut - Optional parameter that specifies the number of rows to write in each sheet. Default value is 1.
     * @param reportName - Optional parameter that specifies the name of the report. Default value is 'report'.
     * @param refColumns - Optional parameter that specifies the reference columns of the report.
     * @param qttFilePicker - Optional parameter that specifies the number of file pickers. Default value is 1.
     * @returns void
     * @emits progress
     * @description
     * Receives a Generator Function and writes with data flow in the client's memory in real time.
     */
    static async reportXLSX(payload: AsyncGenerator<any, any, unknown>, filterImage: any, cut: number, reportName = 'report', refColumns: any[] = [], qttFilePicker: number = 1) {
        let item = 0;
        let newHandle = await HandleReport.getHandle(reportName, 'XLSX', qttFilePicker);
        SharedVar.getInstance().data.pause = false;
        let writableStream = await newHandle.createWritable();
        let writableClose = false;
        let { workbook, worksheet } = await this.getWorksheet(refColumns, filterImage);

        const writeAndCloseWorkbook = async () => {
            await workbook.xlsx.write(writableStream);
            await writableStream.close();
            writableClose = true;
        };

        const resetWorkbook = async () => {
            newHandle = await HandleReport.getHandle(reportName, 'XLSX', qttFilePicker);
            SharedVar.getInstance().data.pause = false;
            writableStream = await newHandle.createWritable();
            const ws = await this.getWorksheet(refColumns, filterImage);
            workbook = ws.workbook;
            worksheet = ws.worksheet;
            writableClose = false;
        };

        for await (const chunk of payload) {
            item++;
            if (chunk === null) break;
            if (item % cut === 0) {
                worksheet.addRow(chunk);
                if (!writableClose) await writeAndCloseWorkbook();
            } else {
                if (writableClose) await resetWorkbook();
                worksheet.getCell('A1').value = '';
                worksheet.addRow(chunk);
            }
            MyEventEmitter.dispatchEvent('progress', { progress: item });
        }

        if (!writableClose) {
            await writeAndCloseWorkbook();
        }
    }
}

export default PegasusXLSX;
