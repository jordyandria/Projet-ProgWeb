<?php

if ($_SERVER["REQUEST_METHOD"] == "POST"){

    $pollId = $_POST['pollId'];

    $file = 'scrutins.json';

    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé.']);
        exit();
    }

    $polls = json_decode(file_get_contents($file), true);

    $pollDetails = [];

    foreach ($polls as $poll) {
        if ($poll['id'] === $pollId) {
            $pollDetails = $poll;
        }
    }

    if (empty($pollDetails)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé pour cet identifiant.']);
        exit();
    }

    echo json_encode($pollDetails);

    exit();
}

?>