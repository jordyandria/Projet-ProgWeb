<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['error' => 'Email invalide.']);
        exit();
    }

    if ($password !== $confirmPassword) {
        echo json_encode(['error' => 'Les mots de passe ne correspondent pas.']);
        exit();
    }

    $file = 'users.json';

    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    
    $users = json_decode(file_get_contents($file), true);

    foreach ($users as $user) {
        if ($user['email'] === $email) {
            echo json_encode(['error' => 'Cet email est déjà inscrit.']);
            exit();
        }
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $users[] = ['name' => $name, 'email' => $email, 'password' => $hashedPassword];
    $data = json_encode($users, JSON_PRETTY_PRINT);
    file_put_contents($file, $data);

    echo json_encode(['success' => 'Inscription réussie.']);
    exit();
}
?>