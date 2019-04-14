import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import AccountMain from '../auth/account_main';
import {Meteor} from 'meteor/meteor'

class NavBar extends Component{
    new_argument(){
        console.log('argument')
        Meteor.call('arguments.newargument', (err, res)=>{
            window.location='/write/'+res
        })
    }


    render(){
        return (<nav className="stickyNav">
            <div className="nav-wrapper">
                <a href="/" className="brand-logo left" style={{paddingLeft:'10px'}}>Other's Pen</a>
                <ul className="right">
                    <li><a className="btn" href="#" onClick={this.new_argument.bind(this)}>
                        Write new argument
                    </a></li>
                    <li><AccountMain></AccountMain></li>
                </ul>

            </div>
            </nav>)
    }
}

export default createContainer((props) => {
    
    return {userId: Meteor.userId()}
}, NavBar); 