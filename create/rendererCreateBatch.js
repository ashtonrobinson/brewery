let $ = window.jQuery;

// adding entry rows
const addRowBtn = document.getElementById('addGrain');
addRowBtn.addEventListener('click', () => {
    let idNum = $("#grainEntry").children().length;
    
    let html = 
    `<div class="row row-cols-2" id="row-${idNum}">
        <div class="col">
            <label for="lbGrain-${idNum}" class="form-label">lb Grain</label>
            <input type="number" class="form-control" id="lbGrain-${idNum}">
        </div>
        <div class="col">
            <label for="typeGrain-${idNum}" class="form-label">Type of Grain</label>
            <input type="text" class="form-control" id="typeGrain-${idNum}">
        </div>
    </div>`;

    $('#grainEntry #addRemoveGrain').before(html); 
});

// removing entry rows
const removeRowBtn = document.getElementById('removeGrain');
removeRowBtn.addEventListener('click', () => {
    let numElem = $("#grainEntry").children().length;
    // has to be numElem-1 since the buttons are last elems
    $(`#grainEntry #row-${numElem-1}`).remove();
});

//submitting to main process for entry into database
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click',() => {
    let batchName = $("#batchName").val();
    let grainName = $("#grainBill").val();

    if (!(batchName && grainName)){
        alert("Missing batch name or grain bill");
    } else {
        let entries = [];

        let numEntries = ($("#grainEntry").children().length)-1;
        for (let i = 0; i < numEntries; i++){
            let num = i+1;
            // both of these cannot be empty
            let lb = $(`#grainEntry #row-${num} #lbGrain-${num}`).val();
            let typeGrain = $(`#grainEntry #row-${num} #typeGrain-${num}`).val();

            if (lb && typeGrain && lb > 0){
                let entry = [typeGrain, lb]
                entries.push(entry);
            }
        }
        window.newBatch.sendGrainData(batchName, grainName, entries);
    }
});