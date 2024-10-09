const matricula = "432126"; 

document.getElementById('generateBtn').addEventListener('click', async function() {
    const textInput = document.getElementById('textInput').value;
    const size = document.getElementById('sizeSelect').value;

    if (textInput.trim() === "") {
        alert("Por favor, insira um texto ou URL para gerar o QR Code.");
        return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(textInput)}&size=${size}`;
    document.getElementById('qrCode').innerHTML = `<img src="${qrUrl}" alt="QR Code">`;

    try {
        const logApiUrl = `https://www.piway.com.br/unoesc/api/inserir/log/${matricula}/qr-code/generate/${textInput}`;
        const logResponse = await fetch(logApiUrl);
        const logResult = await logResponse.json();
        console.log(logResult);
    } catch (error) {
        console.error('Erro ao registrar o log:', error);
    }
});

document.getElementById('showLogsBtn').addEventListener('click', async function() {
    const logsList = document.getElementById('logsList');
    logsList.innerHTML = ''; // Limpar lista de logs

    try {
        const logsApiUrl = `https://www.piway.com.br/unoesc/api/logs/${matricula}`;
        const response = await fetch(logsApiUrl);
        const logs = await response.json();

        if (Array.isArray(logs)) {
            logs.forEach(log => {
                const logEntry = document.createElement('p');
                logEntry.innerHTML = `Log ID: ${log.idlog}, Método: ${log.metodo}, Resultado: ${log.resultado} 
                    <button onclick="deleteLog(${log.idlog})">Excluir</button>`;
                logsList.appendChild(logEntry);
            });
        } else {
            logsList.innerHTML = `<p>${logs}</p>`;
        }

        document.getElementById('logModal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    } catch (error) {
        console.error('Erro ao obter logs:', error);
    }
});

async function deleteLog(idLog) {
    try {
        const deleteApiUrl = `https://www.piway.com.br/unoesc/api/excluir/log/${idLog}/aluno/${matricula}`;
        const deleteResponse = await fetch(deleteApiUrl);
        const deleteResult = await deleteResponse.json();
        alert(deleteResult);
        document.getElementById('showLogsBtn').click(); 
    } catch (error) {
        console.error('Erro ao excluir log:', error);
    }
}

function closeLogModal() {
    document.getElementById('logModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
