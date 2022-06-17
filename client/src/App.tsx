import { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// Components
import RedirectPage from './components/RedirectPage';
import HomePage from './components/HomePage';

type Props = {}

type State = {
    posts: String
}

export default class App extends Component<Props, State> {

    render() {
        return (
            <BrowserRouter>
                {/* <Routes> */}
                <Route path='/' element={<HomePage />} />
                <Route path='/:shortId' element={<RedirectPage />} />
                {/* </Routes> */}
            </BrowserRouter>
        )
    }
}