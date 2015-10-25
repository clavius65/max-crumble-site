<?php

// Define some constants
define( "RECIPIENT_NAME", "Max Crumble" );
define( "RECIPIENT_EMAIL", "info@maxcrumble.com" );
define( "EMAIL_SUBJECT", "Info Request" );

// Read the form values
$success = false;
$senderName = isset( $_POST['senderName'] ) ? preg_replace( "/[^\.\-\' a-zA-Z0-9]/", "", $_POST['senderName'] ) : "";
$senderEmail = isset( $_POST['senderEmail'] ) ? preg_replace( "/[^\.\-\_\@a-zA-Z0-9]/", "", $_POST['senderEmail'] ) : "";
$message = isset( $_POST['message'] ) ? preg_replace( "/(From:|To:|BCC:|CC:|Subject:|Content-Type:)/", "", $_POST['message'] ) : "";

$SpamErrorMessage = "No Websites URLs permitted";
if(preg_match("/http/i", "$senderName")) {echo "$SpamErrorMessage"; exit();}
if(preg_match("/http/i", "$senderEmail")) {echo "$SpamErrorMessage"; exit();}
if(preg_match("/http/i", "$message")) {echo "$SpamErrorMessage"; exit();}

// If all values exist, send the email
if ( $senderName && $senderEmail && $message ) {
  $recipient = RECIPIENT_NAME . " <" . RECIPIENT_EMAIL . ">";
  $headers = "From: " . $senderName . " <" . $senderEmail . ">";
  $success = mail( $recipient, EMAIL_SUBJECT, $message, $headers );
}

// Return an appropriate response to the browser
if ( isset($_GET["ajax"]) ) {
  echo $success ? "success" : "error";
} else {
?>
<html>
  <head>
    <title>Thanks!</title>
  </head>
  <body style="background-color:#000;">
  <div style="margin-left:auto; margin-right:auto; margin-top:200px; text-align:center; color:#fff !important; font-size:24px; line-height:30px; font-weight:bold; font-family:Arial;">
  <?php if ( $success ) echo "<p>Thanks for contacting me! I'll respond as soon as I can...<br/>-- Max</p>" ?>
  <?php if ( !$success ) echo "<p>There was a problem sending your message. Please try again.</p>" ?>
  <p>Click your browser's Back button to return to the page.</p>
  </div>
  </body>
</html>
<?php
}
?>
