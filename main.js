// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { brewDB, grainDB } = require('./db.js');
const path = require('path');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'main/preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname,'main/index.html'));
  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // create the window for new batch entry
  ipcMain.on('createBatchWindow', handleCreateBatchWindow);
  // create the database entry for new batch
  ipcMain.on('createBatchEntry', handleCreateNewBatch);
  // retrieve the data and return it to the UI
  ipcMain.handle('batchData', handleBatchData);
  //open the details page for certain batch
  ipcMain.on('createViewWin', handleCreateViewWindow);

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// close the database on quitting
app.on('will-quit', () => {
  brewDB.close();
  grainDB.close();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// id is the batchID number
function handleCreateViewWindow(event, id) {
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const viewWin = new BrowserWindow({
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'details/preloadDetails.js'),
      additionalArguments: [`${id}`],
    }
  });

  viewWin.loadFile(path.join(__dirname, 'details/details.html'));
  //viewWin.webContents.openDevTools();
}

// retrieve info about active batches
function handleBatchData() {
  return new Promise((resolve,reject) => {
    // run the query
    brewDB.all('SELECT * FROM batch', 
      function(err, rows){
        if (!err){
          resolve(rows);
        } else {
          reject(err);
        }
      }
    );
  });
}

// create child window to input grain data
function handleCreateBatchWindow(event) {
  const webContents = event.sender;
  const parent = BrowserWindow.fromWebContents(webContents);

  const batchWindow = new BrowserWindow({
    parent: parent,
    webPreferences: {
      preload: path.join(__dirname, 'create/preloadBatch.js'),
    }
  });

  batchWindow.loadFile(path.join(__dirname,'create/createBatch.html'));
  //batchWindow.webContents.openDevTools();
}

//add data entries to the database, entires is list 
// of (grainType,lbGrain) in form (string,float)
function handleCreateNewBatch(event, name, grainBill, entries) {
  // queue of sql queries to run sequentially
  let grainQueue = []
  grainQueue.push(`CREATE TABLE ${grainBill} (grainType TEXT, grainLb REAL);`);
  
  //find the smallet batch ID and add one to it
  
  // query to retireve smallest batch
  brewDB.get('SELECT MAX(batchID) FROM batch;', 
    function (err, row) {
      let batchID;
      console.log(row);
      if (!err) {
        if (row['MAX(batchID)']) {batchID = row['MAX(batchID)']+1}
        else {batchID = 1}

        const date = (new Date()).toLocaleDateString();
        // query to add the next entry
        brewDB.run(`INSERT INTO batch VALUES (${batchID}, "${name}", "${grainBill}", "${date}");`);
      } else {
        console.log(err);
      }
    }
  );

  // enter the grain entries
  entries.map(entry => {
    let grainType = entry[0];
    let lbGrain = entry[1];

    grainQueue.push(`INSERT INTO ${grainBill} (grainType, grainLb) VALUES ("${grainType}", ${lbGrain});`)
  });

  // run grain queries sequentially
  grainDB.serialize(() => {
    grainQueue.map(sql => {
      grainDB.run(sql);
    });
  });
  
  const webContents = event.sender;
  const createWin = BrowserWindow.fromWebContents(webContents);
  
  // get parent window and update existing batches
  const mainWin = createWin.getParentWindow();
  mainWin.reload();

  //finally close the window
  createWin.close();
}


