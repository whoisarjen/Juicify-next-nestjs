import { render, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { createMockRouter } from "../../test-utils/createMockRouter.test.utils";
import user from '@testing-library/user-event'
import useSettings from "./useSettings";
import Settings from ".";

let handleSubmit: any = null

const LoadSettings = () => {
    const props = useSettings()
    handleSubmit = jest.spyOn(props, 'handleSubmit')
    return (
        <Settings {...props} />
    )
}

const setup = () => {
    return render(
        <Provider store={store}>
            <RouterContext.Provider value={createMockRouter({
                locale: 'en',
                locales: ['en', 'pl']
            })}>
                <LoadSettings />
            </RouterContext.Provider>
        </Provider>
    )
}

beforeEach(() => {
    setup()
    jest.clearAllMocks();
})

describe(`Checking settings page`, () => {
    describe('Lettings default behave', () => {

        it('Expecting to load properly component', () => { })

        describe(`Expect to change component's value and fire submit`, () => {
            it('Language', () => {
                screen.getByLabelText(/language/i)
            })
            it('Number of meals', () => {
                const input = screen.getByLabelText(/number of meals/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Fiber', () => {
                const input = screen.getByLabelText(/Fiber/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Sugar', () => {
                const input = screen.getByLabelText(/Sugar/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Name', () => {
                const input = screen.getByLabelText(/Name/)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Surname', () => {
                const input = screen.getByLabelText(/Surname/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Height', () => {
                const input = screen.getByLabelText(/Height/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Description', () => {
                const input = screen.getByLabelText(/Description/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Website', () => {
                const input = screen.getByLabelText(/Website/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Facebook', () => {
                const input = screen.getByLabelText(/Facebook/i)
                user.type(input, '10')
                user.click(screen.getByRole('button', {
                    name: /submit/i
                }))
                expect(handleSubmit).toBeCalled()
            })
            it('Instagram', () => {
                const input = screen.getByLabelText(/Instagram/i)
                user.type(input, '10')
            })
            it('Twitter', () => {
                const input = screen.getByLabelText(/Twitter/i)
                user.type(input, '10')
            })
        })
    })
})

export default {};