BETR INSURANCE – HOW TO PUT THE NEW SITE LIVE ON HOSTINGER
==========================================================

This is a plain HTML version of the old WordPress site. It doesn't use WordPress,
Elementor or any plugins, so plugin updates can't break it again.

Everything the site needs (photos, logo, icons, fonts list, styles) is inside the zip.
It doesn't rely on any of the old WordPress folders.


1. BACK UP FIRST
   hPanel > Files > Backups > Generate new backup. Wait until it finishes.

2. MOVE WORDPRESS OUT OF THE WAY (don't delete it yet)
   hPanel > Files > File Manager > public_html
   - Create a new folder called:  _old_wordpress
   - Select EVERYTHING else in public_html (index.php, wp-admin, wp-content, wp-includes,
     .htaccess and all the wp-*.php files) and move it into _old_wordpress.
   - public_html should now contain only the _old_wordpress folder.

3. UPLOAD THE NEW SITE
   - In public_html, upload betrinsurance-site.zip, right-click it > Extract,
     and extract it straight into public_html.
   - Check that public_html now holds: index.html, .htaccess, send.php, assets/, contact/,
     privacy-policy/, terms-conditions/, complaints-policy/, cookies-policy/, 404.html
     (If everything landed inside an extra folder, move the contents up one level.)
   - Delete the zip.

4. CLEAR THE CACHE
   hPanel website dashboard > Clear cache (also purge the CDN if it's on).
   Then open https://betrinsurance.co.uk in a private window.

5. MAKE THE CONTACT FORMS DELIVER EMAIL (one DNS change in GoDaddy)
   The forms send to quote@betrinsurance.co.uk through Hostinger's mail server.
   Because the domain's email runs on Microsoft 365, Hostinger has to be added to the SPF
   record. Otherwise Outlook may send the enquiries to junk.
   GoDaddy DNS > edit the TXT record "@" that starts with v=spf1 and change it to:

     v=spf1 include:spf.protection.outlook.com include:_spf.mail.hostinger.com -all

   Then send a test enquiry from the website and check it arrives (look in Junk too).
   You can change the recipient address at the top of send.php.

6. TIDY UP (optional, after a week or so)
   Once you're happy with the new site, you can delete _old_wordpress and the WordPress
   database (hPanel > Databases). Keep the backup from step 1.

TO GO BACK TO WORDPRESS: delete the new files, then move everything in _old_wordpress
back into public_html.

EDITING TEXT LATER
   Each page is a single index.html file in its folder (the home page is public_html/index.html).
   Edit it in File Manager and save. Colours and styling are in assets/css/style.css.
