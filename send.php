<?php
/**
 * BETR Insurance – contact / quote form handler.
 * Sends the enquiry by email using Hostinger's built-in PHP mail().
 */

// ---- Settings ----------------------------------------------------------
$TO_EMAIL   = 'quote@betrinsurance.co.uk';          // where enquiries go
$FROM_EMAIL = 'website@betrinsurance.co.uk';        // sender shown on the email
$FROM_NAME  = 'BETR Insurance Website';
// -------------------------------------------------------------------------

$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function finish($ok, $message, $wantsJson) {
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        $back = isset($_SERVER['HTTP_REFERER']) ? strtok($_SERVER['HTTP_REFERER'], '?#') : '/contact/';
        header('Location: ' . $back . '?sent=' . ($ok ? '1' : '0') . '#enquiry');
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact/');
    exit;
}

// Spam trap: real people never fill the hidden "website" field.
if (!empty($_POST['website'])) {
    finish(true, 'Thank you for your message. We’ll be in touch shortly.', $wantsJson);
}

function clean($v, $max = 2000) {
    $v = trim((string)$v);
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}

$name    = clean($_POST['name'] ?? '', 120);
$email   = clean($_POST['email'] ?? '', 160);
$phone   = clean($_POST['phone'] ?? '', 40);
$subject = clean($_POST['subject'] ?? '', 160);
$cover   = clean($_POST['cover'] ?? '', 120);
$message = clean($_POST['message'] ?? '', 5000);
$source  = clean($_POST['form'] ?? 'Website', 60);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, 'Please enter your name and a valid email address.', $wantsJson);
}
if (preg_match('/[\n]/', $name . $email . $subject)) {
    finish(false, 'Sorry, there was a problem with your details. Please try again.', $wantsJson);
}

$lines = [
    'New enquiry from the BETR Insurance website (' . $source . ')',
    '',
    'Name:    ' . $name,
    'Email:   ' . $email,
];
if ($phone !== '')   $lines[] = 'Phone:   ' . $phone;
if ($cover !== '')   $lines[] = 'Cover:   ' . $cover;
if ($subject !== '') $lines[] = 'Subject: ' . $subject;
$lines[] = '';
$lines[] = 'Message:';
$lines[] = $message !== '' ? $message : '(none)';
$lines[] = '';
$lines[] = '--';
$lines[] = 'Sent ' . date('d/m/Y H:i') . ' from ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown IP');

$mailSubject = 'Website enquiry: ' . ($subject !== '' ? $subject : ($cover !== '' ? $cover : $name));
$headers = [
    'From: ' . $FROM_NAME . ' <' . $FROM_EMAIL . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$ok = @mail(
    $TO_EMAIL,
    '=?UTF-8?B?' . base64_encode($mailSubject) . '?=',
    implode("\n", $lines),
    implode("\r\n", $headers),
    '-f' . $FROM_EMAIL
);

if ($ok) {
    finish(true, 'Thank you for your message. We’ll be in touch shortly.', $wantsJson);
}
finish(false, 'Sorry, your message could not be sent. Please email quote@betrinsurance.co.uk or call 020 3051 6247.', $wantsJson);
