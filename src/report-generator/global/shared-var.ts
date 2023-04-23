/**
 * @class SharedVar
 */
export class SharedVar {
    private static instance: SharedVar;
    private constructor() {}
    /**
     * @description
     * Get the instance of the SharedVar class.
     */
    public static getInstance() {
        if (!SharedVar.instance) {
            SharedVar.instance = new SharedVar();
        }
        return SharedVar.instance;
    }

    /**
     * @description
     * The data that is shared between the different classes.
     * @property pause
     * @property count
     * @property filePicker
     * @type {Object}
     */
    public data: {
        pause: boolean;
        count: number;
        filePicker: any[];
    } = {
        pause: false,
        count: 0,
        filePicker: []
    };
}

export default SharedVar;
