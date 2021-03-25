fs = require('fs');
module.exports = {

    save_templates: function(templates){
        fs.writeFile('templates.json', JSON.stringify(templates), function (err) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
          });
    },
    get_templates: function(){
        let rawdata = fs.readFileSync('templates.json');
        return JSON.parse(rawdata);
    }
}