var axios = require('axios')

module.exports = {
    fetchAccountLogs: function(account, country) {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/account_logs?country=' + country + '&account=' + account +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    }
}

