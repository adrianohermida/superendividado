document.getElementById('debtForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateDebt();
});

function addParticipant() {
    const participantCount = document.querySelectorAll('.participant').length + 1;
    const participantHTML = `
        <div class="row gy-4 participant mt-3">
          <div class="col-lg-4">
            <label for="participantName${participantCount}">Nome:</label>
            <input type="text" id="participantName${participantCount}" name="participantName${participantCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="participantIncome${participantCount}">Renda Mensal:</label>
            <input type="number" id="participantIncome${participantCount}" name="participantIncome${participantCount}" class="form-control" required>
          </div>
        </div>
    `;
    document.getElementById('participants').insertAdjacentHTML('beforeend', participantHTML);
}

function addDebt() {
    const debtCount = document.querySelectorAll('.debt').length + 1;
    const debtHTML = `
        <div class="row gy-4 debt mt-3">
          <div class="col-lg-4">
            <label for="debtAmount${debtCount}">Valor da Dívida:</label>
            <input type="number" id="debtAmount${debtCount}" name="debtAmount${debtCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="debtRate${debtCount}">Taxa de Juros (%):</label>
            <input type="number" id="debtRate${debtCount}" name="debtRate${debtCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="debtTerm${debtCount}">Prazo (meses):</label>
            <input type="number" id="debtTerm${debtCount}" name="debtTerm${debtCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="debtPaid${debtCount}">Parcelas Pagas:</label>
            <input type="number" id="debtPaid${debtCount}" name="debtPaid${debtCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="debtDueDate${debtCount}">Vencimento da Última Parcela Paga:</label>
            <input type="date" id="debtDueDate${debtCount}" name="debtDueDate${debtCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="debtNextDueDate${debtCount}">Vencimento da Próxima Parcela:</label>
            <input type="date" id="debtNextDueDate${debtCount}" name="debtNextDueDate${debtCount}" class="form-control" required>
          </div>
          <div class="col-lg-4">
            <label for="creditCard${debtCount}">Cartão de Crédito:</label>
            <select id="creditCard${debtCount}" name="creditCard${debtCount}" class="form-control">
              <option value="não">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
          <div class="col-lg-4">
            <label for="creditCardInstallments${debtCount}">Fatura Parcelada:</label>
            <select id="creditCardInstallments${debtCount}" name="creditCardInstallments${debtCount}" class="form-control">
              <option value="não">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>
        </div>
    `;
    document.getElementById('debts').insertAdjacentHTML('beforeend', debtHTML);
}

function calculateDebt() {
    const participants = document.querySelectorAll('.participant');
    let totalIncome = 0;
    participants.forEach(participant => {
        const income = parseFloat(participant.querySelector('input[id^="
function calculateDebt() {
    const participants = document.querySelectorAll('.participant');
    let totalIncome = 0;
    participants.forEach(participant => {
        const income = parseFloat(participant.querySelector('input[id^="participantIncome"]').value);
        totalIncome += income;
    });

    const percentage = parseFloat(document.getElementById('percentage').value) / 100;
    const debts = document.querySelectorAll('.debt');
    
    let totalDebt = 0;
    let monthlyPayments = [];
    debts.forEach(debt => {
        const amount = parseFloat(debt.querySelector('input[id^="debtAmount"]').value);
        const rate = parseFloat(debt.querySelector('input[id^="debtRate"]').value) / 100;
        const term = parseInt(debt.querySelector('input[id^="debtTerm"]').value);
        const paid = parseInt(debt.querySelector('input[id^="debtPaid"]').value);
        
        const remainingTerm = term - paid;
        const monthlyRate = rate / 12;
        const amortized = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -remainingTerm));
        
        totalDebt += amortized;
        monthlyPayments.push(amortized);
    });
    
    const monthlyPayment = totalIncome * percentage;
    const resultHTML = `
        <h3>Resultado:</h3>
        <p>Saldo Devedor Amortizado: R$ ${totalDebt.toFixed(2)}</p>
        <p>Parcela Mensal Estimada: R$ ${monthlyPayment.toFixed(2)}</p>
        <h4>Detalhamento das Parcelas Mensais:</h4>
        <ul>
            ${monthlyPayments.map((payment, index) => `<li>Dívida ${index + 1}: R$ ${payment.toFixed(2)}</li>`).join('')}
        </ul>
    `;
    document.getElementById('results').innerHTML = resultHTML;
    
    sendEmail();
}

function sendEmail() {
    const form = document.getElementById('debtForm');
    const formData = new FormData(form);
    
    fetch('send_email.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text()).then(data => {
        console.log(data);
    });
}
