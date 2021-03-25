const express = require('express')
const app = express()
const port = 443
const https = require('https');
var request = require('request');
var storage = require('./storage');

var templates_comperator = require('./templates_comperator');


app.get('/', (req, res) => {
    var options = {
        'method': 'GET',
        'url': 'https://management.azure.com/subscriptions/fdee8146-8bcf-460f-86f3-3f788c285efd/resourceGroups/p_romarsia/providers/Microsoft.OperationalInsights/workspaces/romarisa-workspace/providers/Microsoft.SecurityInsights/alertRuleTemplates?api-version=2019-01-01-preview&Accept-Language=en&Authorization=Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjE2NTczNDc4LCJuYmYiOjE2MTY1NzM0NzgsImV4cCI6MTYxNjU3NzM3OCwiX2NsYWltX25hbWVzIjp7Imdyb3VwcyI6InNyYzEifSwiX2NsYWltX3NvdXJjZXMiOnsic3JjMSI6eyJlbmRwb2ludCI6Imh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3VzZXJzLzBhOGU5OGU3LWRjMmItNGIwZS1hZDQ5LTg3MmFkYzk2MzhmYS9nZXRNZW1iZXJPYmplY3RzIn19LCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOFRBQUFBckVMMjJDL1hWdlRka0xUUkdLYXRhMTNGRlFiOXBKUjI5UDZVTnV2ZjVLUkxqenB1eGVTRVZLNnhBSTdMemRDVlBnTzFkU29VcURkVHFmQStWMUwrcDBJY3lvTVBQZkswdVhGcUV2cmZxKzA9IiwiYW1yIjpbInJzYSIsIm1mYSJdLCJhcHBpZCI6ImM0NGI0MDgzLTNiYjAtNDljMS1iNDdkLTk3NGU1M2NiZGYzYyIsImFwcGlkYWNyIjoiMiIsImZhbWlseV9uYW1lIjoiTWFyc2lhbm8iLCJnaXZlbl9uYW1lIjoiUm9uIiwiaXBhZGRyIjoiOTMuMTczLjExNi40OSIsIm5hbWUiOiJSb24gTWFyc2lhbm8iLCJvaWQiOiIwYThlOThlNy1kYzJiLTRiMGUtYWQ0OS04NzJhZGM5NjM4ZmEiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNzIwNTE2MDctMTc0NTc2MDAzNi0xMDkxODc5NTYtMzE1MTM3IiwicHVpZCI6IjEwMDMyMDAwM0VGQTAxMTgiLCJyaCI6IjAuQVJvQXY0ajVjdkdHcjBHUnF5MTgwQkhiUjROQVM4U3dPOEZKdEgyWFRsUEwzendhQURjLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IjdEQnFpc0d3NnluVmp6MXpsX0M5RGlSWkVJdzFSaFBXOGdJb0ZJYi1KUWMiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6InJvbWFyc2lhQG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJyb21hcnNpYUBtaWNyb3NvZnQuY29tIiwidXRpIjoiNVotZENlY09YVWl5VkVWOERadVVBUSIsInZlciI6IjEuMCIsInhtc190Y2R0IjoxMjg5MjQxNTQ3fQ.KYyyrOVy3qUdwqK53nLoUiXzVB2trrFjuuC4uKnLYjN5yv3fiwyZHlJ68_3FXMcseBJ53SHro4UrS2X3YgeCarDx3uld9tfyglJzec6nVXW5Cbt6HJTGVgHDNV8ucoMOdyvB4L_xQiLJ_Fd5X7UxbU803puBVnzS4qc0r8a8I36hCYWRgm4QRpFlnFN567otfurYI4Xmnygh88_VhOPgQWzpHin5f2wxsiCrwdd2VwAQAqvg1WLeGAymH5mI428tgDUdY1vfN7xciS8JrOEagObtBRXzBiwUo4A9r59OvdHNH_F_SdHAXVlkiSPz9IIp13fACPhKDz4EuqnEQTrlxg&Content-Type=application/json&x-ms-client-request-id=2b836364-6155-4b25-afa9-a440b389c007&x-ms-client-session-id=2eb52edbcde34a00ac3e9eea748404b6&x-ms-command-name=Microsoft_Azure_Security_Insights.',
        'headers': {
          'Authorization': 
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNjE2NjY0ODAxLCJuYmYiOjE2MTY2NjQ4MDEsImV4cCI6MTYxNjY2ODcwMSwiX2NsYWltX25hbWVzIjp7Imdyb3VwcyI6InNyYzEifSwiX2NsYWltX3NvdXJjZXMiOnsic3JjMSI6eyJlbmRwb2ludCI6Imh0dHBzOi8vZ3JhcGgud2luZG93cy5uZXQvNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3VzZXJzLzBhOGU5OGU3LWRjMmItNGIwZS1hZDQ5LTg3MmFkYzk2MzhmYS9nZXRNZW1iZXJPYmplY3RzIn19LCJhY3IiOiIxIiwiYWlvIjoiQVZRQXEvOFRBQUFBQW1lcW5vY1JNRjdCbWNDVHZ6NWRBVHF1S21zVkV5S0d4Zk1ueHZGczZQeEw2Zm5xOTZoendmRjNadnNUSmljTWpNTmo4UmhCblRsaHFlcDVneXRYNW1XMVpBOWhRYVZuaFdhajBrb0hVMzg9IiwiYW1yIjpbInJzYSIsIm1mYSJdLCJhcHBpZCI6ImM0NGI0MDgzLTNiYjAtNDljMS1iNDdkLTk3NGU1M2NiZGYzYyIsImFwcGlkYWNyIjoiMiIsImRldmljZWlkIjoiMWEyZDViMTgtZjM2OC00MmY0LTlmM2YtMGZhMmM2ZTA4MWY5IiwiZmFtaWx5X25hbWUiOiJNYXJzaWFubyIsImdpdmVuX25hbWUiOiJSb24iLCJpcGFkZHIiOiI5My4xNzMuMTE2LjQ5IiwibmFtZSI6IlJvbiBNYXJzaWFubyIsIm9pZCI6IjBhOGU5OGU3LWRjMmItNGIwZS1hZDQ5LTg3MmFkYzk2MzhmYSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS03MjA1MTYwNy0xNzQ1NzYwMDM2LTEwOTE4Nzk1Ni0zMTUxMzciLCJwdWlkIjoiMTAwMzIwMDAzRUZBMDExOCIsInJoIjoiMC5BUm9BdjRqNWN2R0dyMEdScXkxODBCSGJSNE5BUzhTd084Rkp0SDJYVGxQTDN6d2FBRGMuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic3ViIjoiN0RCcWlzR3c2eW5WanoxemxfQzlEaVJaRUl3MVJoUFc4Z0lvRkliLUpRYyIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInVuaXF1ZV9uYW1lIjoicm9tYXJzaWFAbWljcm9zb2Z0LmNvbSIsInVwbiI6InJvbWFyc2lhQG1pY3Jvc29mdC5jb20iLCJ1dGkiOiI1Wi1kQ2VjT1hVaXlWRVY4MDlmVkFRIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjEyODkyNDE1NDd9.RPjHJ1ozLMIMuipFK8ym1PCHxtpPqv_7sibihDXWCG0_s-ZPfzh0SKzxVMUwUMJFESe2W-pfwwRedIUrytl1Idy1qn0jVauhjVrldYpydEq0OR5smHddHWF4vEfWR5Akei3-A55niSx206ATl8SGpo62x5qUUQhJjlzVmdFG7j-_iClnNQVEPYrNXrK0Qk-iEFf8KYI9dQLLa7WVGiXlt2Vn_nwCIXfwqx0sVDT3Lc0tZw1QcPLqPq0h4aCtF98E-VTR1skDaRweCLBG-Ip35dZSBeei1-KuPEceDZCKlcwjZ8MoS-lh2xCgTsau3fwfY8KX8T388QCafrXEX-EVYA'
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        templates_diff = templates_comperator.compare_templates(response.body);

        
        res.send(templates_diff)
      });
   
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})