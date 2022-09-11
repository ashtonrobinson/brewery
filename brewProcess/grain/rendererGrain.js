let $ = window.jQuery;

const findIndicies = () => {
    //find the number of grain fields
    let descripString = $('#grainFields').text();
    //the number of entries is in the 3rd position in the string.
    let length = Number(descripString.split(' ')[2]);
    let indicies = [...Array(length).keys()];
    return indicies;
};

window.addEventListener('DOMContentLoaded', async () => {
    let grainName = await window.grain.getGrainBillName();
    $('#grainName').text(`Grain Bill: ${grainName}`);

    let grainData = await window.grain.getGrainBill();
    let totalPound = grainData.map(d => d['grainLb']).reduce((x,y) => x+y)
    $('#grainFields').text(`There are ${grainData.length} types of grain totaling ${totalPound} lbs.`);

    grainData.map(grain => {
        let index = grain['rowID']
        let lb = grain['grainLb'];
        let grainType = grain['grainType'];
        let html = `
        <div class="row">
            <div class="col">
                <label for="grainPound-${index}" class="form-label">Pounds of Grain</label>
                <div class="input-group">
                    <input type="number" class="form-control" id="grainPound-${index}" disabled="true" value="${lb}">
                    <div class="input-group-append">
                        <span class="input-group-text" id="units">lbs</span>
                    </div>
                </div>
            </div>
            <div class="col">
                <label for="grainType-${index}" class="form-label">Type of Grain</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="grainType-${index}" disabled="true" value="${grainType}">
                </div>
            </div>
        </div>`;
        
        $('#grainBill').append(html);
    });

    let editButtons = 
        ` <div class="row my-2">
            <div class="col">
                <button class="btn btn-danger" id="lock">Unlock</button>
            </div>
            <div class="col">
                <button class="btn btn-primary" id="update" disabled="true">Update</button>
            </div>
        </div>`;
    $('#grainBill').append(editButtons);

    $('#grainBill #lock').on('click', () => {
        let indicies = findIndicies();
        indicies.map(i => {
            $(`#grainPound-${i}`).prop('disabled', false);
            $(`#grainType-${i}`).prop('disabled', false);
        });

        $('#lock').prop('disabled', true);
        $('#update').prop('disabled', false);
    });

    $('#update').on('click', async () => {
        let indicies = findIndicies();

        // data is an obejct keyed by the rowID number
        let data = {};

        indicies.map(i => {
            let lb = $(`#grainPound-${i}`).val();
            let type = $(`#grainType-${i}`).val();

            $(`#grainPound-${i}`).prop('disabled', true);
            $(`#grainType-${i}`).prop('disabled', true);

            data[i] = [lb, type];
        });

        let grainBill = await window.grain.getGrainBillName();

        $('#lock').prop('disabled', false);
        $('#update').prop('disabled', true);

        console.log(data, grainBill);

        window.grain.updateGrainData(grainBill, data);
    });
});
