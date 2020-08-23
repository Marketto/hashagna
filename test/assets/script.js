function test(method, iFrameId) {
    Hashagna.HashagnaHttpClient[method]('/api/auto-redirect', { code: document.getElementById('code').value }, { iFrameId: iFrameId })
        .then(function(response) {
            document.getElementById('result').value = response.hashParams.result;
        })
        .catch(function() {
            document.getElementById('result').value = 'error';
        });
}