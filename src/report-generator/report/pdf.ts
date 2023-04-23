import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { SharedVar } from '../global/shared-var';
import { HandleReport } from '../util/handle-report';
import { ImageDimensions } from '../util/image-dimensions';
import MyEventEmitter from '../util/my-event-emitter';

/**
 * @author Carlos Eduardo Dias Batista
 * @class PegasusPDF
 * @description
 * The PegasusPDF class provides a static method reportPDF that receives a
 * Generator Function stream and converts it to a PDF file. It allows the user to
 * configure options such as the image to be added to the PDF, the number
 * of rows to be included in each page, and the name of the report.
 * The progress of the conversion process can also be monitored by listening to
 * the 'progress' event using the MyEventEmitter class.
 */
export class PegasusPDF {
    /**
     * @param payload An AsyncGenerator containing the data to be used for generating the report.
     * @param filterImage (optional) An image filter to be added to the report.
     * @param cut (optional) A number used for determining when to break the data into a new table in the report.
     * @param reportName (optional) A string used for naming the report file.
     * @param columns (optional) An array of column names to be used in the report.
     * @param qttFilePicker (optional) A number used for determining the number of files to generate if the report is split into multiple files.
     * @returns Promise<void>
     * @description
     * Receives an AsyncGenerator, an image filter, a cut value, a report name,
     * columns array and a quantity file picker, then generates a PDF report from the data received.
     */
    static async reportPDF(payload: AsyncGenerator<any, any, unknown>, filterImage: any, cut: number, reportName: string = 'report', columns: any[] = [], qttFilePicker: number = 1): Promise<void> {
        let item = 0;
        let isImageAdded = false;
        let newHandle = await HandleReport.getHandle(reportName, 'PDF', qttFilePicker);
        SharedVar.getInstance().data.pause = false;
        let writableStream = await newHandle.createWritable();
        const { height, width } = await ImageDimensions.get(filterImage);
        let writableClose = false;
        let rows: any = [];

        const didDraw = (data: any, doc: any) => {
            if (isImageAdded) return;
            doc.addImage(filterImage, 'PNG', data.settings.margin.left, 15, width / 4, height / 4);
            isImageAdded = true;
        };

        const closeStream = async () => {
            const tableConfig: Partial<UserOptions> = {
                head: [columns],
                body: rows,
                startY: height / 3 + (filterImage ? height / 15 : 0),
                headStyles: {
                    fillColor: [0, 0, 0],
                    textColor: [255, 255, 255]
                }
            };
            let doc: any = new jsPDF({
                putOnlyUsedFonts: true,
                orientation: 'landscape'
            });
            autoTable(doc, {
                ...tableConfig,
                didDrawPage: (data: any) => didDraw(data, doc)
            });
            writableStream.write(doc.output('arraybuffer'));
            writableStream.close().catch((err: any) => console.error(err));
            writableClose = true;
            isImageAdded = false;
            doc = null;
        };

        const resetStream = async () => {
            newHandle = await HandleReport.getHandle(reportName, 'PDF', qttFilePicker);
            SharedVar.getInstance().data.pause = false;
            writableStream = await newHandle.createWritable();
            rows = [];
            writableClose = false;
        };

        for await (const chunk of payload) {
            item++;
            if (chunk === null) break;
            if (item % cut === 0) {
                rows.push(Object.values(chunk));
                if (!writableClose) await closeStream();
            } else {
                if (writableClose) await resetStream();
                rows.push(Object.values(chunk));
            }
            MyEventEmitter.dispatchEvent('progress', { progress: item });
        }
        if (!writableClose) {
            await closeStream();
            rows = [];
        }
    }
}

export default PegasusPDF;
