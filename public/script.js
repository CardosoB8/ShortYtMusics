document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timer-text');
    const countdownElement = document.getElementById('countdown');
    const progressElement = document.getElementById('progress');
    const downloadLink = document.getElementById('download-link');
    const titleElement = document.getElementById('title');
    const errorMessage = document.getElementById('error-message');
    
    // 1. Pega o nome do link diretamente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const requestedLinkName = urlParams.get('link');

    // 2. Tenta carregar o links.json
    fetch('links.json')
        .then(response => {
            if (!response.ok) {
                // Se a resposta não for OK (ex: arquivo não encontrado), lança um erro
                throw new Error('Erro ao carregar o arquivo links.json. Verifique se ele está na pasta "public".');
            }
            return response.json();
        })
        .then(links => {
            // 3. Verifica se o link solicitado existe no JSON
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
                        
                        // Esconde elementos de carregamento
                        document.querySelector('.loading-dots').style.display = 'none';
                        document.querySelector('.info-box').style.display = 'none';
                    }
                }, 1000);
            } else {
                // Caso o link não seja encontrado no JSON ou o nome seja nulo
                showError("Erro: Link não encontrado. Verifique se o nome na URL está correto.");
            }
        })
        .catch(error => {
            console.error('Erro geral:', error);
            showError("Erro ao carregar os links.");
        });
        
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        titleElement.textContent = 'Ocorreu um erro';
        document.querySelector('.loading-dots').style.display = 'none';
        document.querySelector('.info-box').style.display = 'none';
        if (countdownElement) {
            countdownElement.parentElement.style.display = 'none';
        }
    }
});
