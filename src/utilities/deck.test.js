import 'jest';
import { generateDeck, shuffleDeck } from './deck';

describe('Deck Utilities', () => {
    describe('generateDeck', () => {
        it('should generate a 52-card deck', () => {
            const deck = generateDeck();
    
            expect(deck.length).toEqual(52);
        });
    
        it('should generate 13 cards for a suit', () => {
            const deck = generateDeck();
            const spades = deck.filter((card) => card.suit === 'Spades');
    
            expect(spades.length).toEqual(13);
        });
    });

    describe('shuffleDeck', () => {
        it('should return a shuffled deck with the same length', () => {
            const deck = generateDeck();
            const shuffledDeck = shuffleDeck(deck);

            expect(shuffledDeck.length).toEqual(deck.length);
        });

        // This next test is a bit cheap. In order to test the shuffle method
        // we must in essence test the underlying RNG used by JS.
        // In this case we'll run the shuffle method and assert that each card
        // being in the same position should be false.
        //
        // It's not impossible for a perfectly ordered deck to be produced by
        // a shuffle - so this test could fail arbitrarily.
        // Furthermore, this test will pass if and only if one card has swapped position
        //
        // The correct way would be to take the average of one cards position
        // over many runs and ensure an even distribution
        it('should shuffle the order of some cards', () => {
            const deck = generateDeck();
            const shuffledDeck = shuffleDeck(deck);

            const deckIsInOrder = shuffledDeck.every((card, index) =>
                deck[index].suit === card.suit && deck[index].rank === card.rank);

            expect(deckIsInOrder).toBeFalsy();
        });
    });
});
