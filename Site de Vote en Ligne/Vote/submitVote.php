<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $pollId = $_POST['pollId'];
    $optionId = $_POST['optionId'];
    $userEmail = $_POST['userEmail'];

    $file = 'scrutins.json';

    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé.']);
        exit();
    }

    $polls = json_decode(file_get_contents($file), true);
    $pollRes = null;

    foreach ($polls as &$poll) {
        if ($poll['id'] === $pollId) {
            if ($poll['finished']) {
                echo json_encode(['error' => 'Ce scrutin est terminé.']);
                exit();
            }
            foreach ($poll['votants'] as &$votant) {
                if ($votant['email'] === $userEmail) {
                    if ($votant['votesLeft'] <= 0) {
                        echo json_encode(['error' => 'Vous n\'avez plus de votes disponibles.']);
                        exit();
                    }
                    $votant['votesUsed']++;
                    $votant['votesLeft']--;
                }
            }
            foreach ($poll['options'] as &$option) {
                if ($option['option'] === $optionId) {
                    $option['votes']++;
                    $poll['totalVotesUsed']++;
                    $pollRes = $poll;
                }
            }
            break;
        }
    }

    file_put_contents($file, json_encode($polls, JSON_PRETTY_PRINT));

    if ($pollRes !== null) {
        echo json_encode($pollRes);
    } else {
        echo json_encode(['error' => 'Aucun scrutin correspondant trouvé.']);
    }
    exit();
}
?>