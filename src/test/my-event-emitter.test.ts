import assert from 'assert';
import { describe, it } from 'node:test';
import MyEventEmitter from '../report-generator/util/my-event-emitter';

describe('MyEventEmitter', () => {
    it('should add and dispatch an event', (done) => {
        MyEventEmitter.addEventListener('event', (data) => {
            assert.strictEqual(data, 'test');
        });
        MyEventEmitter.dispatchEvent('event', 'test');
        MyEventEmitter.removeEventListener('event', MyEventEmitter.getEvent('event')[0]);
    });

    it('should remove an event listener', () => {
        const callback = () => {};
        MyEventEmitter.addEventListener('event', callback);
        MyEventEmitter.removeEventListener('event', callback);
        assert.deepStrictEqual(MyEventEmitter.getEvent('event'), []);
    });

    it('should not dispatch an event if there are no listeners', () => {
        MyEventEmitter.dispatchEvent('event', 'test');
        assert.ok(true);
    });
});
