#### allow log folders 
```bash
sudo chown -R www-data:www-data /var/www/coreflow/frontend
sudo chmod -R 755 /var/www/coreflow/frontend
```

```bash
sudo nano /etc/apache2/sites-available/coreflow.astraval.com.conf
```

```conf
<VirtualHost *:80>
    ServerName coreflow.astraval.com

    DocumentRoot /var/www/coreflow/frontend

    <Directory /var/www/coreflow/frontend>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /

        # If a file or directory exists, serve it directly
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]

        # Otherwise serve index.html (SPA fallback)
        RewriteRule ^ index.html [L,QSA]
    </Directory>

    # Logs
    ErrorLog /var/www/domains/coreflow.astraval.com/logs/error.log
    CustomLog /var/www/domains/coreflow.astraval.com/logs/access.log combined
</VirtualHost>
```
#### If log folder does not exist
```bash
sudo mkdir -p /var/www/domains/coreflow.astraval.com/logs
sudo chown -R www-data:www-data /var/www/domains/coreflow.astraval.com/logs
```

```bash
sudo apache2ctl configtest  # Should say "Syntax OK"
sudo a2ensite coreflow.astraval.com.conf
sudo a2enmod rewrite headers expires deflate
sudo systemctl reload apache2
```

#### Enable ssl
```bash
sudo certbot --apache -d coreflow.astraval.com
```

#### Replace your SSL config with this:

```conf
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName coreflow.astraval.com
    DocumentRoot /var/www/coreflow/frontend

    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:8085/api/
    ProxyPassReverse /api/ http://localhost:8085/api/

    <Directory /var/www/coreflow/frontend>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /

        RewriteCond %{REQUEST_URI} ^/api
        RewriteRule ^ - [L]

        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]

        RewriteRule ^ index.html [L,QSA]
    </Directory>

    ErrorLog /var/www/domains/coreflow.astraval.com/logs/error.log
    CustomLog /var/www/domains/coreflow.astraval.com/logs/access.log combined

    SSLCertificateFile /etc/letsencrypt/live/coreflow.astraval.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/coreflow.astraval.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```
Then run:
```bash
sudo a2enmod proxy proxy_http headers
sudo apache2ctl configtest
sudo systemctl restart apache2
```
Now frontend API base URL should be:
```env
VITE_API_BASE_URL=/api
```
