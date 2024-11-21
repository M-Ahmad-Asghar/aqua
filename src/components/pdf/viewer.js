import { memo } from 'react';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import { pdfjs } from 'pdfjs-dist/build/pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;

const CustomPDFViewer = ({ fileUrl }) => {
    return (
        <div style={{ height: '160px', width: '500px' }}>
            {/* <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
                <Viewer fileUrl={fileUrl} />
            </Worker> */}
        </div>
    );
};

export default memo(CustomPDFViewer);
