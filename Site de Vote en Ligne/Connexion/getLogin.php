<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $json = file_get_contents('../Inscription/users.json');

    $users = json_decode($json, true);

    foreach ($users as $user) {
        if ($user['email'] == $email) {
            if (password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['email'] = $email;
                $_SESSION['name'] = $user['name'];
                echo 'Connexion réussie';
                return;
            }
        }
    }

    echo 'Email ou mot de passe incorrect';
}
?>