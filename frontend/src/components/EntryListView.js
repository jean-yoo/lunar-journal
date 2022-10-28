import React, { Component } from 'react'
import { Header, Image, Label, Card, Popup, Icon, Button, Segment, Grid, Divider, Container } from 'semantic-ui-react'
import { NavHashLink as NavLink } from 'react-router-hash-link';

import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapDispatchToProps = dispatch => bindActionCreators({
    menuClicked: (to) => {
        return push('/' + to)
    }
}, dispatch)

var cardColors = ['orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink', 'grey']

function generateColor() {
    if (cardColors.length == 0) {
        cardColors = ['orange', 'yellow', 'olive', 'teal', 'blue', 'violet', 'purple', 'pink', 'grey']
    }
    const color = cardColors[Math.floor(Math.random() * cardColors.length)];
    cardColors.splice(cardColors.indexOf(color), 1)
    return color
}

const dateCards = [
    {
        header: '9/11/18',
        to: '/journal/9/14',
        action: 'View',
        text: '',
    },
    {
        header: '9/12/18',
        to: '/journal/0',
        action: 'View',
        text: '',
    },
    {
        header: '9/13/18',
        to: '/journal/0',
        action: 'View',
        text: '',
    },
    {
        header: '9/14/18',
        to: '/journal/9/14',
        action: 'View',
        text: '',
    },
    {
        header: '9/15/18',
        to: '/journal/0',
        action: 'View',
        text: '',
    },
    {
        header: '9/16/18',
        to: '/journal/0',
        action: 'View',
        text: '',
    },
]

function mapItemsToCards(item, index) {
    const { header, text, action, link, to, shouldScroll } = item
    var as = to == null ? 'a' : NavLink
    
    return (
        <Card
            as={as}
            href={link}
            smooth
            to={to}
            raised
            color={generateColor()}
            style={{height: '15rem'}}
            extra={<div><Button fluid content={action} /></div>}
            key={item + index}
            description={<Card.Description textAlign='center' content={text} />}
            header={<Header textAlign='center'>{header}<Divider /></Header>}
        />
    );
}

class EntryListView extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { isMobile } = this.state

        return (
            <div>
                <Segment className='day-segment'>
                    <Card.Group itemsPerRow='3'>
                        {dateCards.map(mapItemsToCards)}
                    </Card.Group>
                </Segment>
            </div>
        );
    }
}

export default EntryListView