## Partie 1: Stockage des mots de passes
Le hashage des mots de passes pour le stockage dans la base de données consiste a appliquer la fonction du hashage lors de la création des mots de passes, et a comparer les mots de passes lors de l'authentification des utilisateurs.
Ces deux fonctionnalités sont implémentées dans le fichier: *app/utils/hashing.js*
La fonction de hashage:

    async  function  hashPassword (password) {
	    const  saltRounds  =  10;
	    const  hashedPassword  =  await  new  Promise((resolve, reject) => {
		    bcrypt.hash(password, saltRounds, function(err, hash) {
			    if (err) reject(err)
			    resolve(hash)
		    });
	    })
	    return  hashedPassword
    }

La fonction de vérification du mot de passe

    async  function  comparePassword (pwd, userPwd) {
	    const  ok  =  await  new  Promise((resolve, reject) => {
		    bcrypt.compare(pwd, userPwd, function (err, result) {
			    if (err) reject(err)
			    else  resolve(result)
		    });
	    })
	    return  ok
    }
L’appel a la fonction `hashPassword(password)` se fait dans le fichier *app/routes/signup.js* qui traite les requêtes POST du formulaire d'enregistrement.

    router.post('/', async  function  signupHandler(req, res, next) {
	    try {
		    const  hashedPwd  =  await hashing.hashPassword(req.body.password);
		    await  db.addUser(req.body.username, req.body.email, hashedPwd);
		    res.redirect('/');
	    } catch (e) {
		    next(createError(500, e));
	    }
	});
L’appel a la fonction `comparePassword (pwd, userPwd)` se fait dans le fichier *app/routes/authenticate.js* qui traite les login des utilisateurs.

    const  user  =  await  db.selectUser(login);
    const  userPassword  =  user[0].password;
    debug(`hashing.comparePassword(): attempt with "${password}" and userPassword "${userPassword}"`);
    const  ok  =  await  hashing.comparePassword(password, userPassword);
    if (!ok) next(createError(401, 'Invalid login/password'));
    else {
	    //creation du token JWT
	    ...
Le champ password base de données est limite en 8 caracteres. vu que le hash généré par l'application est plus long, on a enleve cette contrainte en se connectant au serveur de la base de données par la commande suivante:

    psql -h localhost -U tiw4-auth -d tiw4-aut
Et en exécutant la requête suivante:

    ALTER TABLE users ALTER COLUMN password TYPE varchar;
## Partie 2: Maintien de l'authentification
La ligne suivante est responsable de la création de la chaine de caractères secrète du token:

    const  jwtServerKey  =  process.env.SECRET_KEY  ||  'secretpassword';
Dans le code suivant, on déclare la durée de l'authentification:

    const  jwtExpirySeconds  =  60  *  60  *  1000;

#### Authentification

Lors de l'authentification le code suivant est responsable de la création du token JWT
Le corps du token "payload" ne contient que le login de l'utilisateur authentifie: 

    const  payload  = {
	    sub:  login,
    };
Le header contient le fonction de hashage et la durée de vie du token:

    const  header  = {
	    algorithm:  'HS256',
	    expiresIn:  jwtExpirySeconds
    };
Le code suivant crée le token depuis les informations précédentes, et le met dans une cookie:

    const  token  =  jwt.sign(payload, jwtServerKey, header);
    res.cookie('token', token, { maxAge:  jwtExpirySeconds  *  1000  *  60  *  60 });
#### Verification utilisateur
Quand l'utilisateur fait une opération, l'application vérifie s'il a un token:

    const { token } =  req.cookies;
sinon le message suivant est transmis:

    if (!token) {
	    return  next(createError(401, 'No JWT provided'));
    }
L'application recupere le token:

    const  payload  =  jwt.verify(token, jwtServerKey);
Elle verifie si l'utilisateur proprietaire du token peut acceder a la fonctionnalite demandee:

    if (!payload.sub) next(createError(403, 'User not authorized'));
    req.user  =  payload.sub;
    //...

La raison du choix de cryptage HS256 pour JWT est du au fait que les tokens sont moins lourd, ce qui le rend plus rapide. Contrairement au RS256, HS256 donne a l'application le contrôle sur qui peur utiliser les tokens du fait de l'utilisation d'une clé secrète.
