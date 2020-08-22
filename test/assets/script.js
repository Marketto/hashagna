function test(method) {
    Hashagna.HashagnaHttpClient[method]('/api/auto-redirect', { code: document.getElementById('code').value })
        .then(function(response) {
            document.getElementById('result').value = response.hashParams.result;
        })
        .catch(function() {
            document.getElementById('result').value = 'error';
        });
}