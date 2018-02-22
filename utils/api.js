var axios = require('axios')

module.exports = {
    fetchAccountLogs: function(account, country, account_name, business, belonging) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/account_logs?country=' + country + '&account=' + account + '&account_name=' + account_name + '&business=' + business + '&belonging=' + belonging +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchFunds: function(account, country, account_name, business, belonging) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/account_logs/fund?country=' + country + '&account_name=' + account_name + '&business=' + business + '&belonging=' + belonging +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchFundsTmr: function(account, country, account_name, business, belonging) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/account_logs/fund?country=' + country + '&account_name=' + account_name + '&business=' + business + '&belonging=' + belonging +'&option=tomorrow&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchFundsWeek: function(account, country, account_name, business, belonging) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/account_logs/fund?country=' + country + '&account_name=' + account_name + '&business=' + business + '&belonging=' + belonging +'&option=nextweek&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchFund: function(belonging, account_name) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/account_logs/fundsummarybytime?belonging=' + belonging + '&account_name=' + account_name +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchRoles: function() {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/roles')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchStatusStatistic: function(account, country, account_name) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/account_logs/statistic?country=' + country + '&account=' + account + '&account_name=' + account_name +'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchReports: function() {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/work_reports?user_id=3'+'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    },
    fetchAccountDetail: function(account_name) {
        var encodeURI = window.encodeURI('https://a9test.ibport.com/api/v1/accounts?name=' + account_name+'&access_token=b41127cf658eeb348ebc5a9513826bb0')
        return axios.get(encodeURI)
            .then(function (response) {
                return response.data;
            });
    }
}

