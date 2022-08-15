let $ = window.jQuery;

window.addEventListener('DOMContentLoaded', () => {
    let btn = document.getElementById('createBtn');
    btn.addEventListener('click', () => {
        let plato = $('#plato').val();
        let ph = $('#ph').val();
        let temp = $('#temp').val();
        let notes = $('#notes').val();

        const data = {
            plato: plato,
            ph: ph,
            temp: temp,
            notes: notes
        }
        
        window.fermentorData.addFermentorDataEntry(data);
    });

    let closeBtn = document.getElementById('closeWin');
    closeBtn.addEventListener('click', () => {
        window.fermentorData.closeWindow();
    });
})