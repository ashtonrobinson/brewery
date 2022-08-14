let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    let kettleData = await window.kettle.getKettleData();

    let name = await window.kettle.getBatchName();
    let wort = kettleData['wortCol'];
    let waterAdd = kettleData['waterAdded'];
    let preGrav = kettleData['preBoilGrav'];
    let postGrav = kettleData['postBoilGrav'];
    let preVol = kettleData['preBoilVol'];
    let postVol = kettleData['postBoilVol'];
    let date = kettleData['date']
    let notes = kettleData['notes'];

    let title = document.getElementById('kettleID');
    title.innerText = `Batch Name: ${name}`;

    let dateField = document.getElementById('date');
    dateField.value = date;
    
    if(wort) $('#wortCollected').prop('value', wort);
    if(waterAdd) $('#waterIn').prop('value', waterAdd);
    if(preGrav) $('#preGrav').prop('value', preGrav);
    if(postGrav) $('#postGrav').prop('value', postGrav);
    if(preVol) $('#preVol').prop('value', preVol);
    if(postVol) $('#postVol').prop('value', postVol);
    if(notes) $('#notes').prop('value', notes);

    let lockBtn = document.getElementById('lock');
    lockBtn.addEventListener('click', () => {
        //enable inputs
        $('#date').prop('disabled', false);
        $('#wortCollected').prop('disabled', false);
        $('#waterIn').prop('disabled', false);
        $('#preGrav').prop('disabled', false);
        $('#postGrav').prop('disabled', false);
        $('#preVol').prop('disabled', false);
        $('#postVol').prop('disabled', false);
        $('#notes').prop('disabled', false);
        $('#update').prop('disabled', false);
        $('#lock').prop('disabled', true);
    });

    let updateBtn = document.getElementById('update');
    updateBtn.addEventListener('click', () => {
        //disable all inputs
        $('#date').prop('disabled', true);
        $('#wortCollected').prop('disabled', true);
        $('#waterIn').prop('disabled', true);
        $('#preGrav').prop('disabled', true);
        $('#postGrav').prop('disabled', true);
        $('#preVol').prop('disabled', true);
        $('#postVol').prop('disabled', true);
        $('#notes').prop('disabled', true);
        $('#update').prop('disabled', true);
        $('#lock').prop('disabled', false);

        //send data to front end
        let date = $('#date').val();
        let wortCollected = $('#wortCollected').val();
        let preGrav = $('#preGrav').val();
        let postGrav = $('#postGrav').val();
        let preVol = $('#preVol').val();
        let postVol = $('#postVol').val();
        let waterIn = $('#waterIn').val();
        let notes = $('#notes').val();
        
        let data = {date: date, 
            wortCol: wortCollected, 
            preBoilGrav: preGrav, 
            postBoilGrav: postGrav,
            preBoilVol: preVol,
            postBoilVol: postVol,
            waterAdded: waterIn,
            notes: notes
        };
        window.kettle.sendKettleData(data);
    });
});