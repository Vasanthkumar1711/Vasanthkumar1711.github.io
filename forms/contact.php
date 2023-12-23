<?php
// PHP code for processing the form submission

$receiving_email_address = 'Info@quantumpixelsolutions.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the form fields are set
    if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['subject']) && isset($_POST['message'])) {
        // Include the PHP Email Form library
        $php_email_form = '../assets/vendor/php-email-form/php-email-form.php';
        if (file_exists($php_email_form)) {
            include($php_email_form);

            // Create PHP_Email_Form object
            $contact = new PHP_Email_Form;
            $contact->ajax = true;

            // Set email parameters
            $contact->to = $receiving_email_address;
            $contact->from_name = $_POST['name'];
            $contact->from_email = $_POST['email'];
            $contact->subject = $_POST['subject'];

            // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
            /*
            $contact->smtp = array(
                'host' => 'example.com',
                'username' => 'example',
                'password' => 'pass',
                'port' => '587'
            );
            */

            // Add message content
            $contact->add_message($_POST['name'], 'From');
            $contact->add_message($_POST['email'], 'Email');
            $contact->add_message($_POST['message'], 'Message', 10);

            // Attempt to send the email
            $send_result = $contact->send();

            // Echo the result
            echo $send_result ? 'success' : 'error';
        } else {
            echo 'Unable to load the "PHP Email Form" Library!';
        }
    } else {
        echo 'Invalid form submission. All fields are required.';
    }
} else {
    // Handle non-POST requests if needed
    echo 'Invalid request method.';
}
?>
