let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    //inject batch number into top level
    const headerID = document.getElementById('batchID');
    const headerName = document.getElementById('batchName');
    const headerGrain = document.getElementById('grainName');
    const headerDate = document.getElementById('date');
    
    const batchNum = window.details.getBatchNum();
    // get entry for the batch number above
    const data = await window.details.getBatchData();
    const entry = (data.filter(row => row['batchID'] == batchNum))[0];

    //assign entries
    const batchName = entry['name'];
    const grainName = entry['nameGrainBill'];
    const date = entry['date'];

    headerID.innerText = `BatchID: ${batchNum}`;
    headerName.innerText = `Batch Name: ${batchName}`;
    headerGrain.innerText = `Grain Bill: ${grainName}`;
    headerDate.innerText = `Date Created: ${date}`;

    // add grain bill data to view page
    const grainData = await window.details.getGrainBill(grainName);
    const grainField = $('#grainData');
    grainData.map(grain => {
        let type = grain['grainType'];
        let lb = grain['grainLb'];
        let html = 
        `<div class="col">
            <p>Grain Type: ${type}</p>
            <p>Lb Grain: ${lb}</p>
        </div>`;
        grainField.append(html);
    });

    // add click events to all buttons
    const mash = document.getElementById('mashBtn');
    mash.addEventListener('click', () => {
        window.details.createMashWin(batchNum);
    });
    const kettle = document.getElementById('kettleBtn');
    kettle.addEventListener('click', () => {
        window.details.createKettleWin(batchNum);
    });
    const fermentor = document.getElementById('fermentorBtn');
    fermentor.addEventListener('click', () => {
        window.details.createFermentorWin(batchNum);
    });
    const centrifuge = document.getElementById('centrifugeBtn');
    centrifuge.addEventListener('click', () => {
        window.details.createCentrifugeWin(batchNum)
    });
    const brite = document.getElementById('briteBtn');
    brite.addEventListener('click', () => {
        window.details.createBriteWin(batchNum);
    });
    const output = document.getElementById('outputBtn');
    output.addEventListener('click', () => {
        window.details.createOutputWin(batchNum);
    });
});
