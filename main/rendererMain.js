let $ = window.jQuery;

// adding event listener for creating a new windwo to create a batch
const createButton = document.getElementById('createBatch');
createButton.addEventListener('click', () => {
    window.dashboard.createBatchWin();
});

window.addEventListener('DOMContentLoaded', async () => {
    let existing = $('#existingBatches');
    let data = await window.dashboard.loadExisting();
    finalHtml = '<div class="row">';

    data.map(entry => {
        let batchID = entry['batchID'];
        let name = entry['nameGrainBill'];
        let html =
        `<div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Grain Bill: ${name}</h5>
                    <p class="card-text">Batch ID: ${batchID}</p>
                    <button id="details-${batchID}" class="btn btn-primary">View</a>
                </div>
            </div>
        </div>`;
        finalHtml += html;
    });

    finalHtml += '</div>';
    existing.append(finalHtml);
});

// create reactive buttons to view
window.addEventListener('load', async () => {
    let data = await window.dashboard.loadExisting();
    // interate over and add event listners to each button
    data.map(entry => {
        let batchID = entry['batchID'];
        let button = document.getElementById(`details-${batchID}`);
        button.addEventListener('click', () => {
            window.dashboard.createDetailsWin(batchID);
        });
    }); 
});

