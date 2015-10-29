<?php

// Define some constants
define( "RECIPIENT_NAME", "Max Crumble" );
define( "RECIPIENT_EMAIL", "info@maxcrumble.com" );

// Read the form values
$success = false;
$senderName = isset( $_POST['senderName'] ) ? preg_replace( "/[^\.\-\' a-zA-Z0-9]/", "", $_POST['senderName'] ) : "";
$senderEmail = isset( $_POST['senderEmail'] ) ? preg_replace( "/[^\.\-\_\@a-zA-Z0-9]/", "", $_POST['senderEmail'] ) : "";
$subject = isset( $_POST['subject'] ) ? $_POST['subject'] : "";
$previousUrl = isset( $_SERVER['HTTP_REFERER'] ) ? $_SERVER['HTTP_REFERER'] : "";
$message = isset( $_POST['comment'] ) ? preg_replace( "/(From:|To:|BCC:|CC:|Subject:|Content-Type:)/", "", $_POST['comment'] ) : "";

$SpamErrorMessage = "No Websites URLs permitted";
if(preg_match("/http/i", "$senderName")) {echo "$SpamErrorMessage"; exit();}
if(preg_match("/http/i", "$senderEmail")) {echo "$SpamErrorMessage"; exit();}
if(preg_match("/http/i", "$message")) {echo "$SpamErrorMessage"; exit();}

// If all values exist, send the email
if ( $senderName && $senderEmail && $message ) {
  $recipient = RECIPIENT_NAME . " <" . RECIPIENT_EMAIL . ">";
  $headers = "From: " . $senderName . " <" . $senderEmail . ">";
  $success = mail( $recipient, $subject, $message, $headers );
}

// Return an appropriate response to the browser
if ( isset($_GET["ajax"]) ) {
  echo $success ? "success" : "error";
} else {
?>
<html>
<head>
    <title>Thanks!</title>
    <link href="css/animate.css" rel="stylesheet" type="text/css"/>
    <link href="css/normalize.css" rel="stylesheet" type="text/css"/>
    <link href="css/style.css" rel="stylesheet" type="text/css"/>
    <link href="css/grid.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<div class="wrapper">
    <div class="wrap">
        <div class="single-page-title">
          Thanks!
        </div>
    <div>
    <div class="grids">
        <div class="grid-12">
            <?php if ($success) echo "
            <h2>Thanks for your comments!</h2>
            <blockquote>
                Complete strangers can stand silent next to each other in an elevator and not even look each other in the eye.
                But at a concert, those same strangers could find themselves dancing and singing together like best friends.
                That's the power of music.<cite>LZ Granderson</cite>
            </blockquote>
            " ?>
            <?php if (!$success) echo "
            <p>There was a problem sending your comment. Please try again.</p>
            " ?>
            <h3>Return to <a href="<?php echo $previousUrl ?>">previous page.</a></h3>
        </div>
    </div>
</div>
<footer>
    <div class="credits">
      &copy; 2015 Max Crumble Orchestra. All Rights Reserved.
    </div>
</footer>
<script src="js/jquery.js" type="text/javascript"></script>
<script src="js/jquery.backstretch.min.js" type="text/javascript"></script>
<script src="js/jquery.reveal.js" type="text/javascript"></script>
<script src="js/jflickrfeed.min.js" type="text/javascript"></script>
<script src="js/jquery.colorbox-min.js" type="text/javascript"></script>
<script src="js/mediaelement-and-player.min.js" type="text/javascript"></script>
<script src="js/jquery.placeholder.min.js" type="text/javascript"></script>
<script src="js/custom2.js" type="text/javascript"></script>
<script type="text/javascript">
    $("body").backstretch("images/photos/concert-bg.jpg");
</script>
</body>
</html>
<?php
}
?>
