# Wrap Up

## File Storage

Multer was used as the middleware to extract files from incoming requests and storing them as specified in the code

## Serving Files

Images were served staticly with the help of ExpressJS, meanwhile there was another approach to serving the invoice PDF when a order is completed, the three options where: Storing it on memory then serving, stream it to the browser (using fs.pipe), the approach used was to use the PDFKit library to create, stream to the client and save it on the server.

### Worthy read: [Node.js Streams: Everything you need to know](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)
