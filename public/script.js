document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timer-text');
    const downloadLink = document.getElementById('download-link');

    // Simular que pegamos o link de algum lugar (por exemplo, da URL)
    // Para simplificar, vamos usar um link de exemplo que está no links.json
    const requestedLinkName = 'video_viral'; 

    fetch('links.json')
        .then(response => response.json())
        .then(links => {
            const finalUrl = links[requestedLinkName];
            if (finalUrl) {
                let timeLeft = 15; // 15 segundos
                timerText.textContent = `Aguarde ${timeLeft} segundos...`;

                const countdown = setInterval(() => {
                    timeLeft--;
                    timerText.textContent = `Aguarde ${timeLeft} segundos...`;

                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        timerText.style.display = 'none';
                        document.getElementById('title').textContent = 'Seu download está pronto!';
                        downloadLink.href = finalUrl;
                        downloadLink.style.display = 'inline-block';
                    }
                }, 1000);
            } else {
                // Caso o link não seja encontrado no JSON
                timerText.textContent = "Erro: Link não encontrado.";
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo links.json:', error);
            timerText.textContent = "Erro ao carregar os links.";
        });
});