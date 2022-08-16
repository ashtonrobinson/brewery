let $ = window.jQuery;

window.addEventListener("DOMContentLoaded", async () => {
    // uses the batch id stored in the renderer
    let data = await window.centrifuge.getData();
    let name = await window.centrifuge.getBatchName();

    let turbidity = data['turbidity'];
    let date = data['date'];
    let notes = data['notes'];

    $('#centrifugeID').text(`Batch Name: ${name}`);
    $('#date').val(date);
    $('#turbidity').val(turbidity);
    $('#notes').val(notes);

    $('#lock').on('click', () => {
        $('#date').prop('disabled', false);
        $('#turbidity').prop('disabled', false);
        $('#notes').prop('disabled', false);
        $('#update').prop('disabled', false);
        $('#lock').prop('disabled', true);
    });

    $('#update').on('click', () => {
        $('#date').prop('disabled', true);
        $('#turbidity').prop('disabled', true);
        $('#notes').prop('disabled', true);
        $('#update').prop('disabled', true);
        $('#lock').prop('disabled', false);

        let date = $('#date').val();
        let turbidity = $('#turbidity').val();
        let notes = $('#notes').val();

        if(!date){
            alert('Date Field Required');
            return;
        }

        let data = {
            date: date,
            turbidity: turbidity, 
            notes: notes,
        }
        
        window.centrifuge.updateCentrifugeData(data);
    });
}); 