import { describe, it } from 'node:test';
import assert from 'assert';
import FilterImage from '../report-generator/util/filter-image';

describe('FilterImage', function () {
    describe('toPascalCase', () => {
        it('should convert text to pascal case', () => {
            const text = 'hello-world';
            const expectedOutput = 'HelloWorld';

            const output = FilterImage.toPascalCase(text);

            assert.equal(output, expectedOutput);
        });

        it('should handle multiple dashes and underscores in the input', () => {
            const text = 'hello-world_how-are_you';
            const expectedOutput = 'HelloWorldHowAreYou';

            const output = FilterImage.toPascalCase(text);

            assert.equal(output, expectedOutput);
        });

        it('should handle input with leading spaces', () => {
            const text = '  hello-world';
            const expectedOutput = 'HelloWorld';

            const output = FilterImage.toPascalCase(text);

            assert.equal(output, expectedOutput);
        });

        it('should handle input with trailing spaces', () => {
            const text = 'hello-world  ';
            const expectedOutput = 'HelloWorld';

            const output = FilterImage.toPascalCase(text);

            assert.equal(output, expectedOutput);
        });

        it('should handle input with multiple spaces', () => {
            const text = 'hello   world';
            const expectedOutput = 'HelloWorld';

            const output = FilterImage.toPascalCase(text);

            assert.equal(output, expectedOutput);
        });
    });
});
