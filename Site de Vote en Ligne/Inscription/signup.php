<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Page d'inscription">
    <title>Inscription</title>
    <link href="../css/police.css" type="text/css" rel="stylesheet" />
    <link href="../css/header.css" type="text/css" rel="stylesheet" />
    <link href="../css/styleAccueil.css" type="text/css" rel="stylesheet" />
    <link href="../css/inscription-connexion.css" type="text/css" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="signup.js"></script>
</head>
<body>
    <div id = "main">       
        <div id = "header">
            <div id = "headerContent">
                <div id = "logo">
                    <a href="../Accueil/index.php">
                        <img src="../Logo/logo.png"/>
                    </a>
                </div>
                <div id = "headerPhrase">
                    Voter en ligne gratuitement
                </div>
            </div>
            <div id="headerNavBar">
                <a href="../Connexion/login.php" id="login-button">Connexion</a>
                <a href="../Inscription/signup.php" id="signup-button">Inscription</a>
            </div>
        </div>
        <div id = "mainContent">
            <div id="signupForm">
                <h1>Inscription</h1><br>
                    <form action="getSignup.php" method="POST">
                        <label for="name">Nom</label><br>
                        <input type="text" id="name" name="name" required><br><br>


                        <label for="email">Adresse e-mail</label><br>
                        <input type="email" id="email" name="email" required>
                        <div id="alert-email"></div><br><br>
                        
                        <label for="password">Mot de passe</label><br>
                        <input type="password" id="password" name="password" required><br><br>
                        
                        <label for="confirmPassword">Confirmation du mot de passe</label><br>
                        <input type="password" id="confirmPassword" name="confirmPassword" required>
                        <div id="alert-password"></div><br><br>
                        
                        <button type="submit" class="submit-button">Valider</button>
                        <button type="button" class="cancel-button" onclick="window.location.href='../Accueil/index.php'">Annuler</button>
                    </form>
            </div>
            <div id="signup-success"></div>
        </div>
    </div>
    
</body>
</html>
