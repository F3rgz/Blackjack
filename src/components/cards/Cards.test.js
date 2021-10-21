
import React from 'react';
import { shallow } from 'enzyme';
import Cards from './Cards';
import { render } from 'ink-testing-library';

describe('<Cards />', () => {
    it('renders', () => {
        const wrapper = shallow(<Cards cards={[]} name="Player" points='21' />);

        expect(wrapper.exists()).toBeTruthy();
    });

    it('should render a card correctly', () => {
        const { lastFrame } = render(<Cards cards={basicCards} name="Player" points='21' />);

        expect(lastFrame()).toEqual(expect.stringContaining("Player"));
        expect(lastFrame()).toEqual(expect.stringContaining("21"));
        expect(lastFrame()).toEqual(expect.stringContaining("Spades"));
        expect(lastFrame()).toEqual(expect.stringContaining("King"));
    });
});

const basicCards = [
    {
        faceDown: false,
        suit: 'Spades',
        rank: 'King'
    }
]
