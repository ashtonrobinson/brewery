let $ = window.jQuery;

// adding event listener for creating a new windwo to create a batch
const createButton = document.getElementById('createBatch');
createButton.addEventListener('click', () => {
    window.dashboard.createBatchWin();
});

const createWithExisting = document.getElementById('createNewBatchExisting');
createWithExisting.addEventListener('click', async () => {
    let grainBills = await window.dashboard.getGrainBills();
    if (grainBills.length > 0){
        window.dashboard.createBatchWinExisting();
    } else {
        alert('No current grain bills');
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    let existing = $('#existingBatches');
    let completed = $('#completedBatches');
    let data = await window.dashboard.loadExisting();

    data.map(entry => {
        let batchID = entry['batchID'];
        let batchName = entry['name'];
        let nameGrain = entry['nameGrainBill'];
        let date = entry['startDate'];
        let status = entry['status'];

        let html =
        `<div class="row" id="batch-${batchID}">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        Batch ID: ${batchID}
                    </div>
                    <div class="card-body" id="body-${batchID}">
                        <h5 class="card-title">Name: ${batchName}</h5>
                        <p class="card-text">Grain Bill: ${nameGrain}</p>
                        <p class="card-text">Date Created: ${date}</p>
                        <div class="row">
                            <div class="col-2">
                                <button id="details-${batchID}" class="btn btn-primary">View</button>
                            </div>
                            <div id="complete" class="col-3"></div>

                            <div class="col-5"></div>

                            <div class="col-2">
                                <button id="remove-${batchID}", class="btn btn-danger">Remove</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>`;
        let newElem = $(html);

        if (!status) newElem.appendTo("#completedBatches") 
        else newElem.appendTo("#existingBatches");

        
        let cardBody = $(`#body-${batchID} #complete`);
        let btn;

        // status is true if the batch has been completed
        if (!status){
            btn = $(`<button id="completed-${batchID}" class="btn btn-success">Complete</button>`);
            cardBody.append(btn);

            existing.append(newElem);
        } else {
            btn = $(`<button id="completed-${batchID}" class="btn btn-warning">Uncomplete</button>`);
            cardBody.append(btn);

            completed.append(newElem);
        }       
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

        // add event listeners for each completed button to toggle
        let complButton = document.getElementById(`completed-${batchID}`);
        complButton.addEventListener('click', () => {
            window.dashboard.changeStatus(batchID);
        });

        let removeBtn = document.getElementById(`remove-${batchID}`);
        removeBtn.addEventListener('click',() => {
            window.dashboard.remove(batchID);
            $(`#batch-${batchID}`).remove()
        });
    }); 
});



