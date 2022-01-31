# Creating a Production Build
This page describes how to deploy webims-frontend on an Apache web server.

## Preparation
- Deploy [webims-backend-api](https://github.com/zammitjohn/webims-backend-api).
- Download latest version of [webims-frontend](https://github.com/zammitjohn/webims-frontend/releases) package.

## Steps
1. Navigate to downloaded package.
2. Run ```npm run build``` command in your package directory to make the production build app.
3. Copy the ```build``` directory to the Apache server root ```DocumentRoot``` directory specfied in the httpd.conf file.
4. Copy and paste following in your .htaccess: 
    ```
    Options -MultiViews
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.html [QSA,L]
    ```