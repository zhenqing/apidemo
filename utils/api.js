var axios = require('axios')

module.exports = {
    fetchAccountLogs: function(account, country, account_name) {
        var encodeURI = window.encodeURI('http://a9test.ibport.com/api/v1/account_logs?country=' + country + '&account=' + account + '&account_name=' + account_name +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    }
}

