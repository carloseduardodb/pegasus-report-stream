import html2canvas from 'html2canvas';

/**
 * @author Carlos Eduardo Dias Batista
 * @description This class is responsible for generating an image from the current state of the report.
 * @class FilterImage
 */
export class FilterImage {
    /**
     * @description Converts a given string to PascalCase format.
     * @param text - The string to be converted.
     * @returns The converted string in PascalCase format.
     */
    private static toPascalCase(text: string) {
        return `${text}`
            .toLowerCase()
            .replace(new RegExp(/[-_]+/, 'g'), ' ')
            .replace(new RegExp(/[^\w\s]/, 'g'), '')
            .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
            .replace(new RegExp(/\w/), (s) => s.toUpperCase());
    }

    /**
     * @description This function is responsible for generating the HTML that will be used in the header of the report.
     * @param reportFilters The filters used in the report.
     * @param filterTitle The title of the filter section.
     * @param additionalInfoTitle The title of the additional info section.
     * @param date The date to be displayed in the report.
     * @returns The HTML string that will be used in the header of the report.
     */
    private static async generateHTML(reportFilters: Object | any, filterTitle: string = 'FILTERS', additionalInfoTitle: string = 'ADDITIONAL INFO', date: Date = new Date()): Promise<string> {
        filterTitle = filterTitle.toUpperCase();
        additionalInfoTitle = additionalInfoTitle.toUpperCase();
        let html = '<div style="background-color: #111111; padding: 20px; display: flex; align-items: center; height: 100%;">';
        html += '<div style="width: 20%; height: 100%; margin-right: 20px;">';
        html += `<img src="https://raw.githubusercontent.com/carloseduardodb/public-storage-images/main/Pegasus.png" alt="Imagem da web" style="width: 100%; height: 100%;"/>`;
        html += '</div>';
        html += '<div style="flex: 1; margin-left: 20px; padding: 20px;">';
        html += `<h1 style="font-size: 15pt; margin-bottom: 20px;">${filterTitle}:</h1>`;
        for (const key in reportFilters) {
            if (reportFilters.hasOwnProperty(key)) {
                const valor = reportFilters[key];
                html += `<p style="margin: 10px 0; font-weight: bold;">${this.toPascalCase(key)}: ${valor}</p>`;
            }
        }
        html += '</div>';
        html += '<div style="flex: 1; margin-left: 20px;">';
        html += `<h1 style="font-size: 15pt; margin-bottom: 20px;">${additionalInfoTitle}:</h1>`;
        html += `<p style="margin: 10px 0; font-weight: bold;">Date: ${date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`;
        html += `<p style="margin: 10px 0; font-weight: bold;">Hour: ${date.toLocaleTimeString('pt-BR')}</p>`;
        html += '</div>';
        html += '</div>';
        return html;
    }

    /**
     * @description Generates an image from the current state of the report
     * @param {Object} reportFilters - The filters currently applied to the report
     * @param {string} [filterTitle] - The title of the filters section
     * @param {string} [additionalInfoTitle] - The title of the additional info section
     * @param {Date} [date] - The date to use
     * @returns {Promise<Buffer | null>}
     */
    static async generateImage(reportFilters: Object, filterTitle?: string, additionalInfoTitle?: string, date?: Date): Promise<any | Buffer> {
        const html = await this.generateHTML(reportFilters, filterTitle, additionalInfoTitle, date);
        const tempContainer = document.createElement('div');
        tempContainer.style.width = '1000px';
        tempContainer.style.height = '100%';
        tempContainer.style.color = '#ffffff';
        tempContainer.innerHTML = html;
        document.body.appendChild(tempContainer);
        return html2canvas(tempContainer, {
            logging: true,
            allowTaint: false,
            useCORS: true
        })
            .then((canvas) => {
                tempContainer.remove();
                return Buffer.from(canvas.toDataURL().split(',')[1], 'base64');
            })
            .catch((err) => {
                console.error(err);
                return null;
            });
    }
}

export default FilterImage;
