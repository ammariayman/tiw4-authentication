## 1. Stockage des mots de passe dans la BDD
| | |
|--:|:--|
|Description du problème  | Le stockage des mots de passe des utilisateurs est un élément critique pour l'application. Il faut s'assurer que même si l'application a été compromise, les mots de passe des utilisateurs ne sont pas exposés.	Cela dit, stocker les mots de passes en texte en clair dans la BDD est hors de question. La solution pour ce problème consiste a transformer les mots de passes en hash avant de les stocker. 	Les fonctions hash posent des problèmes aussi. Par exemple, un attaquant, ayant compromis la liste des mots de passes, peut la parcourir en comparant les mots de passes les plus utilisés avec les hashs les plus utilises et potentiellement trouver les mots d'une partie des utilisateurs. En plus, ils existent des bases de données contenant de larges listes de mots de passes avec leurs hashs équivalents. Ces listes s’appellent "Rainbow tables", et sont utilises pour offrir un compromis entre le temps d’exécution du processeur pour faire le brute force des mots de passes, et le stockage nécessaire pour stocker les listes des mots de passes avec leurs hashs.	La technique "Salting" est conçue pour résoudre ce problème, elle consiste a générer aléatoirement une chaine de caractères lors de la création de chaque mot de passe par l'application, et concaténer cette chaine avec le hash généré. Dans ce cas, même une base de données compromise ne permettra pas aux attaquant de savoir les mots de passes des utilisateurs, et les rainbow tables no contiendront pas les mots de passes de l'application puisqu'ils sont concaténés avec des chaines de caractères aléatoires lors de leurs création. |
|Mesure prise  | Nous avons opté pour la fonction Bcrypt pour stocker les mots de passes des utilisateurs de l'application. Bcrypt offre la fonctionnalité de salting, ainsi que le choix du nombre de tours de hashage. Le nombre de tours est un paramètre de coût qui permet de contrôler le temps nécessaire pour l’exécution de la fonction de hashage. Ainsi, on peut choisir ce nombre en fonction de la puissance du serveur utilisé pour l'application, de manière a faire un compromis entre le temps d’exécution et la puissance de sécurité des mots de passes. |
| Renvoi vers annexe | Annexe B contient au debut les snippets de code des fonctions de hashage et de verification des mots de passes, ainsi que les parties de l'application qui font appel a ces fonctions. 	Ligne 49 contient les instructions a suivre pour modifier la base de donnees afin de prendre en charge le hashage des mots de passes. |

## 2. Maintenir la connection des utilisateurs avec JWT
|  |  |
|--:|:--|
| Description du problème | Quand un utilisateur est authentifie, on a besoin d'un mécanisme qui nous permet de savoir combien de temps cet utilisateur peur rester connecter sans avoir a s'authentifier encore. La methode de session est une methode appelee stateful, elle necessite le stockage des informations de tous les utilisateurs connectes dans le serveur, ce qui est couteux.  |
| Mesure prise| La technique de JWT permet de savoir si un utilisateur est connecté, avant l’exécution d'une opération, sans stocker les informations de session de l'utilisateur. On applique cette méthode en choisissant une chaine de caractères secrète, et l'ajoutant a un "Token" qui contient aussi le login de l'utilisateur authentifie. on chiffre le token on le stocke dans une cookie du client. Ensuite, chaque fois que l'utilisateur effectue une opération nécessitant d’être authentifie, l'application cherche le token, le déchiffre, et vérifie la chaine secrète, puis effectue l’opération demandée pour l'utilisateur dont le login figure dans le corps du token.  |
| Renvoi vers annexe | Annexe B contient depuis la ligne 56 les morceaux de code responsables de implémentation du maintient authentification stateless |

## 3. Processus de création de compte

### 3.1. Dureté du mot de passe

Par abus de langage, on parle souvent de « force » d’un mot de passe pour désigner sa capacité à résister à une énumération de tous les mots de passe possibles.
Cette « force » dépend de la longueur L du mot de passe et du nombre N de caractères possibles. Elle suppose que le mot de passe est choisi de façon aléatoire. Elle se calcule aisément par la formule **N à la puissance L**.
Afin de favoriser la dureté du mot de passe, on impose à l'utilisateur d'utiliser au moins une lettre minuscule, une lettre majuscule, un chiffre, un symbole, et que le mot de passe contienne au moins 8 caractères (voir annexes B, fichier "Validation.txt").

### 3.2 Vérification de l'email

### 3.3 Validité des saisies utilisateur

Afin de valider les saisies de l'utilisateur, on a utilisé **express-validator** (voir annexes B, fichier "Validation.txt").

### 3.6 Affichage des erreurs

Afin d'améliorer l'expérience utilisateur, nous avons opté pour un affichage des erreurs plus agréable (voir annexes B, fichier "Erreurs.txt")