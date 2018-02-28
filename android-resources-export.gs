var appName = "Your App";

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Export Localized Strings')
      .addItem('All', 'exportForAll')
      .addItem('iOS', 'exportForIos')
      .addItem('Android', 'exportForAndroid')
      .addToUi();
}

function exportForAll() {
  exportResources(true, true);
}

function exportForIos() {
  exportResources(true, false);
}

function exportForAndroid() {
  exportResources(false, true);
}

// Export resources function
function exportResources(iOS,Android) {
  
  // Folders
  var appFolder = createOrGetFolder(appName);
  var androidFolder = createOrGetFolder("Android", appFolder);
  var iOSFolder = createOrGetFolder("iOS", appFolder);
  
  // Data
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var i = 2;
  while (data[1][i] != null && data[1][i].length > 0) {
  
    var results = data[1][i].match(/\((\w\w)\)/g);
    if (results.length > 0) {
      var language = results[0].replace("(", "").replace(")", "");
      
      if (Android){
          createAndroidResources(language, data, androidFolder, i);
      }
      
      if (iOS){
          createIOSResources(language, data, iOSFolder, i);
      }
      
    }
    
    i++;
  }
  
  SpreadsheetApp.getUi().alert('Woooow 🎉', '🎊 Exported with success! 🎊', SpreadsheetApp.getUi().ButtonSet.OK);
}

// Create an XML file for Android
// language: Current language
// data:     Spreadsheet data array
// folder:   Folder where create the file
// column:   Index of the column
function createAndroidResources(language, data, folder, column) {
  
  var folderName = "values-" + language;
  var languageFolder = createOrGetFolder(folderName, folder);
  
  var content = "<resources>";
  content += "\n\n";
  content += "\t<!-- App name -->";
  content += '\n\t<string name="app_name">' + appName + '</string>';
  
  for (var i = 3; i < data.length; i++) {
    
    var key = data[i][1];
    if (key.length == 0) {
      continue;
    } else {
      key = key.replace(/[.]/g,"_");
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n\t<!-- " + data[i][0] + " -->";
    }
    
    var formatted = "";
    
    if (data[i][2].indexOf("%s") > -1 || data[i][2].indexOf("%d") > -1) {
        formatted = ' formatted="false"';
    }
   
    var escapedContent;
    escapedContent = data[i][column]
    .replace(new RegExp("\'", 'g'), "\\'")
    .replace(new RegExp("\\.\\.\\.", 'g'), "&#8230;");
   
    content += '\n\t<string name="' + key + '"' + formatted + '>' + escapedContent + '</string>';
  }
  
  content += "\n\n</resources>";
  
  var file = createOrGetFile("strings.xml", languageFolder);
  file.setContent(content);
}

// Create a localizable file for iOS
// language: Current language
// data:     Spreadsheet data array
// folder:   Folder where create the file
// column:   Index of the column
function createIOSResources(language, data, folder, column) {
    
  var content = "// App";
  content += "\n";
  content += '"APP_NAME" = "' + appName + '";';
  
  for (var i = 3; i < data.length; i++) {
    
    if (data[i][1].length == 0) {
      continue;
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n// " + data[i][0] + "";
    }

    var value = data[i][column];
    value = value.replace(/%[0-9]+\$s/g, "%@");
    value = value.replace(/%[0-9]+\$d/g, "%@");
    value = value.replace(/"/g, '\\"');
    value = value.replace(/(?:\r\n|\r|\n)/g, '\\n');
    
    content += '\n"' + data[i][1] + '" = "' + value + '";';
  }
  
  var fileName = "Localizable_" + language.toUpperCase() + ".strings";
  var file = createOrGetFile(fileName, folder);
  file.setContent(content);
}



////////////
// HELPER //
////////////

// Check folder
function createOrGetFolder(name, folder) {
  var folders;
  if (folder == undefined) {
    folders = DriveApp.getFoldersByName(name)
  } else {
    folders = folder.getFoldersByName(name)
  }
  
  var mainFolder;
  if (folders.hasNext()) {
    mainFolder = folders.next();
  } else {
     if (folder == undefined) {
       mainFolder = DriveApp.createFolder(name);
     } else {
       mainFolder = folder.createFolder(name);
     }
  } 
  
  return mainFolder;
}


// Check file
function createOrGetFile(name, folder) {
  var files;
  if (folder == undefined) {
    files = DriveApp.getFilesByName(name)
  } else {
    files = folder.getFilesByName(name)
  }
  
  var file;
  if (files.hasNext()) {
    file = files.next();
  } else {
     if (folder == undefined) {
       file = DriveApp.createFile(name, "");
     } else {
       file = folder.createFile(name, "");
     }
  } 
  
  return file;
}
