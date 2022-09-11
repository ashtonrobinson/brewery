let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    const grainData = await window.newBatch.getBatchData();
    
    grainData.map(entry => {
        let grainName = entry['grainName'];

        let html = `
        <option value="${grainName}">${grainName}</option>
        `;

        $('#grainOptions').append(html);
    });
});

const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', () => {
    const batchName = $('#batchName').val();
    const grainBillName = $('#grainOptions :selected').val();
    
    if (!batchName) alert('You must provide a name.')
    else if (!grainBillName) alert('You must pick a grain bill.')
    else window.newBatch.sendGrainEntry(batchName, grainBillName);
});