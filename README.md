# Android iOS Drive Export

This script aims to help you to manage your strings resources for Android & iOS.

##How it works?

1. Create a spreadsheet on Google Drive with this model:
https://docs.google.com/spreadsheets/d/1H3QRgSZC_27smVWyLGmQlqPwcvyXOO24Sth3-97jkHc
2. Go to Tools => Script Editor and paste the script.
3. Run the method "exportResources".

The script will generate the next folders & files:
```
My Drive
  /Export
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

