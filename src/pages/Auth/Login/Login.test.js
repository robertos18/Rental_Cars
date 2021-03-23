import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import axios from '../../../axios-auth';

jest.mock('axios', () => {
    return {
        create: () => {
            return {
                post: jest.fn(() => Promise.resolve(''))
            }
        }
    }
})

test('renders Logowanie', () => {
    render(<Login />);
    expect(screen.getByText(/logowanie/i)).toBeInTheDocument();

})

test('changes email value', () => {
    const utils = render(<Login />)
    const emailInput = utils.getByLabelText('Email')

    fireEvent.change(emailInput, { target: { value: 'adam' } });
    expect(emailInput.value).toBe('adam')
})

test('show error on fail login', async () => {
    axios.post.mockImplementation(() =>
        Promise.reject({ response: { data: { error: { message: 'EMAIL_NOT_FOUND' } } } })
    );
    const utils = render(<Login />)
    const submitButton = utils.getByText('Zaloguj');

    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(screen.getByText('EMAIL_NOT_FOUND')).toBeInTheDocument();
});