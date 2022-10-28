import React, { Component } from 'react';
import HeaderBanner from './components/HeaderBanner'
import Routes from './routes'
import './App.css';

import BubbleParticles from './components/Particles';

import { connect } from 'react-redux'

var colors = ['#5f49cf', '#66cc91', '#139e80', '#50a6b1', '#f293d7', '#c56aab']

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { history } = this.props
        const path = history.location.pathname
        return (
            <main className='App'>
                <HeaderBanner path={path} />
                <BubbleParticles color={colors[Math.floor(Math.random() * colors.length)]} />
                <BubbleParticles color={colors[Math.floor(Math.random() * colors.length)]} />
                <Routes history={history} />
            </main>
        );
    }
}

export default App
