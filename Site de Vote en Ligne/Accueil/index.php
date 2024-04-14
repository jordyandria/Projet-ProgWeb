<?php
session_start();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Page d'accueil">
    <title>Good to Vote</title>
    <link href="../css/police.css" type="text/css" rel="stylesheet" />
    <link href="../css/header.css" type="text/css" rel="stylesheet" />
    <link href="../css/styleAccueil.css" type="text/css" rel="stylesheet" />
    <link href="../css/votes.css" type="text/css" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="../Vote/createPoll.js"></script>
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
                <?php 
                    if (isset($_SESSION['email'])): ?>
                    <div id="user-email"><?php echo $_SESSION['name']; ?> | <?php echo $_SESSION['email'];?></div>
                    <a href="../Connexion/logout.php" id="logout-button">Déconnexion</a>
                <?php else: ?>
                    <a href="../Connexion/login.php" id="login-button">Connexion</a>
                    <a href="../Inscription/signup.php" id="signup-button">Inscription</a>
                <?php endif; ?>
            </div>
        </div>
            <div id = "mainContent">
                <?php if (isset($_SESSION['email'])): ?>
                    <div id="votesContent">
                        <div id="votes-start">
                            <h1>Votes</h1>
                            <button id="create-poll-button">+ Créer scrutin</button>
                        </div>
                        <div id="create-poll-form">
                            <div id="head-form"></div>
                            <form action="../Vote/createPoll.php" method="post"></form>
                        </div> 
                        <div id="poll-list"></div>  
                    </div>
                <?php else: ?>
                    <div id="description">
                        <h1>Bienvenue sur notre site de vote en ligne</h1>
                        <p>Une plateforme simple et efficace pour collecter vos opinions et vos votes en ligne.</p>
                        <button id="start-button">Commencer</button>
                    </div>
                <?php endif; ?>
            </div>
    </div>
    
</body>

<script>
$(document).ready(function() {
    $('#start-button').click(function() {
        <?php if (!isset($_SESSION['email'])): ?>
            window.location.href = '../Connexion/login.php';
        <?php endif; ?>
    });

    var organizerEmail = '<?php echo isset($_SESSION['email']) ? $_SESSION['email'] : ''; ?>';
    var organizerName = '<?php echo isset($_SESSION['name']) ? $_SESSION['name'] : ''; ?>';

    getUserPolls(organizerEmail);

    $(document).on('click', '#create-poll-button', function() {
        $('#votes-start').hide();
        $('#poll-list').hide();
        $('#head-form').append('<h1>Créer un scrutin</h1>');
        $('form').append('<div id="poll-info"></div>');
        $('#poll-info').append('<label for="title">Titre du vote</label><br><div class="indication">ex : Restauration Crous</div><input type="text" id="title" name="title" required><br><br>');
        $('#poll-info').append('<label for="question">Question soumise au vote<br></label><div class="indication">ex : Créer plus de lieux de Restauration ?</div><input type="text" id="question" name="question" required><br><br>');
        $('#poll-info').append('<div id="options-container"></div>');
        $('#options-container').append('<div id="optionsContent"></div>');
        $('#optionsContent').append('<label for="options">Choix de réponses (2 options minimum)<br></label><div class="indication">ex : Oui, non, pas d\'avis,...</div>');
        $('#optionsContent').append('<div id = "required-options"></div>');
        $('#required-options').append('<div class="option-div"><input type="text" class="option" name="options[]" required><br><br></div>');
        $('#required-options').append('<div class="option-div"><input type="text" class="option" name="options[]" required><br><br></div>');
        $('#optionsContent').append('<div id="additionnal-options"></div>');
        $('#options-container').append('<button type="button" id="add-option-button">Ajouter une option</button>');
        $('#options-container').append('<button type="button" id="remove-option-button">Supprimer une option</button><br><br>');
        $('#poll-info').append('<button type="submit" id="next-poll-button">Suivant</button>');
        $('#poll-info').append('<button type="button" class="cancel-button" onclick="window.location.href=\'../Accueil/index.php\'">Annuler</button>');
    });

    $(document).on('click', '#add-option-button', function() {
        $('#additionnal-options').append('<div class="option-div"><input type="text" class="option" name="options[]" required><br><br></div>');
    });

    $(document).on('click', '#remove-option-button', function() {
        $('#additionnal-options .option-div:last').remove();
    });

    $('#create-poll-form form').on('submit', function(e) {
        e.preventDefault();
        $('#poll-info').hide();
        $('#head-form').html('<h1>Listes des votants</h1>');
        if ($('#voters-info').length === 0) {
            $('form').append('<div id="voters-info"></div>');
            $('#voters-info').append('<button type="button" id="create-voters-list-button">Créer une liste de votants</button><br><br>');
            $('#voters-info').append('<div id="create-voters-list"></div>');
            $('#voters-info').append('<div id="voters-list"></div>');
            getVotersList(organizerEmail);
            $('#voters-info').append('<div id="alert-create-poll"></div>');
            $('#voters-info').append('<div id="create-poll-buttons"></div>');
            $('#create-poll-buttons').append('<button type="submit" class="submit-button">Valider</button>');
            $('#create-poll-buttons').append('<button type="button" id="prev-poll-button">Précédent</button>');
        } else {
            $('#voters-info').show();
            $(document).on('click', '.submit-button', function() {
                creer_scrutin(organizerEmail);
            });
        }
    });

    $(document).on('click', '#create-voters-list-button', function() {
        $('#alert-create-poll').empty();
        if ($('#create-voters-form').length === 0) {
            $('#voters-list').empty();
            $('#create-poll-buttons').hide();
            $('#create-voters-list').append('<div id="create-voters-container"></div>');
            var form = '<form id="create-voters-form" action="../Vote/createVotersList.php" method="post">';
            form += '<label for="list-name">Nom de la liste</label><br><input type="text" id="list-name" name="list-name" required><br><br>';
            form += '<label for="voter-emails">Emails des votants (séparés par des retours à la ligne)</label><br><textarea id="voter-emails" name="voter-emails" required></textarea><br>';
            form += '<div id="alert-voters-email"></div><br>';
            form += '</form>';
            $('#create-voters-container').append(form);
            $('#create-voters-form').append('<div id="create-voters-buttons"></div>');
            $('#create-voters-buttons').append('<button type="submit" class="submit-button">Créer</button>');
            $('#create-voters-buttons').append('<button type="button" id="cancel-voters-button">Annuler</button>');

            $('#create-voters-container form').on('submit', function(e){
                e.preventDefault();
                creerListeVotants(organizerEmail);
            });
        }
    });

    $(document).on('click', '#prev-poll-button', function(){
        $('#head-form').html('<h1>Créer un scrutin</h1>');
        $('#voters-info').hide();
        $('#poll-info').show();
    });

    $(document).on('click', '#cancel-voters-button', function(){
        $('#create-voters-form').remove();
        getVotersList(organizerEmail);
        $('#create-poll-buttons').show();
    });

    
    
});



</script>


</html>