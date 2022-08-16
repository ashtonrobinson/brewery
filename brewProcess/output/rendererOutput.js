let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    let data = await window.output.getData();
    let batchName = await window.output.getBatchName();

    let sixth = data['sixthBarrel'];
    let half = data['halfBarrel'];
    let cases = data['cases'];
    let notes = data['notes'];


    $('#outputName').text(`Batch Name: ${batchName}`);
    $('#sixthBbl').val(sixth);
    $('#halfBbl').val(half);
    $('#notes').val(notes);
    $('#cases').val(cases);

    $('#lock').on('click', () => {
        $('#sixthBbl').prop('disabled', false);
        $('#halfBbl').prop('disabled', false);
        $('#notes').prop('disabled', false);
        $('#cases').prop('disabled', false);
        $('#update').prop('disabled', false);
        $('#lock').prop('disabled', true);
    }); 

    $('#update').on('click', () => {
        $('#sixthBbl').prop('disabled', true);
        $('#halfBbl').prop('disabled', true);
        $('#notes').prop('disabled', true);
        $('#cases').prop('disabled', true);
        $('#update').prop('disabled', true);
        $('#lock').prop('disabled', false);

        let sixth = $('#sixthBbl').val();
        let half = $('#halfBbl').val();
        let notes = $('#notes').val();
        let cases = $('#cases').val();

        let data = {
            sixthBbl: sixth,
            halfBbl: half,
            notes: notes,
            cases: cases,
        }
        window.output.sendOutputData(data);
    }); 
});