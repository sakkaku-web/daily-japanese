import { render } from '@testing-library/react';

import ComponentsJapaneseWordle from './components-japanese-wordle';

describe('ComponentsJapaneseWordle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ComponentsJapaneseWordle />);
    expect(baseElement).toBeTruthy();
  });
});
