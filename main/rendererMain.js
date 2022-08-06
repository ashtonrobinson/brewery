let $ = window.jQuery;

// adding event listener for creating a new windwo to create a batch
const createButton = document.getElementById('createBatch');
createButton.addEventListener('click', () => {
    window.dashboard.createBatchWin();
});

window.addEventListener('DOMContentLoaded', async () => {
    let existing = $('#existingBatches');
    let data = await window.dashboard.loadExisting();

    data.map(entry => {
        let batchID = entry['batchID'];
        let batchName = entry['name'];
        let nameGrain = entry['nameGrainBill'];
        let date = entry['date'];
        let html =
        `<div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        Batch ID: ${batchID}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Name: ${batchName}</h5>
                        <p class="card-text">Grain Bill: ${nameGrain}</p>
                        <p class="card-text">Date Created: ${date}</p>

                        <button id="details-${batchID}" class="btn btn-primary">View</a>
                    </div>
                </div>
            </div>
        </div>`;
        existing.append(html);
    });
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

