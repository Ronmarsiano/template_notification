const express = require('express')
const app = express()
const port = 3000
var request = require('request');
var aad_auth = require('./aad-auth')

var templates_comperator = require('./templates_comperator');

var print_message = function (templates_diff, prefix, attribute) {
    let attribure_str = '';
    if(templates_diff[attribute].length>0){
        attribure_str = prefix + ": ";
        templates_diff[attribute].forEach(element => {
            attribure_str+=("\""+ element.name + "\"[ID: "+ element.id + ", lastUpdatedDateUTC: " + element.lastUpdatedDateUTC + "] ,");
        });
        attribure_str = attribure_str.slice(0, attribure_str.length -1);
        attribure_str+= "."
    }

    return attribure_str;
}

var print_message_html = function (templates_diff, prefix, attribute) {
    let attribute_str = '';
    let tab_space_str = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    let counter = 0;
    if(templates_diff[attribute].length>0){
        attribute_str = "" + tab_space_str;
        templates_diff[attribute].forEach(element => {
            attribute_str+=("\""+ element.name + "\"<sub><em>[ID: "+ element.id + ", lastUpdatedDateUTC: " + element.lastUpdatedDateUTC + "]</em></sub><br>" + tab_space_str);
            counter ++;
        });
        attribute_str = attribute_str.slice(0, attribute_str.length -1);
        attribute_str += ("<br>"+ tab_space_str + "<b>Total: " + counter + "templates.</b>");
    }

    return attribute_str;
}



app.get('/templates_status', (req, res) => {
      var on_token_aquire = function(auth_token) {
        var options = {
            'method': 'GET',
            'url': 'https://management.azure.com/subscriptions/9023f5b5-df22-4313-8fbf-b4b75af8a6d9/resourceGroups/ambawolvese5resourcegroup/providers/Microsoft.OperationalInsights/workspaces/ambawolvese5workspace/providers/Microsoft.SecurityInsights/alertRuleTemplates?api-version=2019-01-01-preview&Accept-Language=en&Authorization=Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjE2NTczNDc4LCJuYmYiOjE2MTY1NzM0NzgsImV4cCI6MTYxNjU3NzM3OCwiX2NsYWltX25hbWVzIjp7Imdyb3VwcyI6InNyYzEifSwiX2NsYWltX3NvdXJjZXMiOnsic3JjMSI6eyJlbmRwb2ludCI6Imh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3VzZXJzLzBhOGU5OGU3LWRjMmItNGIwZS1hZDQ5LTg3MmFkYzk2MzhmYS9nZXRNZW1iZXJPYmplY3RzIn19LCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOFRBQUFBckVMMjJDL1hWdlRka0xUUkdLYXRhMTNGRlFiOXBKUjI5UDZVTnV2ZjVLUkxqenB1eGVTRVZLNnhBSTdMemRDVlBnTzFkU29VcURkVHFmQStWMUwrcDBJY3lvTVBQZkswdVhGcUV2cmZxKzA9IiwiYW1yIjpbInJzYSIsIm1mYSJdLCJhcHBpZCI6ImM0NGI0MDgzLTNiYjAtNDljMS1iNDdkLTk3NGU1M2NiZGYzYyIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiTWFyc2lhbm8iLCJnaXZlbl9uYW1lIjoiUm9uIiwiaXBhZGRyIjoiOTMuMTczLjExNi40OSIsIm5hbWUiOiJSb24gTWFyc2lhbm8iLCJvaWQiOiIwYThlOThlNy1kYzJiLTRiMGUtYWQ0OS04NzJhZGM5NjM4ZmEiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNzIwNTE2MDctMTc0NTc2MDAzNi0xMDkxODc5NTYtMzE1MTM3IiwicHVpZCI6IjEwMDMyMDAwM0VGQTAxMTgiLCJyaCI6IjAuQVJvQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjROQVM4U3dPOEZKdEgyWFRsUEwzendhQURjLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjdEQnFpc0d3NnluVmp6MXpsX0M5RGlSWkVJdzFSaFBXOGdJb0ZJYi1KUWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InJvbWFyc2lhQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJyb21hcnNpYUBtaWNyb3NvZnQuY29tIiwidXRpIjoiNVotZENlY09YVWl5VkVWOERadVVBUSIsInZlciI6IjEuMCIsInhtc190Y2R0IjoxMjg5MjQxNTQ3fQ.KYyyrOVy3qUdwqK53nLoUiXzVB2trrFjuuC4uKnLYjN5yv3fiwyZHlJ68_3FXMcseBJ53SHro4UrS2X3YgeCarDx3uld9tfyglJzec6nVXW5Cbt6HJTGVgHDNV8ucoMOdyvB4L_xQiLJ_Fd5X7UxbU803puBVnzS4qc0r8a8I36hCYWRgm4QRpFlnFN567otfurYI4Xmnygh88_VhOPgQWzpHin5f2wxsiCrwdd2VwAQAqvg1WLeGAymH5mI428tgDUdY1vfN7xciS8JrOEagObtBRXzBiwUo4A9r59OvdHNH_F_SdHAXVlkiSPz9IIp13fACPhKDz4EuqnEQTrlxg&Content-Type=application/json&x-ms-client-request-id=2b836364-6155-4b25-afa9-a440b389c007&x-ms-client-session-id=2eb52edbcde34a00ac3e9eea748404b6&x-ms-command-name=Microsoft_Azure_Security_Insights.',
            'headers': {
              'Authorization': 'Bearer ' + auth_token
            }
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            templates_diff = templates_comperator.compare_templates(response.body);
            templates_diff_json = {
                added_templates: {
                    arr: templates_diff.added_templates,
                    str: print_message(templates_diff, 'Added', 'added_templates')
                },
                updated_templates: {
                    arr: templates_diff.updated_templates,
                    str: print_message(templates_diff, 'Updated', 'updated_templates')
                },
                removed_templates: {
                    arr: templates_diff.removed_templates,
                    str: print_message(templates_diff, 'Removed', 'removed_templates')
                }
            }

            res.send(templates_diff_json)
          });
    }
    aad_auth.get_aad_token(on_token_aquire);
})

app.get('/test', (req, res) => {
    var str = "aaa."
    str.slice(0,-1)
    res.send(str)
   
})


app.get('/status', (req, res) => {
    var on_token_aquire = function(auth_token) {
        var options = {
            'method': 'GET',
            'url': 'https://management.azure.com/subscriptions/9023f5b5-df22-4313-8fbf-b4b75af8a6d9/resourceGroups/ambawolvese5resourcegroup/providers/Microsoft.OperationalInsights/workspaces/ambawolvese5workspace/providers/Microsoft.SecurityInsights/alertRuleTemplates?api-version=2019-01-01-preview&Accept-Language=en&Authorization=Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjE2NTczNDc4LCJuYmYiOjE2MTY1NzM0NzgsImV4cCI6MTYxNjU3NzM3OCwiX2NsYWltX25hbWVzIjp7Imdyb3VwcyI6InNyYzEifSwiX2NsYWltX3NvdXJjZXMiOnsic3JjMSI6eyJlbmRwb2ludCI6Imh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3VzZXJzLzBhOGU5OGU3LWRjMmItNGIwZS1hZDQ5LTg3MmFkYzk2MzhmYS9nZXRNZW1iZXJPYmplY3RzIn19LCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOFRBQUFBckVMMjJDL1hWdlRka0xUUkdLYXRhMTNGRlFiOXBKUjI5UDZVTnV2ZjVLUkxqenB1eGVTRVZLNnhBSTdMemRDVlBnTzFkU29VcURkVHFmQStWMUwrcDBJY3lvTVBQZkswdVhGcUV2cmZxKzA9IiwiYW1yIjpbInJzYSIsIm1mYSJdLCJhcHBpZCI6ImM0NGI0MDgzLTNiYjAtNDljMS1iNDdkLTk3NGU1M2NiZGYzYyIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiTWFyc2lhbm8iLCJnaXZlbl9uYW1lIjoiUm9uIiwiaXBhZGRyIjoiOTMuMTczLjExNi40OSIsIm5hbWUiOiJSb24gTWFyc2lhbm8iLCJvaWQiOiIwYThlOThlNy1kYzJiLTRiMGUtYWQ0OS04NzJhZGM5NjM4ZmEiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNzIwNTE2MDctMTc0NTc2MDAzNi0xMDkxODc5NTYtMzE1MTM3IiwicHVpZCI6IjEwMDMyMDAwM0VGQTAxMTgiLCJyaCI6IjAuQVJvQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjROQVM4U3dPOEZKdEgyWFRsUEwzendhQURjLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjdEQnFpc0d3NnluVmp6MXpsX0M5RGlSWkVJdzFSaFBXOGdJb0ZJYi1KUWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InJvbWFyc2lhQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJyb21hcnNpYUBtaWNyb3NvZnQuY29tIiwidXRpIjoiNVotZENlY09YVWl5VkVWOERadVVBUSIsInZlciI6IjEuMCIsInhtc190Y2R0IjoxMjg5MjQxNTQ3fQ.KYyyrOVy3qUdwqK53nLoUiXzVB2trrFjuuC4uKnLYjN5yv3fiwyZHlJ68_3FXMcseBJ53SHro4UrS2X3YgeCarDx3uld9tfyglJzec6nVXW5Cbt6HJTGVgHDNV8ucoMOdyvB4L_xQiLJ_Fd5X7UxbU803puBVnzS4qc0r8a8I36hCYWRgm4QRpFlnFN567otfurYI4Xmnygh88_VhOPgQWzpHin5f2wxsiCrwdd2VwAQAqvg1WLeGAymH5mI428tgDUdY1vfN7xciS8JrOEagObtBRXzBiwUo4A9r59OvdHNH_F_SdHAXVlkiSPz9IIp13fACPhKDz4EuqnEQTrlxg&Content-Type=application/json&x-ms-client-request-id=2b836364-6155-4b25-afa9-a440b389c007&x-ms-client-session-id=2eb52edbcde34a00ac3e9eea748404b6&x-ms-command-name=Microsoft_Azure_Security_Insights.',
            'headers': {
              'Authorization': 'Bearer ' + auth_token
            }
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            templates_diff = templates_comperator.compare_templates(response.body);

            var html_message = "<h4>This is an automatic message provding the analytic rule template deployment status for the last 7 days.</h4><br>";
            html_message += templates_diff.added_templates.length >0? ("<p><b>Added templates:</b><br>" + print_message_html(templates_diff, 'Added', 'added_templates') + "</p><br>"):""
            html_message += templates_diff.removed_templates.length >0? ("<p><b>Removed templates:</b><br>" + print_message_html(templates_diff, 'Removed', 'removed_templates') + "</p><br>"):""
            html_message += templates_diff.updated_templates.length >0? ("<p><b>Updated templates:</b><br>" + print_message_html(templates_diff, 'Updated', 'updated_templates') + "</p><br>"):""
    
            res.send(html_message)
          });
    }
    aad_auth.get_aad_token(on_token_aquire);
   
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})