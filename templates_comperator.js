module.exports = {
    compare_templates : function(api_templates_str){
        var storage = require('./storage');

        /**
         * 
         * @param {*} api_templates_str 
         * @returns a set of templates with minimal property set (id, name, modification date)
         */
        var parse_templates = function(api_templates_str){
            let api_templates_json = JSON.parse(api_templates_str);
            let api_templates = api_templates_json.value;
            let templtes_set = {};
            api_templates.forEach(element => {
                templtes_set[element.id] = {};
                templtes_set[element.id].id = element.name;
                templtes_set[element.id].name = element.properties.displayName;
                templtes_set[element.id].lastUpdatedDateUTC = Date.parse(element.properties.lastUpdatedDateUTC);
            });
    
            return templtes_set;
        };

        /**
         * 
         * @param {*} api_templates - templates got from the API
         * @param {*} storage_templates - templates got from storage
         * @returns an array of templates that were added between the snapshots
         */
        var get_added_templates = function(api_templates, storage_templates){
            return get_templates_diff(api_templates, storage_templates);
        }

        /**
         * 
         * @param {*} api_templates - templates from the storage
         * @param {*} storage_templates - templaes from the API
         * @returns an array of templates that were added
         */
        var get_removed_templates = function(api_templates, storage_templates){
            return get_templates_diff(storage_templates, api_templates);
        }

        /**
         * 
         * @param {*} src_templates 
         * @param {*} dst_templates 
         * @returns we want to see templates that are in src but not in dst
         */
        var get_templates_diff = function(src_templates, dst_templates){
            let added_templates = [];
            let src_templates_keys = Object.keys(src_templates);
            src_templates_keys.forEach(src_single_key => {
                if(src_single_key!= 'snapshot_time' && dst_templates[src_single_key] == undefined){
                    added_templates.push(src_templates[src_single_key]);
                }
            });

            return added_templates;
        }

        /**
         * 
         * @param {*} api_templates - templates got from the API
         * @param {*} storage_templates - templates got from storage
         * @returns an array of templaes that were edited between snapshots 
         */
        var get_updated_templates = function(api_templates,storage_templates){
            let updated_templates = [];
            let api_templates_keys = Object.keys(api_templates);
            api_templates_keys.forEach(api_single_key => {
                // changed templates must be shared between snapshots 
                if (storage_templates[api_single_key] != undefined){
                    // time has changed 
                    if (storage_templates[api_single_key].lastUpdatedDateUTC != api_templates[api_single_key].lastUpdatedDateUTC){
                        updated_templates.push(api_templates[api_single_key]);
                    }
                }
            });

            return updated_templates;
        }

        let storage_templates = storage.get_templates();
        let api_templates = parse_templates(api_templates_str);
        let updated_templates = get_updated_templates(api_templates, storage_templates);
        let removed_templates = get_removed_templates(api_templates, storage_templates);
        let added_templates = get_added_templates(api_templates, storage_templates);
        

        storage.save_templates(api_templates);

        return {
            snapshot_date: new Date(new Date().toUTCString()),
            updated_templates: updated_templates,
            added_templates: added_templates,
            removed_templates: removed_templates
        }
    }
}