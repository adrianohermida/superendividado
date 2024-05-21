<?php
/**
* Requires the "PHP Email Form" library
* The "PHP Email Form" library is available only in the pro version of the template
* The library should be uploaded to: vendor/php-email-form/php-email-form.php
* For more info and help: https://bootstrapmade.com/php-email-form/
*/

// Replace contact@example.com with your real receiving email address
$receiving_email_address = 'atendimento@hermidamaia.adv.br';

if (file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php')) {
  include($php_email_form);
} else {
  die('Unable to load the "PHP Email Form" Library!');
}

$contact = new PHP_Email_Form;
$contact->ajax = true;

$contact->to = $receiving_email_address;
$contact->from_name = $_POST['name'];
$contact->from_email = $_POST['email'];
$contact->subject = $_POST['subject'];

// Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
/*
$contact->smtp = array(
  'host' => 'smtp.gmail.com',
  'username' => 'atendimento@hermidamaia.adv.br',
  'password' => 'Oabam8894$180514Jg$',
  'port' => '587'
);
*/

$contact->add_message($_POST['name'], 'From');
$contact->add_message($_POST['email'], 'Email');
$contact->add_message($_POST['message'], 'Message', 10);

$contact->recaptcha_secret_key = '6LdhTmoiAAAAAInBVw42JbCwfd0XxFSv9dybp9tx';

$recaptcha_response = $_POST['recaptcha-response'];
$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$contact->recaptcha_secret_key}&response={$recaptcha_response}");
$responseKeys = json_decode($response, true);

if(intval($responseKeys["success"]) !== 1) {
  die('Por favor preencha o reCAPTCHA');
}

if ($_POST['privacy'] != 'accept') {
  die('Por favor, aceite nossos termos de serviço e política de privacidade');
}

$contact->honeypot = $_POST['first_name'];
$contact->add_attachment('resume', 20, array('pdf', 'doc', 'docx', 'rtf'));

echo $contact->send();
?>
