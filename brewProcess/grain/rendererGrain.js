let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', async () => {
    let grainName = await window.grain.getGrainBillName();
    $('#grainName').text(`Grain Bill: ${grainName}`);

    let grainData = await window.grain.getGrainBill();
    grainData.map((grain, index) => {
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
            </div>np
            <div class="col">
                <label for="grainType-${index}" class="form-label">Pounds of Grain</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="grainType-${index}" disabled="true" value="${grainType}">
                </div>
            </div>
        </div>`;
        $('#grainBill').append(html);
    });
});