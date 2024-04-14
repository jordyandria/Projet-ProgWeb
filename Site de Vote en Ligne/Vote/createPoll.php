<?php
session_start(); 

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    if(isset($_POST['title']) && isset($_POST['question']) && isset($_POST['options']) && isset($_POST['voters']) && !empty($_POST['voters'])){
        $file = 'scrutins.json';

        if (!file_exists($file)) {
            file_put_contents($file, json_encode([]));
        }

        $pollData = json_decode(file_get_contents($file), true);

        $voters = [];
        foreach ($_POST['voters'] as $voter) {
            $voters[] = [
                'email' => $voter['email'],
                'votesAvailable' => 1,
                'votesUsed' => 0,
                'votesLeft' => 1
            ];
        }

        $totalVotes = 0;
        foreach ($voters as $votant) {
            $totalVotes += $votant['votesAvailable'];
        }

        $newPoll = array(
            'id' => uniqid(),
            'organizer' => $_SESSION['email'],
            'organizerName' => $_SESSION['name'],
            'title' => $_POST['title'],
            'question' => $_POST['question'],
            'options' => $_POST['options'],
            'votants' => $voters,
            'totalVotesAvailable' => $totalVotes,
            'totalVotesUsed' => 0,
            'finished' => false,
        );

        $pollData[] = $newPoll;

        $data = json_encode($pollData, JSON_PRETTY_PRINT);
        file_put_contents($file, $data);

        echo json_encode(['success' => 'Scrutin créé.']);
        exit();
    }

    if (empty($voters)) {
        echo json_encode(['error' => 'Pas de votants sélectionnés.']);
        exit();
    }
}
?>