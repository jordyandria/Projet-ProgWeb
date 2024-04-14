function creer_scrutin(organizerEmail){

    $('#alert-create-poll').empty();

    var title = $('#title').val();
    var question = $('#question').val();
    var options = [];
    var voters = [];
    $('#voters-list .voter-checkbox:checked').each(function() {
        var voterEmail = $(this).val();
        var proxyNumber = $(this).siblings('select[name="proxy-number"]').val();
        voters.push({
            email: voterEmail,
            proxyNumber: proxyNumber
        });
    });


    $('.option').each(function() {
        options.push({
            option: $(this).val(),
            votes: 0
        });
    });

    console.log(title);
    console.log(question);
    console.log(options);
    console.log(voters);

    $.ajax({
        url: '../Vote/createPoll.php',
        type: 'POST',
        data: {
            "title": title,
            "question": question,
            "options": options,
            "voters": voters
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.error) {
            $('#alert-create-poll').html(response.error);
        } else {
            console.log(data);
            $('#votes-start').show();
            $('#head-form').hide();
            $('#create-poll-form').empty();
            getUserPolls(organizerEmail);
            $('#poll-list').show();
        }
    });
    
}

function creerListeVotants(organizerEmail){
    $('#alert-voters-email').empty();

    var listName = $('#list-name').val();
    var voterEmails = $('#voter-emails').val(); 
    var votersSplited = voterEmails.split('\n').join(',');;

    console.log(listName);
    console.log(votersSplited);

    $.ajax({
        url: '../Vote/createVotersList.php',
        type: 'POST',
        data: {
            "listName": listName,
            "voters": votersSplited
        }
    }).done(function(data) {
        var response = JSON.parse(data);
        if (response.error) {
            $('#alert-voters-email').html(response.error);
        } else {
            console.log(data);
            $('#create-voters-list').empty();
            getVotersList(organizerEmail);
            $('#create-poll-buttons').show();
        }
    });
}

function getVotersList(organizerEmail) {
    $.ajax({
        url: '../Vote/getVotersList.php',
        type: 'POST',
        data: {
            "organizer": organizerEmail
        }
    }).done(function(data) {
        var response = JSON.parse(data);
        if (response.error) {
            $('#voters-list').html('<div id="alert-voters-list">' + response.error + '</div>');
        } else {
            var html = '';
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                html += '<div class="voters-list-container">';
                html += '<div class="voters-list-content">'
                html += '<h2>' + response[i].listName + '</h2>';
                for (var j = 0; j < response[i].voters.length; j++) {
                    html += '<div class="voter"><input type="checkbox" class="voter-checkbox" name="voters[]" value="' + response[i].voters[j]  + '"><div class="voters-email">' + response[i].voters[j] + '</div></div>';
                }
                html += '</div></div>';
                var votersString = JSON.stringify(response[i].voters);
                console.log(votersString);
                html += '<div class="voters-list-menu"><button class="delete-voters-list-button" onclick="supprimer_liste_votants(\'' + response[i].id + '\', \'' + organizerEmail + '\')">Supprimer la liste de votants</button></div>';            
            }
            $('#voters-list').append(html);
        }
    });
}

function supprimer_liste_votants(id, organizerEmail) {
    $('#alert-create-poll').empty();
    $('#voters-list').empty();
    $.ajax({
        url: '../Vote/deleteVotersList.php',
        type: 'POST',
        data: {
            "id": id
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.error) {
            console.log(response.error);
        } else {
            getVotersList(organizerEmail);
        }
    });
}

function getUserPolls(organizerEmail){
    $.ajax({
        url: '../Vote/getUserPolls.php',
        type: 'POST',
        data: {
            "organizerEmail": organizerEmail
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.error) {
            $('#polls-list').html('<div id="alert-polls-list">' + response.error + '</div>');
            var pollList = $('#poll-list');
            pollList.empty();
            pollList.append('<div id="participating-polls-container"></div>');
            getParticipatingPolls(organizerEmail);
        } else {
            var pollList = $('#poll-list');
            pollList.empty();
            pollList.append('<div id="users-polls-container"><h1>Mes scrutins</h1></div>');
            $('#users-polls-container').append('<div id="non-finished-polls"></div>');
            $('#users-polls-container').append('<div id="finished-polls"></div>');
            for (var i = 0; i < response.length; i++) {
                if (!response[i].finished){
                    console.log(response[i]);
                    $('#non-finished-polls').append(`
                        <div class="poll-container">
                            <div class="poll-content">
                                <div class="poll-title">
                                    <div class="non-finished-poll-indication">En cours</div>
                                    ${response[i].title} | ${response[i].question}
                                </div>
                                <div class="partipication-indication"><i>Taux de participation : ${getParticipationRate(response[i])}%</i></div>
                                <button class="poll-details-button" onclick="getPollsDetails('${response[i].id}')">Détails</button>
                            </div>
                            <div class="poll-menu">
                                <div class="poll-menu-content">
                                    <button class="finish-poll-button" onclick="finishPoll('${response[i].id}', '${organizerEmail}')">Clore</button>
                                    <button class="delete-poll-button" onclick="deletePoll('${response[i].id}', '${organizerEmail}')">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    `);                
                }
                if (response[i].finished){
                    console.log(response[i]);
                    $('#finished-polls').append(`
                        <div class="poll-container">
                            <div class="poll-content">
                                <div class="poll-title">
                                    <div class="finished-poll-indication">Terminé</div>
                                    ${response[i].title} | ${response[i].question}
                                </div>
                                <div class="partipication-indication"><i>Taux de participation : ${getParticipationRate(response[i])}%</i></div>
                                <button class="poll-details-button" onclick="getPollsDetails('${response[i].id}')">Détails</button>
                            </div>
                            <div class="poll-menu">
                                <div class="poll-menu-content">
                                    <button class="view-result-button" onclick="viewResults('${response[i].id}', '${organizerEmail}')">Résultats</button>
                                    <button class="delete-poll-button" onclick="deletePoll('${response[i].id}', '${organizerEmail}')">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    `);
                }
            }
            pollList.append('<div id="participating-polls-container"></div>');
            getParticipatingPolls(organizerEmail);
        }
    });
}

function deletePoll(pollId, organizerEmail){
    $.ajax({
        url: '../Vote/deletePoll.php',
        type: 'POST',
        data: {
            "pollId": pollId
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.error) {
            console.log(response.error);
        } else {
            console.log(response);
            $('#poll-list').empty();
            getUserPolls(organizerEmail);
        }
    });
}

function finishPoll(pollId, organizerEmail){
    $.ajax({
        url: '../Vote/finishPoll.php',
        type: 'POST',
        data: {
            "pollId": pollId
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.error) {
            console.log(response.error);
        } else {
            console.log(response);
            $('#poll-list').empty();
            getUserPolls(organizerEmail);
        }
    });
}

function getParticipatingPolls(userEmail){
    $.ajax({
        url: '../Vote/getParticipatingPolls.php',
        type: 'POST',
        data: {
            "userEmail": userEmail
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if(response.error){
            console.log(response.error);
        } else {
            $('#participating-polls-container').append('<h1>Scrutins auxquels je participe</h1>');
            $('#participating-polls-container').append('<div id="non-finished-participating-polls"></div>');
            $('#participating-polls-container').append('<div id="finished-participating-polls"></div>');
            for (var i = 0; i < response.length; i++) {
                if (!response[i].finished){
                    $('#non-finished-participating-polls').append(`
                        <div class="poll-container">
                            <div class="poll-content">
                                <div class="poll-title">
                                    <div class="non-finished-poll-indication">En cours</div>
                                    ${response[i].title} | ${response[i].question}
                                </div>
                                <div class="organizerName">Organisé par : ${response[i].organizerName}</div>
                                <div class="partipication-indication"><i>Taux de participation : ${getParticipationRate(response[i])}%</i></div>
                            </div>
                            <div class="poll-menu">
                                <div class="poll-menu-content">
                                    <button class="start-vote-button" onclick="startVotePoll('${response[i].id}','${userEmail}')">Voter</button>
                                    <button class="give-proxy-button" onclick="giveProxy('${response[i].id}', '${userEmail}')">Donner procuration</button>
                                </div>
                            </div>
                        </div>
                    `);                
                }
                if (response[i].finished){
                    $('#finished-participating-polls').append(`
                        <div class="poll-container">
                            <div class="poll-content">
                                <div class="poll-title">
                                    <div class="finished-poll-indication">Terminé</div>
                                    ${response[i].title} | ${response[i].question}
                                </div>
                                <div class="organizerName">Organisé par : ${response[i].organizerName}</div>
                                <div class="partipication-indication"><i>Taux de participation : ${getParticipationRate(response[i])}%</i></div>
                            </div>
                            <div class="poll-menu">
                                <div class="poll-menu-content">
                                    <button class="view-result-button" onclick="viewResults('${response[i].id}')">Résultats</button>
                                </div>
                            </div>
                        </div>
                    `);
                }       
            }
        }
    }); 
}

function giveProxy(pollId, userEmail){
    $('#poll-list').empty();
    $('#votes-start').hide();

    $('#votesContent').append('<div id="poll-details-question-container"></div>');
    $('#poll-details-question-container').append('<div id="poll-details-question-content"></div>');
    $('#poll-details-question-content').append('<div id="poll-details-question"></div>');
    $('#poll-details-question').append('<div style="margin : 10px 0px;">À qui souhaitez-vous donner procuration ?</div>');
    $('#poll-details-question-content').append('<div id="user-vote-question-container"></div>');
    $('#user-vote-question-container').append('<div id="user-vote-question-content"></div>');
    $('#user-vote-question-content').append('<div id="user-vote-question"></div>');
    $('#user-vote-question-content').append('<div id="user-vote-options"></div>');
    $.ajax({
        url: '../Vote/getPollsDetails.php',
        type: 'POST',
        data: {
            "pollId": pollId
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if(response.error){
            console.log(response.error);
        } else {
            $('#user-vote-question').append('Pour le scrutin : ' + response.title + ' | ' + response.question);
            var votants = response.votants;

            for (var i = 0; i < votants.length; i++) {
                if (votants[i].email !== userEmail){
                    $('#user-vote-options').append('<input type="radio" name="proxy" value="' + votants[i].email + '"> ' + votants[i].email + '<br>');
                }
            }

            $('#poll-details-question-content').append('<div id="alert-proxy"></div>');
            $('#poll-details-question-content').append('<form id="proxy-form"></form>');
            $('#proxy-form').append('<button id="proxy-button" type="submit">Donner procuration</button>')
            $('#proxy-form').append('<button id="back-to-polls-button-after-vote" onclick="backToPollsAfterProxy(\'' + userEmail + '\')">Retour</button>');

            $('#proxy-form').on('submit', function(e) {
                $('#alert-proxy').empty();
                e.preventDefault();
            
                var selectedProxy = $('input[name="proxy"]:checked').val();
            
                if (!selectedProxy) {
                    $('#alert-proxy').html('Veuillez sélectionner un votant.');
                    return;
                }
            
                $.ajax({
                    url: '../Vote/giveProxy.php',
                    type: 'POST',
                    data: {
                        pollId: pollId,
                        userEmail: userEmail,
                        proxyEmail: selectedProxy
                    }
                }).done(function(data) {
                    console.log(data);
                    var response = JSON.parse(data);
                    if (response.error) {
                        $('#alert-proxy').html(response.error);
                    } else {
                        console.log(response);
                        backToPollsAfterProxy(userEmail);
                    }
                });
            });
        }
    });
}

function backToPollsAfterProxy(userEmail){
    $('#poll-details-question-container').remove();
    $('#poll-list').show();
    $('#votes-start').show();
    getUserPolls(userEmail);
}

function viewResults(pollId){
    $.ajax({
        url: '../Vote/getPollsDetails.php',
        type: 'POST',
        data: {
            "pollId": pollId
        }
    }).done(function(data){
        console.log(data);
        var response = JSON.parse(data);
        if(response.error){
            console.log(response.error);
        } else {
            $('#votes-start').hide();
            $('#poll-list').hide();
            $('#votesContent').append('<div id="poll-results-super-container"></div>');
            $('#poll-results-super-container').append('<h1>Résultats du scrutin</h1>');
            $('#poll-results-super-container').append('<div id="poll-details-container"></div>');
            $('#poll-details-container').append('<div id="poll-details-content"></div>');
            $('#poll-details-content').append('<div id="poll-details-title"></div>');
            $('#poll-details-title').append(response.title);
            $('#poll-details-content').append('<div id="poll-details-voters"></div>');
            $('#poll-details-voters').append('Organisé par : ' + response.organizerName + '<br>');
            $('#poll-details-voters').append('<div style="margin-top : 2px;">Taux de participation : ' + getParticipationRate(response) + '%</div>');
            $('#poll-details-voters').append('<div style="margin-top : 2px;"><i>Votants inscrits : ' + response.votants.length + '</i></div>');
            $('#poll-results-super-container').append('<div id="poll-details-question-container"></div>');
            $('#poll-details-question-container').append('<div id="poll-details-question-content"></div>');
            $('#poll-details-question-content').append('<div id="poll-details-question"></div>');
            $('#poll-details-question').append(response.question);
            $('#poll-details-question-content').append('<div id="user-vote-question-container"></div>');
            $('#user-vote-question-container').append('<div id="user-vote-question-content"></div>');
            var winningOption = response.options.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
            console.log(winningOption);
            var totalVotes = response.totalVotesUsed;
            if (totalVotes === 0) {
                totalVotes = 1;
            }
            var votingRate = winningOption.votes / totalVotes;
            if (!(votingRate === 0 || votingRate === 100 || Number.isInteger(votingRate))){
                votingRate = votingRate.toFixed(2);
            }
            $('#user-vote-question-content').append('<div style="margin-top : 5px;">Le « ' + winningOption.option + ' » (' + (votingRate * 100) + '%) l\'emporte.</div><br>');
            $('#user-vote-question-content').append('<div id="poll-details-options"></div>');
            response.options.forEach(function(option) {
                var percentage = option.votes / totalVotes;
                if (!(percentage === 0 || percentage === 100 || Number.isInteger(percentage))){
                    percentage = percentage.toFixed(2);
                }
                percentage = percentage * 100;
                $('#poll-details-options').append('<div style="margin-bottom : 10px;">' + option.option + ' : ' + option.votes + ' (' + percentage + '%)</div>');
            });
            $('#poll-results-super-container').append('<button id="back-to-polls-button" onclick="backToPollsAfterResult()">Retour</button>');
        }
    });
}

function backToPollsAfterResult(){
    $('#poll-results-super-container').remove();
    $('#poll-list').show();
    $('#votes-start').show();
}

function startVotePoll(pollId, userEmail){
    $('#poll-list').empty();
    $('#votes-start').hide();
    $.ajax({
        url: '../Vote/getPollsDetails.php',
        type: 'POST',
        data: {
            "pollId": pollId
        }
    }).done(function(data){
        console.log(data);
        var response = JSON.parse(data);
        if(response.error){
            console.log(response.error);
        } else {
            $('#votesContent').append('<div id="poll-vote-super-container"></div>');
            $('#poll-vote-super-container').append('<h1>Mon vote</h1>');
            $('#poll-vote-super-container').append('<div id="user-vote-container"></div>');
            $('#user-vote-container').append('<div id="user-vote-content"></div>');
            $('#user-vote-content').append('<div id="user-vote-title"></div>');
            $('#user-vote-title').append(response.title);
            $('#user-vote-content').append('<div id="user-vote-question-container"></div>');
            $('#user-vote-question-container').append('<div id="user-vote-question-content"></div>');
            $('#user-vote-question-content').append('<div id="user-vote-question"></div>');
            $('#user-vote-question').append('<i>Question : ' + response.question + '</i>');
            $('#user-vote-question-content').append('<div id="user-vote-options"></div>');
            for (var i = 0; i < response.options.length; i++) {
                $('#user-vote-options').append('<input type="radio" id="option' + i + '" name="option" value="' + response.options[i].option + '"> ' + response.options[i].option + '<br>');
            }
            var votants = response.votants;
            var votant = votants.find(function(votant) {
                return votant.email === userEmail;
            });
            $('#user-vote-content').append(`
                <div id="vote-left-indication">Il vous reste ${votant.votesLeft} votes</div>
                <div id="alert-vote"></div>
                <form id="vote-form">
                    <input type="hidden" name="pollId" value="${pollId}">
                    <button class="vote-button" type="submit">Je vote</button>
                    <button id="back-to-polls-button-after-vote" onclick="backToPollsAfterVote('${userEmail}')">Retour</button>
                </form>
            `);

            $('#vote-form').on('submit', function(e) {
                $('#alert-vote').empty();
                e.preventDefault();
            
                var selectedOption = $('input[name="option"]:checked').val();
            
                if (!selectedOption) {
                    $('#alert-vote').html('Veuillez sélectionner une option.');
                    return;
                }

                console.log(selectedOption);
            
                $.ajax({
                    url: '../Vote/submitVote.php',
                    type: 'POST',
                    data: {
                        pollId: pollId,
                        optionId: selectedOption,
                        userEmail: userEmail
                    }
                }).done(function(data) {
                    console.log(data);
                    var response = JSON.parse(data);
                    if (response.error) {
                        $('#alert-vote').html(response.error);
                    } else {
                        console.log(response);
                        var votantsRes = response.votants;
                        console.log(votantsRes);
                        var votantRes = votantsRes.find(function(votant) {
                            return votant.email === userEmail;
                        });
                        $('#vote-left-indication').html('Il vous reste ' + votantRes.votesLeft + ' votes');
                    }
                });
            });
        }
    });
}

function backToPollsAfterVote(organizerEmail){
    $('#poll-vote-super-container').remove();
    $('#votes-start').show();
    getUserPolls(organizerEmail);
}

function getParticipationRate(poll) {
    console.log(poll);
    var total = Number(poll.totalVotesAvailable);
    var used = Number(poll.totalVotesUsed);

    console.log(total);
    console.log(used);

    if (total === 0) {
        return 0;
    } else {
        var rate = (used / total) * 100;
        if (rate === 0 || rate === 100 || Number.isInteger(rate)) {
            return rate;
        } else {
            return rate.toFixed(2);
        }
    }
}

function getPollsDetails(pollId){
    $.ajax({
        url: '../Vote/getPollsDetails.php',
        type: 'POST',
        data: {
            "pollId": pollId
        }
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.error){
            console.log(response.error);
        } else {
            $('#votes-start').hide();
            $('#poll-list').hide();
            $('#votesContent').append('<div id="poll-details-super-container"></div>');
            $('#poll-details-super-container').append('<h1>Détails du scrutin</h1>');
            $('#poll-details-super-container').append('<div id="poll-details-container"></div>');
            $('#poll-details-container').append('<div id="poll-details-content"></div>');
            $('#poll-details-content').append('<div id="poll-details-title"></div>');
            $('#poll-details-title').append(response.title);
            $('#poll-details-content').append('<div id="poll-details-voters"></div>');
            $('#poll-details-voters').append('<i>Votants inscrits : ' + response.votants.length + '</i>');
            $('#poll-details-super-container').append('<div id="poll-details-question-container"></div>');
            $('#poll-details-question-container').append('<div id="poll-details-question-content"></div>');
            $('#poll-details-question-content').append('<div id="poll-details-question"></div>');
            $('#poll-details-question').append(response.question);
            $('#poll-details-question-content').append('<div id="poll-details-options"></div>');
            for (var i = 0; i < response.options.length; i++) {
                $('#poll-details-options').append('<input type="radio" id="option' + i + '" disabled> ' + response.options[i].option + '<br>');
            }
            $('#poll-details-super-container').append('<div id="poll-details-voters-container"></div>');
            $('#poll-details-voters-container').append('<div id="poll-details-voters-content"></div>');
            $('#poll-details-voters-content').append('<div id="poll-details-voters-title"></div>');
            $('#poll-details-voters-title').append('Votants');
            $('#poll-details-voters-content').append('<div id="poll-details-voters-list"></div>');
            for (var i = 0; i < response.votants.length; i++) {
                $('#poll-details-voters-list').append('<div class="voter"><i>' + response.votants[i].email + ' a voté ' + response.votants[i].votesUsed + ' fois</i></div>');
            }
            $('#poll-details-super-container').append('<button id="back-to-polls-button" onclick="backToPolls()">Retour</button>');

        }
    });
}

function backToPolls(){
    $('#poll-details-super-container').remove();
    $('#poll-list').show();
    $('#votes-start').show();
}