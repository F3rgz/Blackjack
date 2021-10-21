const gameOptions = {
    menu: {
        prompt: 'What do you want to do?',
        items: [
            {
                label: 'Place bet: 10$',
                value: 'bet:10'
            },
            {
                label: 'Place bet: 20$',
                value: 'bet:20'
            },
            {
                label: 'Place bet: 50$',
                value: 'bet:50'
            },
            {
                label: 'Place bet: 100$',
                value: 'bet:100'
            },
            {
                label: 'Walk away. (Exit)',
                value: 'exit'
            },
        ]
    },
    game: {
        prompt: 'What next?',
        items: [
            {
                label: 'Hit me.',
                value: 'hit'
            },
            {
                label: 'Stay.',
                value: 'stay'
            }
        ]
    },
    dealersTurn: {
        prompt: 'Dealers turn.',
    },
    playerBust: {
        prompt: 'You\'re bust, dealer wins! What now?',
        items: [
            {
                label: 'Play again.',
                value: 'play',
            },
            {
                label: 'Leave.',
                value: 'exit',
            }
        ]
    },
    playerWins: {
        prompt: 'You won!',
        items: [
            {
                label: 'Play again.',
                value: 'play',
            },
            {
                label: 'Leave.',
                value: 'exit',
            }
        ]
    },
    dealerWins: {
        prompt: 'You lose!',
        items: [
            {
                label: 'Play again.',
                value: 'play',
            },
            {
                label: 'Leave.',
                value: 'exit',
            }
        ]
    },
    draw: {
        prompt: 'You drew! You get your wager back.',
        items: [
            {
                label: 'Play again.',
                value: 'play',
            },
            {
                label: 'Leave.',
                value: 'exit',
            }
        ]     
    }
}

module.exports = gameOptions;