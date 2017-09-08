var fs = require('fs');

fs.readFile('img/mel.jpg', function (error, buffer) {
    console.log('===> Arquivo Lido <===');
    if(error){
        console.log(error)
    }

    fs.writeFile('img/imagemCriada.jpg', buffer, function (err) {
       console.log('===> Arquivo escrito <===')
    });
});