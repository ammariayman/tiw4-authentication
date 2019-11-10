TP TIW4 2019-2020 : sécurisation d'une application d'authentification - Partie - A
==================================================================================

==============================================================
Description du problème: Connexion serveur/client pas sécurisé
==============================================================

## mesure proposée renvoi vers l'annexe
Passage au protocole HTTPS en utilisant la couche de chiffrement ssl, grâce à un certificat
d'authentification émis par OpenSSL configuré sur Nginx.

## Justification: 
Une connexion via HTTPS ( à la place de HTTP) va permettre non seulement à l’utilisateur de
vérifier la nature du site web avant d’y accéder, mais aussi de protéger ses
données lors de sa navigation.

## Renvoi vers l'annexe
Le fichier de configuration de NGINX:
—->annexes-A/nginx.conf
Le fichier default qui contient la configuration du serveur https:
—->annexes-A/default
Le fichier de paramétrage SSL:
—->annexes-A/ssl-params .inc
 

==============================================================
Description du problème: Génération d’une certificat 
==============================================================
 
## Description du problème
Génération d’une certificat

## mesure proposée renvoi vers l'annexe
Pour cela, nous avons utilisé OpenSSL, cela en passant par les commande suivantes:

## Justification: 
$ cd /etc/nginx/
$ sudo mkdir ssl
$ cd ssl
Création d'une paire de clés RSA:
$sudo openssl genrsa -out ./server.key 
Génération d'un certificat auto-signé valable 10 ans=3650 jours:
$ sudo openssl req -key ./server.key -new -x509 -days 3650 -sha256 -out ./server.cert -subj "/C=FR/L=Lyon/O=MIF03-CAW/CN=192.168.76.215"

## Renvoi vers l'annexe
Certificat:
—>server.cert
Clé:
—>server.key
