<?php
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $id = $_POST['id'];

    $file = 'votersList.json';

    if (!file_exists($file)) {
        echo json_encode('File not found.');
        exit();
    }

    $data = file_get_contents($file);
    $votersLists = json_decode($data, true);

    $votersLists = array_filter($votersLists, function($votersList) use ($id) {
        return $votersList['id'] != $id;
    });

    file_put_contents($file, json_encode(array_values($votersLists), JSON_PRETTY_PRINT));

    echo json_encode('List deleted successfully.');
    exit();
}
?>