<?php

if ($_SERVER["REQUEST_METHOD"] == "POST"){

    $organizerEmail = $_POST['organizerEmail'];

    $file = 'scrutins.json';
    
    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé.']);
        exit();
    }

    $polls = json_decode(file_get_contents($file), true);

    $organizerPolls = [];

    foreach ($polls as $poll) {
        if ($poll['organizer'] === $organizerEmail) {
            $organizerPolls[] = $poll;
        }
    }

    if (empty($organizerPolls)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé pour cet organisateur.']);
        exit();
    }

    echo json_encode($organizerPolls);
    
    exit();

}
?>