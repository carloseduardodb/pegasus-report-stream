/**
 * @author Carlos Eduardo Dias Batista
 * @class MyEventEmitter
 * @description
 * MyEventEmitter is a simple event emitter implementation that allows for
 * adding, removing, and dispatching events.
 */
export class MyEventEmitter {
    /**
     * The events that are currently subscribed to.
     */
    private static events: Record<string, ((data: any) => void)[]> = {};

    /**
     * Adds a listener to the given event.
     * @param eventName The name of the event to listen to.
     * @param callback The callback function to call when the event is dispatched.
     */
    static addEventListener(eventName: string, callback: (data: any) => void) {
        if (!MyEventEmitter.events[eventName]) {
            MyEventEmitter.events[eventName] = [];
        }
        MyEventEmitter.events[eventName].push(callback);
    }

    /**
     * Removes a listener from the given event.
     * @param eventName The name of the event to remove the listener from.
     * @param callback The callback function to remove from the event.
     */
    static removeEventListener(eventName: string, callback: (data: any) => void) {
        if (MyEventEmitter.events[eventName]) {
            MyEventEmitter.events[eventName] = MyEventEmitter.events[eventName].filter((cb) => cb !== callback);
        }
    }

    /**
     * Dispatches an event to all of the listeners of the given event.
     * @param eventName The name of the event to dispatch.
     * @param data The data to pass to the listeners.
     */
    static dispatchEvent(eventName: string, data: any) {
        const callbacks = MyEventEmitter.events[eventName];
        if (callbacks) {
            callbacks.forEach((cb) => cb(data));
        }
    }
}

export default MyEventEmitter;
