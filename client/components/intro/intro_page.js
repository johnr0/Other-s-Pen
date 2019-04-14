import React, {Component} from 'react';
import AccountMain from '../auth/account_main';

class IntroPage extends Component{
    render(){;
        return (<div style={{'textAlign':'center'}}>
            <h2>Welcome to Other's Pen,</h2>
            <h3>The argumentative writing learning platform</h3>
            <h3>where you can effectively learn how to listen to, discuss with, and persuade others</h3>
            <h4>In order to start Other's Pen, please sign in!</h4>
            <AccountMain></AccountMain>
        </div>)
    }
}

export default IntroPage;