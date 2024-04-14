<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $pollId = $_POST['pollId'];
    $userEmail = $_POST['userEmail'];
    $proxyEmail = $_POST['proxyEmail'];

    $file = 'scrutins.json';

    if (!file_exists($file)) {
        echo json_encode(['error' => 'Aucun scrutin trouvé.']);
        exit();
    }

    $polls = json_decode(file_get_contents($file), true);

    foreach ($polls as &$poll) {
        if ($poll['id'] === $pollId) {
            foreach ($poll['votants'] as &$participant) {
                if ($participant['email'] === $userEmail) {
                    $userVotes = $participant['votesLeft'];
                    break;
                }
            }
            foreach ($poll['votants'] as &$participant) {
                if ($participant['email'] === $proxyEmail) {
                    $participant['votesAvailable'] += $userVotes;
                    $participant['votesLeft'] += $userVotes;                        
                }
            }
            $poll['votants'] = array_filter($poll['votants'], function($participant) use ($userEmail) {
                return $participant['email'] !== $userEmail;
            });
            
            $poll['votants'] = array_values($poll['votants']);
        }
    }

    file_put_contents($file, json_encode($polls, JSON_PRETTY_PRINT));
    echo json_encode(['success' => 'Proxy donné.']);
    exit();

}
?>