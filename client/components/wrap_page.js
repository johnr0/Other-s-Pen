import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import AccountMain from './auth/account_main';
import NavBar from './navbar/navbar';
import IntroPage from './intro/intro_page'
import ArgumentList from './intro/argument_list'
import OwnArgumentList from './intro/own_argument_list'
import FeedbackOnFeedbackList from './intro/feedback_on_feedback_list'

class WrapPage extends Component{
    render(){
        if(this.props.userId){
            return (<div>
                <NavBar></NavBar>
                <div  style={{'paddingTop':'60px'}} className="container row">
                    <div className="row" style={{'textAlign':'center'}}>
                        <h4>Welcome to Other's Pen,</h4>
                        <h5>The argument writing learning platform</h5>
                        <h5>where you can effectively learn how to listen to, discuss with, and persuade others</h5>
                        <p>To write a new argument, press WRITE NEW ARGUMENT button.</p>
                        <p>You can also give feedback to other people's arguments, and reflect on your feedback!</p>
                    </div>
                    <div className="row">
                        <div className="col s6">
                            <ArgumentList></ArgumentList>
                        </div>
                        <div className="col s6">
                            <OwnArgumentList></OwnArgumentList>
                            <FeedbackOnFeedbackList></FeedbackOnFeedbackList>
                        </div>
                    </div>
                </div>
                
            </div>)
        }else{
            return (<div>
                <IntroPage/>
            </div>)
        }
    }
}

export default createContainer((props) => {
    
    return {userId: Meteor.userId()}
}, WrapPage); 