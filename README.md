# Android iOS Drive Export

This script aims to help you to manage your strings resources for Android & iOS.

##How it works?

1. Create a spreadsheet on Google Drive with this model:
https://docs.google.com/spreadsheets/d/1H3QRgSZC_27smVWyLGmQlqPwcvyXOO24Sth3-97jkHc
2. Go to Tools => Script Editor and paste the script.
3. Save the script

Now you can run manually the script on the script editor by
- Run the method "exportForAll".

or

- Come back on the spreadsheet and click on the custom menu  'Export Localized Strings' => 'All' (if necessary reload the page) and wait for the dialog.

The script will generate the next folders & files:
```
/App Name
  /Android
    /values-en
      /strings.xml
    /values-fr
      /strings.xml
    ...
  /iOS
    /Localizable_EN.strings
    /Localizable_FR.strings
    ...
```

