/**
 * @author Carlos Eduardo Dias Batista
 * @class ImageDimensions
 * @description
 * This class is used to get the dimensions of an image.
 */
export class ImageDimensions {
    /**
     * @param {Buffer} buffer
     * @returns {Promise<{ width: number; height: number; }>}
     * @description
     * Receives a buffer and returns the dimensions of the image.
     * The width and height of the image are returned.
     * The width and height are returned in a promise.
     * The promise is resolved when the image is loaded.
     * The promise is rejected when the image fails to load.
     * The promise is rejected when the image is not a valid image.
     * */
    static async get(buffer: Buffer): Promise<{
        width: number;
        height: number;
    }> {
        return new Promise((resolve, reject) => {
            const blob = new Blob([buffer], { type: 'image/png' });
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.addEventListener('load', () => {
                const width = img.width;
                const height = img.height;
                resolve({ width, height });
            });
            img.addEventListener('error', (error) => {
                reject(error);
            });
        });
    }
}

export default ImageDimensions;
