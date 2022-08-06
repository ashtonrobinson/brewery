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
    console.log(data);
    const entry = (data.filter(row => row['batchID'] == batchNum))[0];

    //assign entries
    const batchName = entry['name'];
    const grainName = entry['nameGrainBill'];
    const date = entry['date'];

    headerID.innerText = `BatchID: ${batchNum}`;
    headerName.innerText = `Batch Name: ${batchName}`;
    headerGrain.innerText = `Grain Bill: ${grainName}`;
    headerDate.innerText = `Date Created: ${date}`;

    // add click events to all buttons
    // to do
});
