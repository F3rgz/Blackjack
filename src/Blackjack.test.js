import React from 'react';
import { shallow } from 'enzyme';
import Blackjack from './Blackjack';
import { render } from 'ink-testing-library';
import playerOptions from './player-options';
import { generateDeck, shuffleDeck } from './utilities/deck';

describe('<Blackjack />', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<Blackjack />);
        instance = wrapper.instance();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('should successfully instantiate', () => {

        it('renders', () => {
            expect(wrapper.exists()).toBeTruthy();
        });

        it('should have the correct state', () => {
            expect(instance.state["currentWager"]).toEqual(0);
            expect(instance.state["dealerCards"]).toEqual([]);
            expect(instance.state["dealerHandValue"]).toEqual(0);
            expect(instance.state["deck"].length).toEqual(52);
            expect(instance.state["playerBalance"]).toEqual(500);
            expect(instance.state["playerCards"].length).toEqual(0);
            expect(instance.state["playerHandValue"]).toEqual(0);
            expect(instance.state["playerOptions"]["items"].length).toBeGreaterThan(0);
        });
    });

    describe('handlePlayerInput()', () => {

        it('should call process.exit() if the user selects exit', () => {
            const spy = jest.spyOn(process, 'exit').mockImplementationOnce(jest.fn());
            instance.handlePlayerInput({ value: 'exit' });

            expect(spy).toHaveBeenCalled();
        });

        it('should place a bet when inputted "bet" with a Number value', () => {
            const placeBetSpy = jest.spyOn(instance, 'placePlayerBet')
                .mockImplementation(jest.fn());
            instance.handlePlayerInput({ value: 'bet:25' });

            expect(placeBetSpy).toHaveBeenCalledWith(25);
        });

        it('should not place a bet when inputted "bet" with a non-Number value', () => {
            const placeBetSpy = jest.spyOn(instance, 'placePlayerBet')
                .mockImplementation(jest.fn());
            instance.handlePlayerInput({ value: 'bet:test' });

            expect(placeBetSpy).not.toHaveBeenCalled();
        });

        it('should call "dealPlayerCard()" when called with "hit"', () => {
            const dealCardSpy = jest.spyOn(instance, 'dealPlayerCard')
                .mockImplementation(jest.fn());
            instance.handlePlayerInput({ value: 'hit' });

            expect(dealCardSpy).toHaveBeenCalled();
        });

        it('should call "dealersTurn()" when inputted "stay"', () => {
            const dealersTurnSpy = jest.spyOn(instance, 'dealersTurn')
                .mockImplementation(jest.fn());
            instance.handlePlayerInput({ value: 'stay' });

            expect(dealersTurnSpy).toHaveBeenCalled();
        });

        it('should call generateNewDeck() when inputted "play"', () => {
            const generateNewDeckSpy = jest.spyOn(instance, 'generateNewDeck')
                .mockImplementation(jest.fn());
            instance.handlePlayerInput({ value: 'play' });

            expect(generateNewDeckSpy).toHaveBeenCalled();
        });

        it('should reset the game state when inputted "play"', () => {
            jest.spyOn(instance, 'generateNewDeck')
                .mockImplementation(jest.fn());
            instance.setState({
                playerCards: [{ suit: 'Spades', rank: 'King'}],
                dealerCards: [{ suit: 'Spades', rank: 'Queen'}],
                currentWager: 500,
                playerOptions: null
            });
            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.handlePlayerInput({ value: 'play' });
            expect(setStateSpy).toHaveBeenCalledWith({
				playerCards: [],
				dealerCards: [],
				currentWager: 0,
				playerOptions: playerOptions.menu
            });
        });
    });

    describe('dealPlayerCard()', () => {

        it('should remove a card from the deck and set it to the playerCards array', () => {
            jest.spyOn(instance, 'playerIsBust')
                .mockImplementationOnce(jest.fn(() => true));
            instance.setState({
                deck: [{ suit: 'Clubs', rank: 'Jack' }, { suit: 'Clubs', rank: '10' }]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.dealPlayerCard();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerCards: [{ suit: 'Clubs', rank: 'Jack' }],
                deck: [{ suit: 'Clubs', rank: '10' }]
            });
        });

        it('should append the next card to the players hand if the player already has cards', () => {
            jest.spyOn(instance, 'playerIsBust')
                .mockImplementationOnce(jest.fn(() => true));
            instance.setState({
                deck: [{ suit: 'Clubs', rank: 'Jack' }, { suit: 'Clubs', rank: '10' }],
                playerCards: [{ suit: 'Diamonds', rank: '10' }],
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.dealPlayerCard();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerCards: [{ suit: 'Diamonds', rank: '10' }, { suit: 'Clubs', rank: 'Jack' }],
                deck: [{ suit: 'Clubs', rank: '10' }]
            });
        });

        it('if the deck is empty it should send players back to the menu', () => {
            jest.spyOn(instance, 'playerIsBust')
                .mockImplementationOnce(jest.fn(() => true));
            instance.setState({
                deck: [],
                playerCards: [],
            });

            const setStateSpy = jest.spyOn(instance, 'setState');
            const handlePlayerInputSpy = jest.spyOn(instance, 'handlePlayerInput')
                .mockImplementationOnce(jest.fn());

            instance.dealPlayerCard();

            expect(setStateSpy).not.toHaveBeenCalled();
            expect(handlePlayerInputSpy).toHaveBeenCalledWith({ value: 'play' })
        });

        it('should call the playerIsBust method with the correct playerCards value', () => {
            const playerIsBustSpy = jest.spyOn(instance, 'playerIsBust')
                .mockImplementationOnce(jest.fn(() => true));
            instance.setState({
                playerCards: [{ suit: 'Clubs', rank: 'Jack' }],
                deck: [{ suit: 'Clubs', rank: '10' }]
            });

            instance.dealPlayerCard();

            expect(playerIsBustSpy).toHaveBeenCalledWith([
                { suit: 'Clubs', rank: 'Jack' },
                { suit: 'Clubs', rank: '10' }
            ]);
        });
    });

    describe('dealDealerCards()', () => {
        it('should pop the first card from the deck and add it to the empty dealerCards', () => {
            instance.setState({
                deck: [
                    { suit: 'Clubs', rank: 'Jack', faceDown: false },
                    { suit: 'Clubs', rank: '10', faceDown: false }
                ],
            });
            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.dealDealerCard(false);

            expect(setStateSpy).toHaveBeenCalledWith({
                deck: [{ suit: 'Clubs', rank: '10', faceDown: false }],
                dealerCards: [{ suit: 'Clubs', rank: 'Jack', faceDown: false }]
            });
        });

        it('should pop the first card from the deck and append it to the dealerCards', () =>{
            instance.setState({
                deck: [
                    { suit: 'Clubs', rank: 'Jack', faceDown: false },
                    { suit: 'Clubs', rank: '10', faceDown: false }
                ],
                dealerCards: [
                    { suit: 'Clubs', rank: '9', faceDown: false }
                ]
            });
            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.dealDealerCard(false);

            expect(setStateSpy).toHaveBeenCalledWith({
                deck: [{ suit: 'Clubs', rank: '10', faceDown: false }],
                dealerCards: [
                    { suit: 'Clubs', rank: '9', faceDown: false },
                    { suit: 'Clubs', rank: 'Jack', faceDown: false }
                ]
            });
        });
    });

    describe('playerIsBust()', () => {
        it('should return false if an empty array is provided', () => {
            expect(instance.playerIsBust([])).toBe(false);
        });

        it('should return false if the total value of the cards is less than 21', () => {
            const result = instance.playerIsBust([
                { suit: 'Clubs', rank: 'Jack', faceDown: false },
                { suit: 'Clubs', rank: 'Queen', faceDown: false }
            ])
            expect(result).toBe(false);
        });

        it('should return true if the total value of the cards is greater than 21', () => {
            const result = instance.playerIsBust([
                { suit: 'Clubs', rank: 'Jack', faceDown: false },
                { suit: 'Clubs', rank: 'Queen', faceDown: false },
                { suit: 'Clubs', rank: 'King', faceDown: false }
            ])
            expect(result).toBe(true);
        });

        it('should set the playerHandValue to the computed value', () => {
            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.playerIsBust([
                { suit: 'Clubs', rank: 'Jack', faceDown: false },
                { suit: 'Clubs', rank: 'Queen', faceDown: false }
            ])

            expect(setStateSpy).toHaveBeenCalledWith({ playerHandValue: 20 });
        });
    });

    describe('dealersTurn()', () => {
        it('should set the player options to "dealersTurn"', () => {
            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.dealersTurn();

            expect(setStateSpy).toHaveBeenCalledWith({ playerOptions: playerOptions.dealersTurn });
        });

        it('should turn over all the dealers cards', () => {
            instance.setState({ dealerCards: [
                    { suit: 'Clubs', rank: '9', faceDown: true },
                    { suit: 'Clubs', rank: '10', faceDown: true }
            ]});
            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.dealersTurn();

            expect(setStateSpy.mock.calls[1][0]).toEqual({ dealerCards: [
                { suit: 'Clubs', rank: '9', faceDown: false },
                { suit: 'Clubs', rank: '10', faceDown: false }
            ]});
        });

        it('should call "dealDealerCard" if the calculated value is less than 17', () => {
            jest.spyOn(instance, 'calculateValue').mockImplementationOnce(jest.fn(() => 15));
            const dealDealerCardSpy = jest.spyOn(instance, 'dealDealerCard');

            instance.dealersTurn();

            expect(dealDealerCardSpy).toHaveBeenCalled();
        });

        it('should call "dealersTurn" if the calculated value is less than 17', () => {
            const dealersTurnSpy = jest.spyOn(instance, 'dealersTurn');

            // Set dealers cards to value 16, so any card will push to 17+
            instance.setState({ dealerCards: [
                { suit: 'Clubs', rank: '6', faceDown: false },
                { suit: 'Clubs', rank: '10', faceDown: false },
            ]});

            instance.dealersTurn();

            expect(dealersTurnSpy.mock.calls.length).toBe(2);
        });

        it('should call "awardWinner" if the calculated value is greater than 16', () => {
            jest.spyOn(instance, 'calculateValue').mockImplementationOnce(jest.fn(() => 17));
            const awardWinnerSpy = jest.spyOn(instance, 'awardWinner');

            instance.dealersTurn();

            expect(awardWinnerSpy).toHaveBeenCalled();
        });
    });

    describe('awardWinner()', () => {
        it('should award the player 1.5*wager if dealer is bust and playerValue < 21', () => {
            instance.setState(
                {
                    playerBalance: 0,
                    currentWager: 10,
                    dealerCards: [ // 30
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                        { suit: 'Hearts', rank: '10', faceDown: false },
                    ],
                    playerCards: [ // 20
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.awardWinner();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerOptions: playerOptions.playerWins,
                playerBalance: 15
            });
        });

        it('should award the player 2*wager if dealer is bust and playerValue is 21', () => {
            instance.setState(
                {
                    playerBalance: 0,
                    currentWager: 10,
                    dealerCards: [ // 30
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                        { suit: 'Hearts', rank: '10', faceDown: false },
                    ],
                    playerCards: [ // 20
                        { suit: 'Diamonds', rank: 'Ace', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.awardWinner();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerOptions: playerOptions.playerWins,
                playerBalance: 20
            });
        });

        it('should award the player 1.5*wager if the player has a higher value less than 21', () => {
            instance.setState(
                {
                    playerBalance: 0,
                    currentWager: 10,
                    dealerCards: [ // 30
                        { suit: 'Diamonds', rank: '9', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ],
                    playerCards: [ // 20
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.awardWinner();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerOptions: playerOptions.playerWins,
                playerBalance: 15
            });
        });

        it('should award the player 2*wager if the player has a higher value worth 21', () => {
            instance.setState(
                {
                    playerBalance: 0,
                    currentWager: 10,
                    dealerCards: [ // 30
                        { suit: 'Diamonds', rank: '9', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ],
                    playerCards: [ // 20
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: 'Ace', faceDown: false },
                    ]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.awardWinner();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerOptions: playerOptions.playerWins,
                playerBalance: 20
            });
        });

        it('should refund the player if the player and dealer draw', () => {
            instance.setState(
                {
                    playerBalance: 0,
                    currentWager: 10,
                    dealerCards: [ // 30
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ],
                    playerCards: [ // 20
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.awardWinner();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerOptions: playerOptions.draw,
                playerBalance: 10
            });
        });

        it('should set the the playerOptions to draw if the dealer wins', () => {
            instance.setState(
                {
                    playerBalance: 0,
                    currentWager: 10,
                    dealerCards: [ // 30
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: 'Ace', faceDown: false },
                    ],
                    playerCards: [ // 20
                        { suit: 'Diamonds', rank: '10', faceDown: false },
                        { suit: 'Clubs', rank: '10', faceDown: false },
                    ]
            });

            const setStateSpy = jest.spyOn(instance, 'setState');

            instance.awardWinner();

            expect(setStateSpy).toHaveBeenCalledWith({
                playerOptions: playerOptions.dealerWins,
            });
        });
    });

    describe('calculateValue()', () => {
        it('should score all picture cards as 10', () => {
            const pictureCards = [ // value 30
                { suit: 'Diamonds', rank: 'Jack', faceDown: false },
                { suit: 'Diamonds', rank: 'Queen', faceDown: false },
                { suit: 'Diamonds', rank: 'King', faceDown: false },
            ]

            expect(instance.calculateValue(pictureCards)).toEqual(30);
        });

        it('should score all non-ace numeric cards as their numeric value', () => {
            const pictureCards = [ // value 54
                { suit: 'Diamonds', rank: '2', faceDown: false },
                { suit: 'Diamonds', rank: '3', faceDown: false },
                { suit: 'Diamonds', rank: '4', faceDown: false },
                { suit: 'Diamonds', rank: '5', faceDown: false },
                { suit: 'Diamonds', rank: '6', faceDown: false },
                { suit: 'Diamonds', rank: '7', faceDown: false },
                { suit: 'Diamonds', rank: '8', faceDown: false },
                { suit: 'Diamonds', rank: '9', faceDown: false },
                { suit: 'Diamonds', rank: '10', faceDown: false },
            ]

            expect(instance.calculateValue(pictureCards)).toEqual(54);
        });

        it('should score an ace only as 11 iff the the total will remain below 22', () => {
            const cards = [ // 21
                { suit: 'Diamonds', rank: 'Jack', faceDown: false },
                { suit: 'Diamonds', rank: '10', faceDown: false },
                { suit: 'Diamonds', rank: 'Ace', faceDown: false },
            ];

            expect(instance.calculateValue(cards)).toEqual(21);
        });

        it('should only score one Ace as 11', () => {
            const cards = [ // 21
                { suit: 'Diamonds', rank: 'Ace', faceDown: false },
                { suit: 'Diamonds', rank: '9', faceDown: false },
                { suit: 'Diamonds', rank: 'Ace', faceDown: false },
            ];

            expect(instance.calculateValue(cards)).toEqual(21);
        });

        it('should score all Aces as 1 if it would otherwise force the hand over 21', () => {
            const cards = [ // 21
                { suit: 'Diamonds', rank: 'King', faceDown: false },
                { suit: 'Diamonds', rank: 'Ace', faceDown: false },
                { suit: 'Diamonds', rank: '9', faceDown: false },
                { suit: 'Diamonds', rank: 'Ace', faceDown: false },
            ];

            expect(instance.calculateValue(cards)).toEqual(21);
        });

        it('should return 0 if no cards are submitted', () => {
            expect(instance.calculateValue([])).toEqual(0);
        })
    });
});

const shuffledDeck = shuffleDeck(generateDeck());
