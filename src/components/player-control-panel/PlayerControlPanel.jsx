import React from 'react';
import SelectInput from 'ink-select-input';
import { Box, Text } from 'ink';

const PlayerControlPanel = ({ currentWager, playerBalance, playerOptions, handlePlayerInput }) => {
    return (
        <Box flexDirection='column' justifyContent="center" borderStyle="classic">
            <Box marginBottom={1} justifyContent="center">
                <Text marginRight={2}>Your balance: <Text color='green'>${playerBalance ? playerBalance : '0'} </Text></Text>
                <Text>Wager: <Text color="cyan">${currentWager}</Text></Text>
            </Box>
            {playerOptions ? (
                <Box flexDirection='column' alignItems="center">
                    <Text>{playerOptions.prompt}</Text>
                    <SelectInput items={playerOptions.items} onSelect={(value) => handlePlayerInput(value)} />
                </Box>) : null
            }
        </Box>);
}

module.exports = PlayerControlPanel;