fs = require('fs');
module.exports = {
    get_aad_token: function name(on_token_aquire) {
        var adal = require('adal-node').AuthenticationContext;
        var authorityHostUrl = 'https://login.windows.net';
        var tenant = '5b5a146c-eba8-46af-96f8-e31b50d15a3f';
        var authorityUrl = authorityHostUrl + '/' + tenant;
        var clientId = 'ddc55c25-8118-4f41-8095-c3d2fbab7eeb';
        var clientSecret = 'n20gpu2JBe3IRRi~Fu_fM7aYRq.E5RyO~e';
        var resource = 'api://ddc55c25-8118-4f41-8095-c3d2fbab7eeb';
        resource = 'https://management.azure.com'
        var context = new adal(authorityUrl);

        context.acquireTokenWithClientCredentials(resource, clientId, clientSecret,
        (err, token_response) => {
            if (err) {
                console.log(`Token generation failed due to ${err}`);
            } 
            else {
                on_token_aquire(token_response.accessToken)
            }
        });
    }
}