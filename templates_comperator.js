
module.exports = {

    compare_templates : function(api_templates_str){
        var storage = require('./storage');
        var parse_templates = function(templates){
            var templtes_set = {};
            templates.forEach(element => {
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
            let added_templates = [];
            let api_keys = Object.keys(api_templates);
            api_keys.forEach(api_single_key => {
                if(storage_templates[api_single_key] == undefined){
                    console.warn("added template ")
                    console.warn(api_templates[api_single_key])
                    added_templates.push(api_templates[api_single_key]);
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
        var get_updated_templates = function(api_templates, storage_templates){
            let updated_templates = [];
            let api_keys = Object.keys(api_templates);
            api_keys.forEach(api_single_key => {
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


        var api_templates_json = JSON.parse(api_templates_str);
        var api_templates = parse_templates(api_templates_json.value);

        // TODO remove with read from file 
        var copy = JSON.parse(JSON.stringify(api_templates));
        copy['ron'] = {id:"738702fd-0a66-42c7-8586-e30f0583f8fe",name:"hand made ",lastUpdatedDateUTC:"5445454"};
        copy["/subscriptions/fdee8146-8bcf-460f-86f3-3f788c285efd/resourceGroups/p_romarsia/providers/Microsoft.OperationalInsights/workspaces/romarisa-workspace/providers/Microsoft.SecurityInsights/AlertRuleTemplates/738702fd-0a66-42c7-8586-e30f0583f8fe"].lastUpdatedDateUTC ='5445454';

        // TODO end 
        let updated_templates = get_updated_templates(copy,api_templates);
        let added_templates = get_added_templates(copy, api_templates);

        return {
            updated_templates: updated_templates,
            added_templates: added_templates
        }

    }
}