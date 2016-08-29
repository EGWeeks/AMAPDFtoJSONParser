## AMA PDF to JSON parser

Built for the purpose of building an API for pro motocross data. I was not able to find any other data format other than PDFs from [american motocross results](http://americanmotocrossresults.com/). 

### Short Description 

The Node.js app is downloading all the lap time PDFs then parsing them to JSON. Some reading and writing to the drive in the middle. 

Then the last step is sending the JSON up to the hosted database connected to the [Pro Motocross API](http://promotocrossapi.com). This is one of the unique processes of the parser app. Instead of using a driver to connect to my hosted database I am use Node's core module Child Process to execute some shell files. For no particular purpose other than to test out child process, which is awesome.