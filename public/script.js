document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timer-text');
    const countdownElement = document.getElementById('countdown');
    const progressElement = document.getElementById('progress');
    const downloadLink = document.getElementById('download-link');
    const titleElement = document.getElementById('title');
    const errorMessage = document.getElementById('error-message');

    
    const requestedLinkName = 'video_viral'; 

    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os links.');
            }
            return response.json();
        })
        .then(links => {
            const finalUrl = links[requestedLinkName];
            if (finalUrl) {
                let timeLeft = 15; // 15 segundos
                countdownElement.textContent = timeLeft;
                timerText.textContent = `Por favor, aguarde ${timeLeft} segundos`;

                const countdown = setInterval(() => {
                    timeLeft--;
                    countdownElement.textContent = timeLeft;
                    timerText.textContent = `Por favor, aguarde ${timeLeft} segundos`;
                    
                    // Atualiza a barra de progresso
                    progressElement.style.width = ((15 - timeLeft) / 15 * 100) + '%';

                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        titleElement.textContent = 'Seu download está pronto!';
                        downloadLink.href = finalUrl;
                        downloadLink.classList.add('show');
                        
                        // Esconder elementos desnecessários
                        document.querySelector('.loading-dots').style.display = 'none';
                        document.querySelector('.info-box').style.display = 'none';
                    }
                }, 1000);
            } else {
                // Caso o link não seja encontrado no JSON
                showError("Erro: Link não encontrado.");
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo links.json:', error);
            showError("Erro ao carregar os links.");
        });
        
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        titleElement.textContent = 'Ocorreu um erro';
        document.querySelector('.loading-dots').style.display = 'none';
        document.querySelector('.info-box').style.display = 'none';
    }
});