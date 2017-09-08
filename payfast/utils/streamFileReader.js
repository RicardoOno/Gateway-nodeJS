//curl -X POST http://localhost:3001/upload/imagem --data-binary @mel.jpg -H "Contenty-type: application/octet-stream"
var fs = require('fs');

fs.createReadStream('img/mel.jpg')
    .pipe(fs.createWriteStream('img/imgComStream.jpg'))
    .on('finish', function () {
        console.log('===> Arquivo escrito com stream <===');
    });

