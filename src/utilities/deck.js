const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

const utilities = {
    /**
     * Creates an an array of cards
     * @returns {Object[]}
     */
    generateDeck: () => {
        let cards = [];
        suits.forEach((suit) => {
            ranks.forEach((rank) => {
                cards.push({
                    suit,
                    rank,
                    faceDown: false,
                });
            });
        });

        return cards;
    },

    /**
     * Shuffles the deck of cards using a Fisher-Yates shuffle.
     * The original array is not modified.
     * @param {Object[]} deck - The deck of cards to be shuffled
     * @returns {Object[]} - a new array of cards
     */
    shuffleDeck: (deck) => {
        const shuffleDeck = deck.map(card => ({ ...card })); // Make a deep copy
        for (let index = shuffleDeck.length -1; index > 0, index--;) {
            let randomPosition = Math.floor(Math.random() * index);
            let temp = shuffleDeck[index];

            shuffleDeck[index] = shuffleDeck[randomPosition];
            shuffleDeck[randomPosition] = temp;
        }

        return shuffleDeck;
    }
}

module.exports = utilities;