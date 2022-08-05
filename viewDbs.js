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


    