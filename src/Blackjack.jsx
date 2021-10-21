import React from 'react';
import { Text, Box } from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Cards from './components/cards/Cards';
import PlayerControlPanel from './components/player-control-panel/PlayerControlPanel';
import { generateDeck, shuffleDeck } from './utilities/deck';
import gameOptions from './player-options';

/**
 * 
 */
class Blackjack extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			currentWager: 0,
			playerCards: [],
			dealerCards: [],
			deck: [],
			playerBalance: 500,
			playerOptions: null,
			playerHandValue: 0,
			dealerHandValue: 0,
		};
	}

	componentDidMount() {
		this.generateNewDeck();
		this.setState({ playerOptions: gameOptions.menu });
	}

	/**
	 * Generates a new shuffled deck and saves to state
	 */
	generateNewDeck = () => {
		const deck = shuffleDeck(generateDeck());
		this.setState({ deck });
	}

	/**
	 * Takes player input and handles it
	 * @param {value: String} param0
	 */
	handlePlayerInput = ({ value }) => {
		if (value === 'exit') {
			// Player has walked away
			process.exit();
		}
		if (value.startsWith('bet')) {
			// Player has placed a bet
			const betValue = parseInt(value.split(':')[1]);
			// Ensure integer has been parsed and is truthy
			if (betValue) {
				this.setState({ playerOptions: null });
				this.placePlayerBet(betValue);
			}
		}
		if (value === 'hit') {
			this.dealPlayerCard();
		}
		if (value === 'stay') {
			this.dealersTurn();
		}
		if (value === "play") {
			this.generateNewDeck();
			this.setState({
				playerCards: [],
				dealerCards: [],
				currentWager: 0,
				playerOptions: gameOptions.menu
			});
		}
	}

	/**
	 * Removes the bet from teh players balance, sets currentWager
	 * and starts the game.
	 * @param {Number} bet 
	 */
	placePlayerBet = (bet) => {
		this.setState({ currentWager: bet, playerBalance: this.state.playerBalance - bet });
		this.startGame();
	}

	/**
	 * Deals both the player and dealer cards
	 * and sets the player 'game' options
	 */
	startGame = () => {
		this.dealPlayerCard();
		this.dealDealerCard(false);
		this.dealPlayerCard();
		this.dealDealerCard(true);
		this.setState({ playerOptions: gameOptions.game });
	}

	/**
	 * Removes a card from the deck and adds it to the players hand
	 * Checks if the player has gone bust and if so, sets the appropriate
	 * playerOption.
	 */
	dealPlayerCard = () => {
		const { deck } = this.state;
		const [ card ] = deck.slice(0, 1);

		if (card) {
			this.setState({
				playerCards: [...this.state.playerCards, card],
				deck: deck.slice(1),
			});
		} else {
			// This will reset the game if we've run out of cards
			// This should be impossible with a single deck
			this.handlePlayerInput({ value: 'play' });

			return;
		}

		if (this.playerIsBust(this.state.playerCards)) {
			this.setState({
				playerOptions: gameOptions.playerBust
			});
		}
	}

	/**
	 * Pops a card from the deck and adds it to the dealers card.
	 * The cards 'faceDown' attr will be overridden by the faceDown param
	 * @param {Boolean} faceDown 
	 */
	dealDealerCard = (faceDown) => {
		const { deck } = this.state;
		const [ card ] = deck.slice(0, 1);
		card.faceDown = faceDown;
		this.setState({
			dealerCards: [...this.state.dealerCards, card],
			deck: deck.slice(1)
		});
	}

	calculateValue = (cards) => {
		let value = 0;
		// We'll split out aces from the hand as we can add them last
		// this ensures we don't first count the aces as 11,
		// potentially bringing us over 21
		const aces = cards.filter(card => card.rank === 'Ace');
		const otherCards = cards.filter(card => card.rank !== 'Ace');

		otherCards.forEach(card => {
			const numericValue = parseInt(card.rank);
			// If the parsed value is falsy it's a picture card
			if (numericValue) {
				value += numericValue;
			} else {
				value += 10;
			}
		});

		value += aces.length;
		if (aces.length && 21 - value >= 10) {
			value += 10;
		}

		return value;
	}

	/**
	 * Returns true if the total value of cards is greater than
	 * 21. Otherwise returns false.
	 * Has a side effect of setting the playerHandValue.
	 * @param {Object[]} cards 
	 * @returns {Boolean}
	 */
	playerIsBust = (cards) => {
		const cardsTotalValue = this.calculateValue(cards);
		this.setState({ playerHandValue: cardsTotalValue });

		if (cardsTotalValue > 21) {
			return true;
		}

		return false;
	}

	/**
	 * Sets the playerOptions to 'dealersTurn' and flips over all dealer cards
	 * Dealer always draws another card while the value is < 17.
	 */
	dealersTurn = () => {
		this.setState({ playerOptions: gameOptions.dealersTurn });
		const dealerCards = this.state.dealerCards.map(card => ({ ...card, faceDown: false }));
		this.setState({ dealerCards });
		let dealersHandValue = this.calculateValue(dealerCards);

		if (dealersHandValue < 17) {
			this.dealDealerCard(false);
			dealersHandValue += this.calculateValue(this.state.dealerCards);
			this.dealersTurn();
		} else {
			this.awardWinner();
		}
	}

	awardWinner = () => {
		const { playerCards, dealerCards, currentWager } = this.state;
		const playerValue = this.calculateValue(playerCards);
		const dealerValue = this.calculateValue(dealerCards);
		let winnings = currentWager;

		// At this point we know the player hasn't gone bust
		if (dealerValue > 21 || dealerValue < playerValue) {
			// player wins
			if (playerValue === 21) {
				winnings = winnings * 2;
			} else {
				winnings = winnings * 1.5;
			}
			this.setState({
				playerOptions: gameOptions.playerWins,
				playerBalance: this.state.playerBalance + winnings
			});
		} else if (dealerValue === playerValue) {
			// Draw
			this.setState({
				playerOptions: gameOptions.draw,
				playerBalance: this.state.playerBalance + winnings
			});
		} else {
			// Dealer wins
			this.setState({ playerOptions: gameOptions.dealerWins });
		}
	}

	render() {
		const {
			currentWager,
			playerBalance,
			playerOptions,
			playerCards,
			dealerCards,
			playerHandValue,
			dealerHandValue,
		} = this.state;

		return (
			<Box flexDirection='column' paddingX={20} borderColor="cyan" borderStyle="round">
				<Box justifyContent='center' borderStyle="classic">
					<Gradient name="rainbow">
						<BigText text='Blackjack' />
					</Gradient>
				</Box>
				<Box
					id='content'
					flexDirection='column'
					alignItems='center'
				>
					{ currentWager ? 
						<>
							<Cards cards={dealerCards} name={'Dealer'} points={dealerHandValue} />
							<Cards cards={playerCards} name={'Player'} points={playerHandValue} />
						</> :
						<Box height={14} alignItems='center'>
							<Text>Place a bet to begin the game</Text>
						</Box>
					}
				</Box>
				<PlayerControlPanel
					currentWager={currentWager}
					playerBalance={playerBalance}
					playerOptions={playerOptions}
					handlePlayerInput={this.handlePlayerInput}
				/>
			</Box>
			
		);
	}
};

module.exports = Blackjack;
