<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $pollId = $_POST['pollId'];

    $file = 'scrutins.json';

    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé.']);
        exit();
    }

    $polls = json_decode(file_get_contents($file), true);

    $polls = array_filter($polls, function($poll) use ($pollId) {
        return $poll['id'] !== $pollId;
    });

    file_put_contents($file, json_encode(array_values($polls), JSON_PRETTY_PRINT));
    echo json_encode(['success' => 'Scrutin supprimé.']);

    exit();
}
?>