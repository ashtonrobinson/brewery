let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    let data = await window.brite.getData();
    let batchName = await window.brite.getBatchName();

    let volIn = data['volumeIn'];
    let carbonation = data['carbonation'];
    let date = data['date'];
    let notes = data['notes'];

    $('#briteID').text(`Batch Name: ${batchName}`);
    $('#date').val(date);
    $('#volIn').val(volIn);
    $('#carbonation').val(carbonation);
    $('#notes').val(notes);

    $('#lock').on('click', () => {
        $('#date').prop('disabled', false);
        $('#volIn').prop('disabled', false);
        $('#carbonation').prop('disabled', false);
        $('#notes').prop('disabled', false);
        $('#update').prop('disabled', false);
        $('#lock').prop('disabled', true);
    });

    $('#update').on('click', () => {
        $('#date').prop('disabled', true);
        $('#volIn').prop('disabled', true);
        $('#carbonation').prop('disabled', true);
        $('#notes').prop('disabled', true);
        $('#update').prop('disabled', true);
        $('#lock').prop('disabled', false);

        let date = $('#date').val();
        let volumeIn = $('#volIn').val();
        let notes = $('#notes').val();
        let carbonation = $('#carbonation').val();
         
        if(!date){
            alert('Date Field Required');
            return;
        }

        let data = {
            date: date,
            volumeIn: volumeIn,
            notes: notes,
            carbonation: carbonation,
        }

        window.brite.sendBriteData(data);
    });
});