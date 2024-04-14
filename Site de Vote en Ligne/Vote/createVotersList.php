<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['listName']) && isset($_POST['voters'])) {
        $file = 'votersList.json';

        if (!file_exists($file)) {
            file_put_contents($file, json_encode([]));
        }

        $votersListData = json_decode(file_get_contents($file), true);

        $voters = explode(",", $_POST['voters']);

        foreach ($voters as $voter) {
            if (!filter_var($voter, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['error' => 'Email invalide : ' . $voter]);
                exit();
            }
        }

        $newVotersList = array(
            'id' => uniqid(),
            'organizer' => $_SESSION['email'],
            'listName' => $_POST['listName'],
            'voters' => $voters 
        );

        $votersListData[] = $newVotersList;
        $data = json_encode($votersListData, JSON_PRETTY_PRINT);
        file_put_contents($file, $data);

        echo json_encode(['success' => 'Liste de votants créée.']);
        exit();
    }
}
?>
