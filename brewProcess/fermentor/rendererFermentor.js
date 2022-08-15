let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    let fermentorData = await window.fermentor.getFermentorData();
    let name = await window.fermentor.getBatchName();
    let currentNumberPoints = fermentorData.length;
    
    //set names
    $('#fermentorID').text(`Batch Name: ${name}`);
    $('#currNum').text(`There are currently ${currentNumberPoints} fermentation entries.`);

    fermentorData.map((entry, index) =>{
        let ph = entry.ph;
        let plato = entry.plato;
        let notes = entry.notes;
        let temp = entry.temp;
        let date = entry.date;

        let html = `
        <h3 id="name-${index}">Data Point ${index+1}</h3>
        <div class="my-2 row">
            <label for="date-${index}" class="form-label">Date</label>
            <input id="date-${index}" disabled="true"></input>
        </div>
        <div class="my-2 row" id="data-${index}">
            <div class="mx-2 col">
                <label for="plato-${index}" class="form-label">Plato</label>
                <div class="input-group">
                    <input type="number" class="form-control" id="plato-${index}" disabled="true">
                </div>
            </div>
            <div class="mx-2 col">
                <label for="ph-${index}" class="form-label">ph</label>
                <div class="input-group">
                    <input type="number" class="form-control" id="ph-${index}" disabled="true">
                </div>
            </div>
            <div class="mx-2 col">
                <label for="temp-${index}" class="form-label" id="temp">Temperature</label>
                <div class="input-group">
                    <input type="number" class="form-control" id="temp-${index}" disabled="true">
                    <span class="input-group-text">&#x2109;</span>
                </div>
            </div>
        </div>
        <div class="my-2 row">
            <label for="notes-${index}" class="form-label">Notes</label>
            <textarea id="notes-${index}" disabled="true"></textarea>
        </div>
        <div class="mt-2 mb-4 row" id="edit">
            <div class="col">
                <button class="btn btn-danger" id="lock-${index}">Unlock</button>
            </div>
            <div class="col">
                <button class="btn btn-primary" id="update-${index}" disabled="true">Update</button>
            </div>
        </div>
        `;

        $('#data').append(html);

        //date should never be empty
        $(`#date-${index}`).val(date);
        // add field values if they exist 
        if(plato) $(`#data #plato-${index}`).val(plato);
        if (ph) $(`#data #ph-${index}`).val(ph);
        if (temp) $(`#data #temp-${index}`).val(temp);
        if (notes) $(`#data #notes-${index}`).val(notes);

        $(`#edit #lock-${index}`).on('click', () => {
            $(`#plato-${index}`).prop('disabled', false);
            $(`#ph-${index}`).prop('disabled', false);
            $(`#temp-${index}`).prop('disabled', false);
            $(`#temp-${index}`).prop('disabled', false);
            $(`#notes-${index}`).prop('disabled', false);
            $(`#update-${index}`).prop('disabled', false);
            $(`#lock-${index}`).prop('disabled', true);
        });

        $(`#edit #update-${index}`).on('click', () => {
            $(`#plato-${index}`).prop('disabled', true);
            $(`#ph-${index}`).prop('disabled', true);
            $(`#temp-${index}`).prop('disabled', true);
            $(`#temp-${index}`).prop('disabled', true);
            $(`#notes-${index}`).prop('disabled', true);
            $(`#update-${index}`).prop('disabled', true);
            $(`#lock-${index}`).prop('disabled', false);

            let plato = $(`#plato-${index}`).val();
            let ph = $(`#ph-${index}`).val();
            let temp = $(`#temp-${index}`).val();
            let notes = $(`#notes-${index}`).val();
            let date = $(`#date-${index}`).val();

            let data = {
                plato: plato,
                ph: ph,
                temp: temp,
                notes: notes,
                date: date,
                dataID: index,
            }

            window.fermentor.updateDataEntry(data);
        });
    });

    $('#addBtn').on('click', () => {
        window.fermentor.createDataEntryWindow();
    });
});