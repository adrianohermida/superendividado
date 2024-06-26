document.addEventListener('DOMContentLoaded', function() {
    initializeSteps();
    initializeEvents();
});

function initializeSteps() {
    document.querySelectorAll('.timeline-step:not(.active)').forEach(step => {
        step.classList.add('locked');
    });
}

function initializeEvents() {
    document.querySelectorAll('.timeline-step').forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            if (!this.classList.contains('locked')) {
                showStep(stepNumber);
            }
        });
    });
}

function showStep(stepNumber) {
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.timeline-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    document.querySelector(`.timeline-step[data-step="${stepNumber}"]`).classList.add('active');
}

function nextStep(nextStepNumber) {
    const currentStep = document.querySelector('.step-content.active');
    const currentStepNumber = parseInt(currentStep.id.split('-')[1]);
    if (validateStep(currentStepNumber)) {
        showStep(nextStepNumber);
        unlockStep(nextStepNumber);
    }
}

function previousStep(previousStepNumber) {
    showStep(previousStepNumber);
}

function unlockStep(stepNumber) {
    document.querySelector(`.timeline-step[data-step="${stepNumber}"]`).classList.remove('locked');
}

function validateStep(stepNumber) {
    const step = document.getElementById(`step-${stepNumber}`);
    const inputs = step.querySelectorAll('input[required], select[required]');
    for (let input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}

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

    fetch('assets/vendor/sheet/send_email.php', {
        method: 'POST',
        body: formData
    }).then(response => response.text()).then(data => {
        console.log(data);
    });
}

function addParticipant() {
    const participantsContainer = document.getElementById('participants');
    const newIndex = participantsContainer.querySelectorAll('.participant').length + 1;

    const newParticipant = document.createElement('div');
    newParticipant.classList.add('row', 'gy-4', 'participant');
    newParticipant.innerHTML = `
        <div class="col-lg-6">
            <label for="participantName${newIndex}">Nome:</label>
            <input type="text" id="participantName${newIndex}" name="participantName${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-6">
            <label for="participantIncome${newIndex}">Renda Mensal:</label>
            <input type="number" id="participantIncome${newIndex}" name="participantIncome${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-12">
            <button type="button" class="btn btn-danger" onclick="removeParticipant(this)">Excluir Participante</button>
        </div>
    `;
    participantsContainer.appendChild(newParticipant);
}

function removeParticipant(button) {
    button.closest('.participant').remove();
}

function addExpense() {
    const expensesContainer = document.getElementById('expenses');
    const newIndex = expensesContainer.querySelectorAll('.expense').length + 1;

    const newExpense = document.createElement('div');
    newExpense.classList.add('row', 'gy-4', 'expense');
    newExpense.innerHTML = `
        <div class="col-lg-6">
            <label for="expenseName${newIndex}">Nome da Despesa:</label>
            <input type="text" id="expenseName${newIndex}" name="expenseName${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-6">
            <label for="expenseValue${newIndex}">Valor:</label>
            <input type="number" id="expenseValue${newIndex}" name="expenseValue${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-12">
            <button type="button" class="btn btn-danger" onclick="removeExpense(this)">Excluir Despesa</button>
        </div>
    `;
    expensesContainer.appendChild(newExpense);
}

function removeExpense(button) {
    button.closest('.expense').remove();
}

function addDebt() {
    const debtsContainer = document.getElementById('debts');
    const newIndex = debtsContainer.querySelectorAll('.debt').length + 1;

    const newDebt = document.createElement('div');
    newDebt.classList.add('row', 'gy-4', 'debt');
    newDebt.innerHTML = `
        <div class="col-lg-6">
            <label for="debtName${newIndex}">Nome do Credor:</label>
            <input type="text" id="debtName${newIndex}" name="debtName${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-6">
            <label for="debtAmount${newIndex}">Valor da Dívida:</label>
            <input type="number" id="debtAmount${newIndex}" name="debtAmount${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-6">
            <label for="debtRate${newIndex}">Taxa de Juros (%):</label>
            <input type="number" id="debtRate${newIndex}" name="debtRate${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-6">
            <label for="debtTerm${newIndex}">Prazo (meses):</label>
            <input type="number" id="debtTerm${newIndex}" name="debtTerm${newIndex}" class="form-control" required>
        </div>
        <div class="col-lg-6">
            <label for="debtPaid${newIndex}">Parcelas Pagas:</label>
            <input type="number" id="debtPaid${newIndex}" name="debtPaid${newIndex}" class="form-control">
        </div>
        <div class="col-lg-6">
            <label for="debtDueDate${newIndex}">Vencimento da Última Parcela Paga:</label>
            <input type="date" id="debtDueDate${newIndex}" name="debtDueDate${newIndex}" class="form-control">
        </div>
        <div class="col-lg-6">
            <label for="debtNextDueDate${newIndex}">Vencimento da Próxima Parcela:</label>
            <input type="date" id="debtNextDueDate${newIndex}" name="debtNextDueDate${newIndex}" class="form-control">
        </div>
        <div class="col-lg-6">
            <label for="creditCard${newIndex}">Cartão de Crédito:</label>
            <select id="creditCard${newIndex}" name="creditCard${newIndex}" class="form-control" onchange="toggleCreditCardDetails(this)">
                <option value="não">Não</option>
                <option value="sim">Sim</option>
            </select>
        </div>
        <div class="col-lg-6" id="creditCardDetails${newIndex}" style="display:none;">
            <label for="previousInstallments${newIndex}">Possui Parcelamentos Anteriores:</label>
            <select id="previousInstallments${newIndex}" name="previousInstallments${newIndex}" class="form-control">
                <option value="não">Não</option>
                <option value="sim">Sim</option>
            </select>
            <label for="minimumPayment${newIndex}">Pagamento Mínimo Anterior:</label>
            <select id="minimumPayment${newIndex}" name="minimumPayment${newIndex}" class="form-control">
                <option value="não">Não</option>
                <option value="sim">Sim</option>
            </select>
        </div>
        <div class="col-lg-12">
            <button type="button" class="btn btn-danger" onclick="removeDebt(this)">Excluir Dívida</button>
        </div>
    `;
    debtsContainer.appendChild(newDebt);
}

function removeDebt(button) {
    button.closest('.debt').remove();
}

function toggleCreditCardDetails(select) {
    const detailsId = `creditCardDetails${select.id.replace('creditCard', '')}`;
    const detailsContainer = document.getElementById(detailsId);
    if (select.value === 'sim') {
        detailsContainer.style.display = 'block';
    } else {
        detailsContainer.style.display = 'none';
    }
}

document.getElementById('debtForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateDebt();
});
