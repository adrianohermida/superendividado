<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $percentage = $_POST['percentage'];
    
    $participants = [];
    foreach ($_POST as $key => $value) {
        if (strpos($key, 'participantName') === 0) {
            $index = substr($key, -1);
            $participants[$index]['name'] = $value;
        }
        if (strpos($key, 'participantIncome') === 0) {
            $index = substr($key, -1);
            $participants[$index]['income'] = $value;
        }
    }
    
    $debts = [];
    foreach ($_POST as $key => $value) {
        if (strpos($key, 'debtAmount') === 0) {
            $index = substr($key, -1);
            $debts[$index]['amount'] = $value;
        }
        if (strpos($key, 'debtRate') === 0) {
            $index = substr($key, -1);
            $debts[$index]['rate'] = $value;
        }
        if (strpos($key, 'debtTerm') === 0) {
            $index = substr($key, -1);
            $debts[$index]['term'] = $value;
        }
        if (strpos($key, 'debtPaid') === 0) {
            $index = substr($key, -1);
            $debts[$index]['paid'] = $value;
        }
        if (strpos($key, 'debtDueDate') === 0) {
            $index = substr($key, -1);
            $debts[$index]['dueDate'] = $value;
        }
        if (strpos($key, 'debtNextDueDate') === 0) {
            $index = substr($key, -1);
            $debts[$index]['nextDueDate'] = $value;
        }
        if (strpos($key, 'creditCard') === 0) {
            $index = substr($key, -1);
            $debts[$index]['creditCard'] = $value;
        }
        if (strpos($key, 'creditCardInstallments') === 0) {
            $index = substr($key, -1);
            $debts[$index]['creditCardInstallments'] = $value;
        }
    }
    
    $csvContent = "Nome,Email,Telefone,Percentual\n";
    $csvContent .= "$name,$email,$phone,$percentage\n\n";
    $csvContent .= "Participante,Nome,Renda Mensal\n";
    
    foreach ($participants as $participant) {
        $csvContent .= "{$participant['name']},{$participant['income']}\n";
    }
    
    $csvContent .= "\nDívida,Valor,Taxa de Juros,Prazo,Parcelas Pagas,Vencimento da Última Parcela Paga,Vencimento da Próxima Parcela,Cartão de Crédito,Fatura Parcelada\n";
    foreach ($debts as $debt) {
        $csvContent .= "{$debt['amount']},{$debt['rate']},{$debt['term']},{$debt['paid']},{$debt['dueDate']},{$debt['nextDueDate']},{$debt['creditCard']},{$debt['creditCardInstallments']}\n";
    }
    
    $file = fopen("dados_cliente.csv", "w");
    fwrite($file, $csvContent);
    fclose($file);
    
    $to = "seuemail@exemplo.com";
    $subject = "Dados do Cliente - Simulação de Superendividamento";
    $body = "Nome: $name\nEmail: $email\nTelefone: $phone\nPercentual: $percentage\n\nParticipantes:\n";
    
    foreach ($participants as $participant) {
        $body .= "Nome: {$participant['name']}, Renda Mensal: {$participant['income']}\n";
    }
    
    $body .= "\nDetalhamento das Dívidas:\n";
    foreach ($debts as $debt) {
        $body .= "Valor: {$debt['amount']}, Taxa de Juros: {$debt['rate']}, Prazo: {$debt['term']} meses, Parcelas Pagas: {$debt['paid']}, Vencimento da Última Parcela Paga: {$debt['dueDate']}, Vencimento da Próxima Parcela: {$debt['nextDueDate']}, Cartão de Crédito: {$debt['creditCard']}, Fatura Parcelada: {$debt['creditCardInstallments']}\n";
    }
    
    $headers = "From: no-reply@exemplo.com\r\n";
    
    mail($to, $subject, $body, $headers);
    
    echo "Dados enviados com sucesso!";
}
?>
