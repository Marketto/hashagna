import {HashagnaHttpClient} from '/dist/hashagna.mjs';
window.test = (method, iFrameId) => {
    const code = document.getElementById('code').value;
    HashagnaHttpClient[method]('/api/auto-redirect', { code }, { iFrameId })
        .then(({ hashParams }) => {
            document.getElementById('result').value = hashParams.result;
        })
        .catch(() => {
            document.getElementById('result').value = 'error';
        });
}