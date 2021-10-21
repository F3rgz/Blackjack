import React from 'react';
import { Box, Text } from 'ink';

const Cards = ({ cards, name, points }) => {
    return (<Box flexDirection='column'>
        <Text color='green'>{name} {points ? `(${points})` : ''}</Text>
            <Box>
            {cards.map((card) => (
                <Box
                    key={`${card.suit}-${card.rank}`}
                    width={12}
                    height={10}
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    borderStyle='round'
                    borderColor='#d63031'
                >
                    { card.faceDown
                        ? <Text color='red'>X</Text>
                        : (<>
                            <Text>{card.rank}</Text>
                            <Text>of</Text>
                            <Text>{card.suit}</Text>
                        </>)}
                </Box>
            ))}
        </Box>
    </Box>)
};

module.exports = Cards;