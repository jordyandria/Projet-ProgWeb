<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Page de connexion">
    <title>Connexion</title>
    <link href="../css/police.css" type="text/css" rel="stylesheet" />
    <link href="../css/header.css" type="text/css" rel="stylesheet" />
    <link href="../css/styleAccueil.css" type="text/css" rel="stylesheet" />
    <link href="../css/inscription-connexion.css" type="text/css" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="login.js"></script>
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
        <div id="mainContent">
            <div id="loginForm">
                <h1>Connexion</h1><br>
                    <form action="getLogin.php" method="POST">
                        <label for="email">Adresse e-mail</label><br>
                        <input type="email" id="email" name="email" required><br><br>
                        
                        <label for="password">Mot de passe</label><br>
                        <input type="password" id="password" name="password" required><br><br>
                        
                        <div class="alert"></div><br>
                    
                        <button type="submit" class="submit-button">Se connecter</button>
                        <button type="button" class="cancel-button" onclick="window.location.href='../Inscription/signup.php'">S'inscrire</button>
                    </form>
            </div>
        </div>
    </div>
    
</body>
</html>
