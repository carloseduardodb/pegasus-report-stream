import { SharedVar } from '../global/shared-var';

/**
 * @author Carlos Eduardo Dias Batista
 * @class HandleReport
 * @description A class that handles the file picker.
 * This class is used to handle the file picker.
 */
export class HandleReport {
    /**
     * @description Returns an object with information about a file type.
     * @param {('XLSX' | 'PDF' | 'CSV')} fileType - The type of file to get information for.
     * @returns {Object} - An object describing the file type and its accepted MIME type and file extension.
     * @description: An object containing the description and accepted MIME types and file extensions for the file type.
     */
    static getType(fileType: 'XLSX' | 'PDF' | 'CSV'): object {
        switch (fileType) {
            case 'XLSX':
                return {
                    description: 'File XLSX',
                    accept: {
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                    }
                };
            case 'PDF':
                return {
                    description: 'File PDF',
                    accept: {
                        'application/pdf': ['.pdf']
                    }
                };
            case 'CSV':
                return {
                    description: 'Arquivo CSV',
                    accept: {
                        'text/csv': ['.csv']
                    }
                };
        }
    }

    /**
     * @description Returns a file handle for a file picker.
     * @param {string} reportName - The name of the report to be exported.
     * @param {('XLSX' | 'PDF' | 'CSV')} fileType - The type of file to be exported.
     * @param {number} qttFilePicker - The number of file pickers to be used.
     * @returns {Promise<any>} - A promise that resolves to a file handle.
     */
    static async getHandle(reportName: string, fileType: 'XLSX' | 'PDF' | 'CSV', qttFilePicker: number): Promise<any> {
        const win: any = window;
        SharedVar.getInstance().data.pause = true;
        if (SharedVar.getInstance().data.filePicker.length === 0)
            for (let index = 0; index < qttFilePicker; index++) {
                const generatedUUID = Math.random().toString(36).substring(2, 15);
                const fileName = reportName + '_' + generatedUUID;
                SharedVar.getInstance().data.filePicker.push(
                    await win.showSaveFilePicker({
                        suggestedName: `${fileName}.${fileType}`,
                        types: [this.getType(fileType)]
                    })
                );
            }
        return SharedVar.getInstance().data.filePicker.pop();
    }
}

export default HandleReport;
