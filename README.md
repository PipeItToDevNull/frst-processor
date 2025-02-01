# FRST-Processor
A React web app for viewing and processing FRST reports into Fixlists.

## Usage
1. The application will ingest an zip file containing FRST.txt and Addition.txt then display them.
2. Click any report line to select it and mark it to be fixed, when you have all the lines selected that you want fixed click "Create Fixlist"
3. The final page will display a canned response to paste to the user as well as the fixlist. Click "Download fixlist" to download the fixlist that you will manually supply to the user.

## Modifications
`src/fixlist.js` contains 3 variables
- Canned response
    - The message that can be pasted to the user explaining how to use the fixlist
- Fixlist start
    - A pre-defined header for the fixlist
- Fixlist end
    - A pre-defined end for the fixlist