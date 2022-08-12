let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    let mashData = await window.mash.getMashData();
    
    let batchID = window.mash.getBatchId();
    let mashExp = mashData['mashInExp'];
    let mashAct = mashData['mashInAct'];
    let spargeExp = mashData['spargeInExp'];
    let spargeAct = mashData['spargeInAct'];
    let notes = mashData['notes'];
    let date = mashData['date'];

    let title = document.getElementById('mashID');
    title.innerText = `Batch #${batchID}`;

    let dateField = document.getElementById('date');
    dateField.value = date;

    let mashExpField = document.getElementById('mashExpIn');
    if(mashExp) mashExpField.value = mashExp;

    let mashActField = document.getElementById('mashActIn');
    if(mashAct) mashActField.value = mashAct;

    let spargeExpField = document.getElementById('spargeExpIn');
    if(spargeExp) spargeExpField.value = spargeExp;

    let spargeActField = document.getElementById('spargeActIn');
    if (spargeAct) spargeActField.value = spargeAct;

    let notesField = document.getElementById('notes');
    if(notes) notesField.value = notes;

    //add event listeners to unlock and lock input field
    let lockBtn = document.getElementById('lock');
    
    lockBtn.addEventListener('click', () => {
        //enable inputs
        $('#date').prop('disabled', false);
        $('#mashExpIn').prop('disabled', false);
        $('#mashActIn').prop('disabled', false);
        $('#spargeExpIn').prop('disabled', false);
        $('#spargeActIn').prop('disabled', false);
        $('#update').prop('disabled', false);
        $('#notes').prop('disabled', false);
        $('#lock').prop('disabled', true);
    });

    let updateBtn = document.getElementById('update');
    updateBtn.addEventListener('click', () => {
        //disable all inputs
        $('#date').prop('disabled', true);
        $('#mashExpIn').prop('disabled', true);
        $('#mashActIn').prop('disabled', true);
        $('#spargeExpIn').prop('disabled', true);
        $('#spargeActIn').prop('disabled', true);
        $('#update').prop('disabled', true);
        $('#notes').prop('disabled', true);
        $('#lock').prop('disabled', false);

        //send data to front end
        let date = $('#date').val();
        let mashEx = $('#mashExpIn').val();
        let mashAct = $('#mashActIn').val();
        let spargeExp = $('#spargeExpIn').val();
        let spargeAct = $('#spargeActIn').val();
        let notes = $('#notes').val();
        
        let data = {date: date, 
            mashExpIn: mashEx, 
            mashActIn: mashAct, 
            spargeExpIn: spargeExp,
            spargeActIn: spargeAct,
            notes: notes
        };

        window.mash.sendMashData(data);
    });
});

