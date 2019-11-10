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

