
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
	var playerOneSelected = false;
	var playerTwoSelected = false;
	var playerCount = 0;
	var playersRef = database.ref('players');
	var playerOneExists = false;
	var playerTwoExists = false;

	playersRef.on('value', function (playersSnapshot) {

		playerOneExists = playersSnapshot.child('1').exists();
		playerTwoExists = playersSnapshot.child('2').exists();

		playerCount = playersSnapshot.numChildren();

		console.log('1 exists', playerOneExists);
		console.log('2 exists', playerTwoExists);






		if (playerOneExists && playerTwoExists) {
			console.log('hit 1', playerOneSelected, playerTwoSelected);
			displayPlayer1(playersSnapshot, playerOneSelected);
			displayPlayer2(playersSnapshot, playerTwoSelected);
		}
		else if (playerOneExists && !playerTwoExists) {
			displayPlayer1(playersSnapshot, playerOneSelected);
			console.log('hit 2', playerOneSelected, playerTwoSelected);
			$('#player-two-box').empty();
			$('#player-two-box').html('<h4>Waiting for Player 2</h4>');
		}
		else if (!playerOneExists && playerTwoExists) {
			displayPlayer2(playersSnapshot, playerTwoSelected);
			console.log('hit 3', playerOneSelected, playerTwoSelected	);
			$('#player-one-box').empty();
			$('#player-one-box').html('<h4>Waiting for Player 1</h4>');
		}


	});



	// Registers that play 1 has been added and updates the player one display boxes.
	function displayPlayer1(playersSnapshot, playerOneSelected) {

		var player1Ref = playersSnapshot.child('1');

		console.log('player 1 selected', player1Ref.val());

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

			$('#player-one-box').append('<h4>Rock</h4>').addClass('selections').attr('data-selection', 'Rock');
			$('#player-one-box').append('<h4>Papper</h4>').addClass('selections').attr('data-selection', 'Papper');
			$('#player-one-box').append('<h4>Scissors</h4>').addClass('selections').attr('data-selection', 'Scissors');
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

		$('#player-two-box').empty();
		$('#player-two-box').html('<h3>' + playerTwoName + '</h3>');
		// if player 1 exists, you can now make a selection.
		console.log(playerTwoSelected)
		if (playersSnapshot.child('1').exists() && playerTwoSelected) {

			$('#player-two-box').append('<h4>Rock</h4>').addClass('selections').attr('data-selection', 'Rock');
			$('#player-two-box').append('<h4>Papper</h4>').addClass('selections').attr('data-selection', 'Papper');
			$('#player-two-box').append('<h4>Scissors</h4>').addClass('selections').attr('data-selection', 'Scissors');
		}
		$('#player-two-box').append('<p id="twoStats">Wins: ' + playerTwoWins + '  Losses: ' + playerTwoLosses + '  Ties: ' + playerTwoTies + '</p>');
	};




	// User name submit button event.
	$('#user-name-submit').on('click', function (event) {
		// This stops the page from refreshing after submit is hit.
		event.preventDefault(event);
		// store players name that is submitted.
		var playerName = $('#user-name-input').val().trim();



		// playersRef.once('value')
		// 	.then(function (snapshot) {
		// 		var playerOneExists = snapshot.child('1').exists();
		// 		var playerTwoExists = snapshot.child('2').exists();
		// 		console.log('Player 1 Exists', playerOneExists);
		// 		console.log('Player 2 Exists', playerTwoExists);

		// If player 1 does NOT exist, then put in player 1 slot. //
		if (!playerOneExists) {
			playerOneSelected = true;
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
		// if both players exist, do nothing but possibly display a message. This should not be possible unless someone opens a window just before another person becomes the 2nd player.



	});




















	////////////////////// End of document ready function //////////////////////
});