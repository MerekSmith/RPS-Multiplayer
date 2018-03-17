
$(document).ready(function () {


	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyB3Exm_UxMrhV4SkV1e3ojYnXzJ_tfHiwU",
		authDomain: "rock-paper-scissors-179cf.firebaseapp.com",
		databaseURL: "https://rock-paper-scissors-179cf.firebaseio.com",
		projectId: "rock-paper-scissors-179cf",
		storageBucket: "",
		messagingSenderId: "1086972811535"
	};

	firebase.initializeApp(config);


	var database = firebase.database();
	var playerName;
	var playerOneSelected = false;
	var playerTwoSelected = false;
	var playerCount = 0;
	var playersRef = database.ref('players');
	var playerOneExists = false;
	var playerTwoExists = false;
	var playerNum;
	var opponentNum;
	var userSelection;
	var opponentSelection;
	var userSelectionExists = false;
	var opponentSelectionExists = false;
	var userWins = 0;
	var userLosses = 0;
	var userTies = 0;
	var opponentWins = 0;
	var opponentLosses = 0;
	var opponentTies = 0;
	var revealTime;
	var intervalTime;

	playersRef.on('value', function (playersSnapshot) {

		playerOneExists = playersSnapshot.child('1').exists();
		playerTwoExists = playersSnapshot.child('2').exists();

		playerCount = playersSnapshot.numChildren();

		if (playerOneExists && playerTwoExists) {
			displayPlayer1(playersSnapshot, playerOneSelected);
			displayPlayer2(playersSnapshot, playerTwoSelected);
		}
		else if (playerOneExists && !playerTwoExists) {
			displayPlayer1(playersSnapshot, playerOneSelected);
			$('#player-two-box').empty();
			$('#player-two-box').html('<h4>Waiting for Player 2</h4>');
		}
		else if (!playerOneExists && playerTwoExists) {
			displayPlayer2(playersSnapshot, playerTwoSelected);
			$('#player-one-box').empty();
			$('#player-one-box').html('<h4>Waiting for Player 1</h4>');
		}


	});



	// Registers that play 1 has been added and updates the player one display boxes.
	function displayPlayer1(playersSnapshot, playerOneSelected) {

		var player1Ref = playersSnapshot.child('1');

		var playerOneName = player1Ref.val().name;
		var playerOneWins = player1Ref.val().wins;
		var playerOneLosses = player1Ref.val().losses;
		var playerOneTies = player1Ref.val().ties;

		// Changes display for player 1 boxes.
		$('#results-box').empty();

		$('#player-one-box').empty();
		$('#player-one-box').html('<h3>' + playerOneName + '</h3>');
		// if player 1 exists, you can now make a selection.
		if (playersSnapshot.child('2').exists() && playerOneSelected) {

			$('#player-one-box').append('<div id="selectionArea"></div>');
			$('#selectionArea').append('<h4 class="selections" data-selection="Rock">Rock</h4>');
			$('#selectionArea').append('<h4 class="selections" data-selection="Paper">Paper</h4>');
			$('#selectionArea').append('<h4 class="selections" data-selection="Scissors">Scissors</h4>');
		}
		$('#player-one-box').append('<p id="oneStats">Wins: ' + playerOneWins + '  Losses: ' + playerOneLosses + '  Ties: ' + playerOneTies + '</p>');
	};



	// Registers that play 2 has been added and updates the player one display boxes.
	function displayPlayer2(playersSnapshot, playerTwoSelected) {

		var player2Ref = playersSnapshot.child('2');

		console.log('player 2 selected', player2Ref.val());

		var playerTwoName = player2Ref.val().name;
		var playerTwoWins = player2Ref.val().wins;
		var playerTwoLosses = player2Ref.val().losses;
		var playerTwoTies = player2Ref.val().ties;

		// Changes display for player 2 boxes.
		$('#results-box').empty();

		// $('#player-two-box').empty();
		$('#player-two-box').html('<h3>' + playerTwoName + '</h3>');
		// if player 1 exists, you can now make a selection.
		if (playersSnapshot.child('1').exists() && playerTwoSelected) {

			$('#player-two-box').append('<div id="selectionArea"></div>');
			$('#selectionArea').append('<h4 class="selections" data-selection="Rock">Rock</h4>');
			$('#selectionArea').append('<h4 class="selections" data-selection="Paper">Paper</h4>');
			$('#selectionArea').append('<h4 class="selections" data-selection="Scissors">Scissors</h4>');
		}
		else {
			$('#player-two-box').append('<div id="opponentSelectionArea"></div>');
		}
		$('#player-two-box').append('<p id="twoStats">Wins: ' + playerTwoWins + '  Losses: ' + playerTwoLosses + '  Ties: ' + playerTwoTies + '</p>');
	};


	// User name submit button event.
	$('#user-name-submit').on('click', function (event) {
		// This stops the page from refreshing after submit is hit.
		event.preventDefault(event);
		// store players name that is submitted.
		playerName = $('#user-name-input').val().trim();

		// If player 1 does NOT exist, then put in player 1 slot. //
		if (!playerOneExists) {
			playerOneSelected = true;
			playerNum = 1;
			opponentNum = 2;
			database.ref().child('players/1').set({
				name: playerName,
				wins: 0,
				losses: 0,
				ties: 0
			});
			database.ref('players/1').onDisconnect().remove()
			$('.userFormRow').empty();
			$('.userFormRow').html('<h3>Hi ' + playerName + '! You are Player 1</h3>');
		}
		// If player 2 does NOT exist, then put in player 2 slot. //
		else if (!playerTwoExists) {
			playerTwoSelected = true;
			playerNum = 2;
			opponentNum = 1;
			database.ref().child('players/2').set({
				name: playerName,
				wins: 0,
				losses: 0,
				ties: 0
			});
			database.ref('players/2').onDisconnect().remove()
			// Changes submit button to user greeting.
			$('.userFormRow').empty();
			$('.userFormRow').html('<h3>Hi ' + playerName + '! You are Player 2</h3>');
		}
	});



	// function for user selection
	$(document).on('click', '.selections', function () {
		// playersRef.off();

		userSelection = $(this).attr('data-selection');
		userSelectionExists = true;
		// save user selection into database.
		console.log('selection', userSelection)
		database.ref().child('players/' + playerNum).update({
			selection: userSelection
		});
		$('#selectionArea').empty();
		$('#selectionArea').html('<h2 id="userSelection">' + userSelection + '</h2>');

		// Catches opponents selection choice when it is made.
		opponentSelectionCheck();
		// Checks if opponent has made their selection and then compares to see who won.
	});

	function opponentSelectionCheck() {

		database.ref('players').on('value', function (selectionSnapshot) {
			opponentSelectionExists = selectionSnapshot.child(opponentNum + '/selection').exists();
			console.log('opponent made selection', opponentSelectionExists);
			if (opponentSelectionExists) {
				opponentSelection = selectionSnapshot.child(opponentNum + '/selection').val();
				console.log(opponentSelection);
			}
			if (opponentSelectionExists && userSelectionExists) {
				$('#selectionArea').empty();
				$('#selectionArea').html('<h2 id="userSelection">' + userSelection + '</h2>');
				$('#opponentSelectionArea').html('<h2 id="opponentSelection">' + opponentSelection + '</h2>');


				compareSelections(selectionSnapshot)
			}

		});
	};



	function compareSelections(selectionSnapshot) {

		var userName = selectionSnapshot.child(playerNum + '/name').val()
		console.log('snapshot test', userName)
		userWins = selectionSnapshot.child(playerNum + '/wins').val()
		userLosses = selectionSnapshot.child(playerNum + '/losses').val()
		userTies = selectionSnapshot.child(playerNum + '/ties').val()
		var opponentName = selectionSnapshot.child(opponentNum + '/name').val()
		opponentWins = selectionSnapshot.child(opponentNum + '/wins').val()
		opponentLosses = selectionSnapshot.child(opponentNum + '/losses').val()
		opponentTies = selectionSnapshot.child(opponentNum + '/ties').val()

		// TODO: run if function for timer to complete the below once 3 seconds has passed.

		if ((userSelection === "Rock") && (opponentSelection === "Scissors")) {
			userWins++;
			opponentLosses++;
			$('#results-box').html('<h2>' + userName + ' Wins! </h2>')
		} else if ((userSelection === "Rock") && (opponentSelection === "Paper")) {
			userLosses++;
			opponentWins++;
			$('#results-box').html('<h2>' + opponentName + ' Wins! </h2>')
		} else if ((userSelection === "Scissors") && (opponentSelection === "Rock")) {
			userLosses++;
			opponentWins++;
			$('#results-box').html('<h2>' + opponentName + ' Wins! </h2>')
		} else if ((userSelection === "Scissors") && (opponentSelection === "Paper")) {
			userWins++;
			opponentLosses++;
			$('#results-box').html('<h2>' + userName + ' Wins! </h2>')
		} else if ((userSelection === "Paper") && (opponentSelection === "Rock")) {
			userWins++;
			opponentLosses++;
			$('#results-box').html('<h2>' + userName + ' Wins! </h2>')
		} else if ((userSelection === "Paper") && (opponentSelection === "Scissors")) {
			userLosses++;
			opponentWins++;
			$('#results-box').html('<h2>' + opponentName + ' Wins! </h2>')
		} else if (userSelection === opponentSelection) {
			userTies++;
			opponentTies++;
			$('#results-box').html("<h2>It's a Tie!</h2>")
		};

		// Updates firebase with new numbers. This should update the opponents numbers as well on their end.

		revealTimer()

	};

	function revealTimer() {
		revealTime = 2;
		clearInterval(intervalTime);
		intervalTime = setInterval(updateScores, 1000);
	};


	function updateScores() {
		revealTime--;
		if (revealTime === 0) {
			userSelectionExists = false;
			opponentSelectionExists = false;
			database.ref().child('players/' + playerNum).update({
				wins: userWins,
				losses: userLosses,
				ties: userTies
			});
			database.ref().child('players/' + playerNum + '/selection').remove();
		}
	};

// Chat box input, gets saved to Firebase
	$('#chat-submit').on('click', function (event) {
		event.preventDefault(event);
		if (playerNum === 1 || playerNum === 2) {
			var message = $('#chat-input').val();
			if (!(message === '')) {
				database.ref().child('messages').push({
					user: playerName,
					message: message
				});
			};
		};
	});

	// Firebase listener for chat box input.
	database.ref('messages').on('child_added', function (chatSnapshot) {
		var user = chatSnapshot.val().user
		var message = chatSnapshot.val().message
		$('#chatBox').append('<p>' + user + ': ' + message + '</p>')
	});


	////////////////////// End of document ready function //////////////////////
});