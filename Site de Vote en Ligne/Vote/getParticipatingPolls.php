<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $userEmail = $_POST['userEmail'];

    $file = 'scrutins.json';

    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé.']);
        exit();
    }

    $polls = json_decode(file_get_contents($file), true);

    $participatingPolls = array_filter($polls, function($poll) use ($userEmail) {
        foreach ($poll['votants'] as $votant) {
            if ($votant['email'] === $userEmail) {
                return true;
            }
        }
        return false;
    });

    if (empty($participatingPolls)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé pour cet utilisateur.']);
        exit();
    }

    echo json_encode(array_values($participatingPolls));
    exit();
}
?>