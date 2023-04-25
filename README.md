# Pegasus Report Stream

<br />
<p align="center">
  <img src="https://raw.githubusercontent.com/carloseduardodb/public-storage-images/main/Pegasus.png" alt="Pegasus Report Stream Logo">
</p>

Pegasus Report Stream is an application that generates reports based on data obtained via stream using the Fetch API with Transfer-Encoding chunked. The application utilizes the FileSystemFileHandle
feature to save the generated files in CSV format, offering more flexibility in writing the data. However, it's important to note that the use of this feature may be subject to browser compatibility,
as not all browsers support FileSystemFileHandle. <br />

<br />

## Installation

To install the Pegasus Report Stream library, simply run the following command:

### NPM

```bash
npm install @carloseduardobatista/pegasus-report-stream
```

### Yarn

```bash
yarn add @carloseduardobatista/pegasus-report-stream
```

<br />

## Import the Library

To import the Pegasus Report Stream library, simply run the following command:

```javascript
import { Pegasus } from '@carloseduardobatista/pegasus-report-stream';
```

<br />

## Implementation Example

Here's an example of how to use the `getReport()` function to generate a report:

```javascript
async function getReport() {
    const data = [
        { id: 5, name: 'João', is_credit: true },
        { id: 6, name: 'Maria', is_credit: false },
        { id: 7, name: 'José', is_credit: true },
        { id: 8, name: 'Mariana', is_credit: false },
        { id: 9, name: 'Moacir', is_credit: true }
    ];
    const jsonData = data.map((obj) => JSON.stringify(obj)).join('\n');
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonData);
    const readableStream = new ReadableStream({
        start(controller) {
            controller.enqueue(uint8Array);
            controller.close();
        }
    });
    const reader = readableStream.getReader();
    const statusEvent = await Pegasus.splitData({
        name: 'report',
        stream: reader,
        filters: filters,
        refColumns: refColumns,
        type: 'PDF',
        closeByRegisterLimit: 1000000,
        cut: 100000,
        qttFilePicker: 1,
        delimiter: '\n'
    });

    if (!statusEvent) return;

    statusEvent.addEventListener('progress', (data: any) => {
        console.log('Data:', data);
    });

    statusEvent.addEventListener('error', (error: Error) => {
        console.log('Error:', error);
    });
}
```

<br/>

## System Requirements

Before using the Pegasus Report Stream application, please make sure your system meets the following requirements:

-   Browser compatible with the FileSystemFileHandle feature.

<br/>

## Contribution

We value and encourage community contribution to the Pegasus Report Stream project. If you wish to contribute, please follow the steps below:

1. Fork the repository.
2. Create a branch for your contribution: `git checkout -b feature/new-feature` or `git checkout -b bug/fix`.
3. Make necessary changes and commit accordingly.
4. Push the branch to your fork: `git push origin feature/new-feature` or `git push origin bug/fix`.
5. Open a pull request in the original repository, explaining your contribution in detail.
6. Wait for feedback from the project team.

<br/>

## License

The Pegasus Report Stream library is licensed under the MIT License with the following additional restriction, check in the [LICENSE.md](/LICENSE.md)
