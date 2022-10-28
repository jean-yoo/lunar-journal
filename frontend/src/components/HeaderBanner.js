import { Menu, Checkbox } from 'semantic-ui-react'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

const mapDispatchToProps = dispatch => bindActionCreators({
    selectedMenuItem: (item) => push(item)
}, dispatch)

const items = [
    { to: '/', name: 'home', content: 'Home'},
    { to: '/data', name: 'data', content: 'Data'},
    { to: '/journal', name: 'journal', content: 'Journal'},
    { to: '/insights', name: 'insights', content: 'Insights'},
]

class HeaderBanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'home',
        }
    }
    
    componentDidMount() {
        this.setState({
        })
    }

    handleMenuItemClick = (e, { name, to }) => {
        this.props.selectedMenuItem(to)
        this.setState({ activeItem: name })
    }

    render() {
        var currentLink = this.props.path
        let menuItems = items.map((item) => {
            let active = currentLink === item.to
            return <Menu.Item {...item} active={active} key={item.name} onClick={this.handleMenuItemClick} />
        })
        return (
            <Menu secondary pointing borderless size='huge' id='banner'>
                {menuItems}
            </Menu>
        );
    }
}

export default connect(
    null,
    mapDispatchToProps
)(HeaderBanner)
