$(document).ready(function() {
    $('#loginForm form').on('submit', function(e) {
        e.preventDefault();
        $('.alert').empty();

        var email = $('#email').val();
        var password = $('#password').val();

        connexion(email, password);
    });
});

function connexion(email, password) {
    $.ajax({
        method: "POST",
        url: "getLogin.php",
        data: {
            "email": email,
            "password": password
        }
    }).done(function(response) {
        console.log(response);
        if (response === 'Connexion réussie') {
            window.location.href = '../Accueil/index.php';
        } else {
            $('.alert').html(response);
        }
    }).fail(function() {
        $('.alert').html('Une erreur est survenue lors de la connexion.');
    });
}