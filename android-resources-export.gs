var appName = "appName";

// Export resources function
function exportResources() {
  
  // Folders
  // Data are exported here => My Drive/Export/$appName/...
  var parentFolder = DriveApp.getFolderById(DriveApp.getRootFolder().getId());
  var exportFolder = createOrGetFolder("Export", parentFolder);
  var appExportFolder = createOrGetFolder(appName, exportFolder);
  var androidFolder = createOrGetFolder("Android", appExportFolder);
  var iOSFolder = createOrGetFolder("iOS", appExportFolder);
    
  // Data
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var i = 2;
  while (data[1][i] != null && data[1][i].length > 0) {
  
    var results = data[1][i].match(/\((\w\w)\)/g);
    if (results.length > 0) {
      var language = results[0].replace("(", "").replace(")", "");
      createAndroidResources(language, data, androidFolder, i);
      createIOSResources(language, data, iOSFolder, i);
    }
    
    i++;
  }
  
}

function getThisScriptInDrive() {
  return DriveApp.getFileById("some unique string that wont be anywhere else / bZjxcps4UfBZfnc.E")[0];
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
  
  for (var i = 3; i < data.length; i++) {
    
    if (data[i][1].length == 0) {
      continue;
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n\t<!-- " + data[i][0] + " -->";
    }
    
    var formatted = "";
    if (data[i][2].indexOf("%s") > -1 || data[i][2].indexOf("%d") > -1) {
        formatted = ' formatted="false"';
    }
    
    var escapedContent = data[i][column]
    .replace("&", "&amp;")
    .replace(new RegExp("\'", 'g'), "\\'")
    .replace(new RegExp("\\.\\.\\.", 'g'), "&#8230;");
    
    content += '\n\t<string name="' + data[i][1] + '"' + formatted + '>' + escapedContent + '</string>';
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
  
  for (var i = 3; i < data.length; i++) {
    
    if (data[i][1].length == 0) {
      continue;
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n// " + data[i][0] + "";
    }

    var value = data[i][column];
    value = value.replace("%s", "%@");
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
