// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
const url = 'https://raw.githubusercontent.com/AzureRaids/AzureRaids.github.io/main/data/EPK_AzureRaids.pdf';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
const pdfjsLib = window['pdfjs-dist/build/pdf'];
const PDF_BORDER = 10;
const SCALE_FACTOR = 0.4;

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js'

let globalScale = 1.0;

function renderPage(pdf, pageNumber) {
    pdf.getPage(pageNumber).then(function(page) {
        let test_viewport = page.getViewport({scale: 1});

        // Prepare canvas using PDF page dimensions
        let canvas = document.getElementById('canvas' + pageNumber);

        let scale = $(document).width() / (test_viewport.width + 2*PDF_BORDER) * SCALE_FACTOR;
        // scale = Math.max(Math.min(scale, 3), 0.5);
        let viewport = page.getViewport({
            scale: scale, offsetX: PDF_BORDER
        });
        globalScale = scale;
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        let renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            context.fillStyle = "black";
            context.fillRect(0, 0, PDF_BORDER, viewport.height);
            context.fillRect(PDF_BORDER, canvas.height-2, canvas.width, 2);
        });
    });
}

// Asynchronous download of PDF
let loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
    // Fetch the first page
    renderPage(pdf, 1);
    renderPage(pdf, 2);
    setupClickEvents();
}, function (reason) {
    // PDF loading error
    console.error(reason);
});


function setupClickEvents() {
    $("#canvas1").on("click", function(evt) {
        let xPos = (evt.offsetX - PDF_BORDER) / globalScale;
        let yPos = (evt.offsetY - PDF_BORDER) / globalScale;
        console.log('Pos: ', xPos, ', ', yPos);
        const circle_fields = [
            // [[487, 105], 72, 'Azure Raids'],
            [[52, 502], 24, 'https://www.instagram.com/azure.raids/'],
            [[126, 502], 24, 'https://www.youtube.com/@LewistonTramps'],
            [[195, 502], 24, 'https://open.spotify.com/artist/6SI6I1VzjLc5JKi5NhawtA'],
            [[264, 502], 24, 'https://www.facebook.com/azure.raids'],
        ];
        for (let [center, radius, url] of circle_fields) {
            const distance_squared = Math.pow(xPos - center[0], 2) + Math.pow(yPos - center[1], 2)
            if (distance_squared < radius * radius) {
                // console.log(url);
                window.open(url, '_blank').focus();
            }
        }
        // console.log(xPos, yPos);
    });
    $("#canvas2").on("click", function(evt) {
        let xPos = (evt.offsetX - PDF_BORDER) / globalScale;
        let yPos = (evt.offsetY - PDF_BORDER) / globalScale;
        const rect_fields = [
            [335, 61, 460, 186, 'https://open.spotify.com/track/1dcJmzAh1ybNK3aNooEN4j'],
            [495, 62, 617, 186, 'https://open.spotify.com/track/2zW3oVxX9AEszSTWq6qDeL'],
            [312, 708, 619, 899, 'https://www.youtube.com/watch?v=FE6Bf63v8WI'],
            [115, 560, 305, 897, 'https://youtu.be/3c-zJfkP6q0'],
        ]
        for (let [left, top, right, bot, url] of rect_fields) {
            if (xPos > left && xPos < right && yPos > top && yPos < bot) {
                // console.log(url);
                window.open(url, '_blank').focus();
            }
        }
        // console.log(xPos, yPos);
    });
}
