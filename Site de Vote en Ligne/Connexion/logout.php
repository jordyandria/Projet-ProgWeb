<?php
    session_start();
    session_destroy();
    header('Location: ../Accueil/index.php');
    exit();
?>