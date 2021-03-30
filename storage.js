fs = require('fs');
module.exports = {
    storage: undefined,
    save_templates: function(templates){
        templates.snapshot_time = Date.now();
        if(this.should_save(templates)){
            console.log("Should save now - " + templates.snapshot_time + " snapshot - " + this.get_templates().snapshot_time+ " Diff = " +(templates.snapshot_time - this.get_templates().snapshot_time))
            fs.writeFile('templates.json', JSON.stringify(templates), function (err) {
                if (err) return console.log(err);
              });
        }
        else{
            console.log("Should not save now - " + templates.snapshot_time + " snapshot - " + this.get_templates().snapshot_time+ " Diff = " +(templates.snapshot_time - this.get_templates().snapshot_time))
        }

    },
    should_save: function (new_snapshot) {
        var time_diff = 7 * 24 * 3600 * 1000;
        let old_snapshots = this.get_templates();
        console.warn(!old_snapshots.snapshot_time )
        console.warn(((new_snapshot.snapshot_time - old_snapshots.snapshot_time) > time_diff) )
        console.warn( !old_snapshots.snapshot_time || ((new_snapshot.snapshot_time - old_snapshots.snapshot_time) > time_diff) )
        return !old_snapshots.snapshot_time || ((new_snapshot.snapshot_time - old_snapshots.snapshot_time) > time_diff) 
    },
    get_templates: function(){
        let rawdata = fs.readFileSync('templates.json');
        return JSON.parse(rawdata);
    }
}