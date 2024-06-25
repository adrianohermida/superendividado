document.getElementById('debtForm').addEventListener('submit', function(event) {
  event.preventDefault();
  calculateDebt();
});

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
