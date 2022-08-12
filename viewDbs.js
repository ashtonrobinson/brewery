const sqlite3 = require('sqlite3').verbose();
const brewDB = new sqlite3.Database('brewDB');
const grainDB = new sqlite3.Database('grainDB');


// print batch and grain data
brewDB.all('SELECT * FROM batch', 
    function (err, rows){
        let names = [];
        console.log('Batch Table');
        if (!err){
            rows.map(row => {
                console.log(row);
                names.push(row['nameGrainBill']);
            });
            grainDB.serialize(() => {
                names.map(name => {
                    grainDB.all(`SELECT * FROM ${name}`, 
                        function(err, rows){
                            if(!err){
                                console.log('Grain Table:', name);
                                rows.map(row => console.log(row));
                            } else {
                                console.log(err);
                            }
                        }
                    );
                });
            });
            
        } else {
            console.log(err);
        }
    }  
);

brewDB.all(`SELECT * FROM mash`, function (err, rows){
    console.log("Mash Table")
    if(!err){
        rows.map(row => console.log(row));
    }
});

brewDB.all(`SELECT * FROM kettle`, function (err, rows){
    console.log("Kettle Table")
    if(!err){
        rows.map(row => console.log(row));
    }
});

brewDB.all(`SELECT * FROM fermentor`, function (err, rows){
    console.log("Fermentor Table")
    if(!err){
        rows.map(row => console.log(row));
    }
});

brewDB.all(`SELECT * FROM centrifuge`, function (err, rows){
    console.log("Centrifuge Table")
    if(!err){
        rows.map(row => console.log(row));
    }
});

brewDB.all(`SELECT * FROM brite`, function (err, rows){
    console.log("Brite Table")
    if(!err){
        rows.map(row => console.log(row));
    }
});

brewDB.all(`SELECT * FROM output`, function (err, rows){
    console.log("Output Table")
    if(!err){
        rows.map(row => console.log(row));
    }
});



    