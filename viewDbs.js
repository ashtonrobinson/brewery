const sqlite3 = require('sqlite3').verbose();
const brewDB = new sqlite3.Database('brewDB');
const grainDB = new sqlite3.Database('grainDB');



brewDB.serialize(() => {
    brewDB.all(`SELECT * FROM mash`, function (err, rows){
        console.log("Mash Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM kettle`, function (err, rows){
        console.log("Kettle Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM fermentor`, function (err, rows){
        console.log("Fermentor Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM centrifuge`, function (err, rows){
        console.log("Centrifuge Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM brite`, function (err, rows){
        console.log("Brite Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });

    brewDB.all(`SELECT * FROM output`, function (err, rows){
        console.log("Output Table")
        if(!err){
            rows.map(row => console.log(row));
        }
        console.log("\n");
    });
});

// print batch and grain data
brewDB.all('SELECT * FROM batch', 
    function (err, rows){
        let grainNames = [];
        if (!err){
            let grainNames = rows.map(row => row['nameGrainBill']);
            
            grainDB.serialize(() => {
                grainNames.map(name => {
                    console.log(`Grain Table for ${name}`);
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
                    console.log("\n");
                });
            });
            
        } else {
            console.log(err);
        }
    }  
);



    