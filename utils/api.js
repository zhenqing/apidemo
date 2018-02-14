var axios = require('axios')

module.exports = {
    fetchAccountLogs: function(account, country, account_name, business, belonging) {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/account_logs?country=' + country + '&account=' + account + '&account_name=' + account_name + '&business=' + business+ '&log_date=2018-02-01' + '&belonging=' + belonging +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchFunds: function(account, country, account_name, business, belonging) {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/account_logs/fund?country=' + country + '&account_name=' + account + '&business=' + business+ '&log_date=2018-02-01' + '&belonging=' + belonging +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchFund: function(account_name) {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/account_logs/fund?account_name=' + account_name +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchRoles: function() {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/roles')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchStatusStatistic: function(account, country, account_name) {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/account_logs/statistic?country=' + country + '&account=' + account + '&account_name=' + account_name +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchReports: function() {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/work_reports?user_id=3'+'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchAccountDetail: function(account_name) {
        var encodeURI = window.encodeURI('http://localhost:3002/api/v1/accounts?name=' + account_name+'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    }
}

