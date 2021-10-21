import React from 'react';
import { shallow } from 'enzyme';
import PlayerControlPanel from './PlayerControlPanel';
import { render } from 'ink-testing-library';
import keys from 'unicode-keymap';
import gameOptions from '../player-options';

describe('<PlayerControlPanel />', () => {
    describe('renders text and options correctly', () => {
        it('mounts', () => {
            const wrapper = shallow(<PlayerControlPanel
                                        currentWager={0}
                                        playerBalance={0}
                                        playerOptions={null}
                                        handlePlayerInput={() => {}}
                                    />);

            expect(wrapper.exists()).toBeTruthy();
        });

        it('should display player balance', () => {
            const { lastFrame } = render(<PlayerControlPanel
                                            currentWager={10}
                                            playerBalance={500}
                                            playerOptions={mockGameOption}
                                            handlePlayerInput={() => {}}
                                        />);
            expect(lastFrame()).toEqual(expect.stringContaining("$500"));
        });

        it('should display player wager', () => {
            const { lastFrame } = render(<PlayerControlPanel
                                            currentWager={10}
                                            playerBalance={500}
                                            playerOptions={mockGameOption}
                                            handlePlayerInput={() => {}}
                                        />);
            expect(lastFrame()).toEqual(expect.stringContaining("$10"));
        });

        it('should display player prompt', () => {
            const { lastFrame } = render(<PlayerControlPanel
                                            currentWager={10}
                                            playerBalance={500}
                                            playerOptions={mockGameOption}
                                            handlePlayerInput={() => {}}
                                        />);
            expect(lastFrame()).toEqual(expect.stringContaining("Test Option 1"));
        });

        it('should display player prompt options', () => {
            const { lastFrame } = render(<PlayerControlPanel
                                            currentWager={10}
                                            playerBalance={500}
                                            playerOptions={mockGameOption}
                                            handlePlayerInput={() => {}}
                                        />);
            expect(lastFrame()).toEqual(expect.stringContaining("Test Option 2"));
        });
    });

    // describe('handles user input correctly', () => {
    //     it('should call handlePlayerInput when enter is selected', () => {
    //         const mockHandlePlayerInput = jest.fn();
    //         const { stdin } = render(<PlayerControlPanel
    //                                     currentWager={10}
    //                                     playerBalance={500}
    //                                     playerOptions={mockGameOption}
    //                                     handlePlayerInput={mockHandlePlayerInput}
    //                                 />);
    //         stdin.write(keys.RETURN);
    //         expect(mockHandlePlayerInput).toHaveBeenCalled();
    //     });
    // });
});

const mockGameOption = {
    prompt: 'Prompt',
    items: [
        {
            label: 'Test Option 1',
            value: 'play',
        },
        {
            label: 'Test Option 2',
            value: 'play2',
        }
    ]
}