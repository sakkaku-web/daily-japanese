import axios from 'axios';
import { handler } from './collector-news';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('Collector News', function () {
  it('should get for country jp', async () => {
    const mockedGet = axios.get as jest.MockedFunction<typeof axios.get>;
    mockedGet.mockResolvedValue({ data: {} });

    const result = await handler(null);

    expect(mockedGet).toHaveBeenCalledWith(
      expect.stringContaining('country=jp')
    );
  });
});
