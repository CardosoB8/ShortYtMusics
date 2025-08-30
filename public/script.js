document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timer-text');
    const downloadLink = document.getElementById('download-link');

    // O link é fixado para "video_viral".
    const requestedLinkName = 'video_viral';

    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                // Adiciona um tratamento de erro mais claro para o problema de carregamento do arquivo
                throw new Error('Erro ao carregar o arquivo links.json. Verifique a sua localização.');
            }
            return response.json();
        })
        .then(links => {
            const finalUrl = links[requestedLinkName];
            if (finalUrl) {
                let timeLeft = 15;
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
