<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $organizer = $_POST['organizer'];

    $file = 'votersList.json';

    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucune liste de votants trouvée.']);
        exit();
    }

    $votersLists = json_decode(file_get_contents($file), true);

    $organizerVotersLists = [];
    foreach ($votersLists as $votersList) {
        if ($votersList['organizer'] === $organizer) {
            $organizerVotersLists[] = $votersList;
        }
    }

    if (empty($organizerVotersLists)) {
        echo json_encode(['error' => 'Aucune liste de votants trouvée pour cet organisateur.']);
        exit();
    }

    echo json_encode($organizerVotersLists);
    exit();
}
?>
