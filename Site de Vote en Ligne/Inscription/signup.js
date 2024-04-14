$(document).ready(function() {
    $('#signupForm form').on('submit', function(e) {
        e.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        inscription(name, email, password, confirmPassword);
    });

    $('#email, #password, #confirmPassword').on('keyup', function() {
        $('#alert-email, #alert-password').empty();
    });
});

function inscription(name, email, password, confirmPassword) {
    $.ajax({
        method: "POST",
        url: "getSignup.php",
        data: {
            "name": name,
            "email": email,
            "password": password,
            "confirmPassword": confirmPassword
        }
    }).done(function(data) {
        console.log(data);
        var reponse = JSON.parse(data);
        if(reponse.error){
            if (reponse.error === 'Cet email est déjà inscrit.') {
                $("#alert-email").html(reponse.error);
            } else if (reponse.error === 'Les mots de passe ne correspondent pas.') {
                $("#alert-password").html(reponse.error);
            } else if (reponse.error === 'Email invalide.') {
                $("#alert-email").html(reponse.error);
            }
        } else if(reponse.success){
            $('#signupForm').remove();
            $('#signup-success').append('<h1>Inscription réussie !</h1>');
            $('#signup-success').append('<a href="../Connexion/login.php" id="login-button">Se connecter</a>');
        }
    }).fail(function() {
        $("#signupForm").html("FAIL");
    });
}

