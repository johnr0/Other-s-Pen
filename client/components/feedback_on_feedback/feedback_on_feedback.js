import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import NavBar from '../navbar/navbar';
import {Feedback} from '../../../imports/collections/data';
import { Meteor } from 'meteor/meteor';
import FeedbackReflection from './feedback_reflection';

class FeedbackOnFeedback extends Component{
    render(){
        if(this.props.userId){
            if(this.props.feedback){
                if(this.props.userId == this.props.feedback['userId']){
                    return (<div>
                        <NavBar></NavBar>
                        <FeedbackReflection feedback={this.props.feedback}
                        ></FeedbackReflection>
                    </div>)
                }else{
                    return (<div></div>)
                }
            }else{
                return (<div></div>)
            }
        }else{
            return (<div></div>) 
        }
    }
}

export default createContainer((props) => {
    var feedbackid = props.match.params.feedbackid
    Meteor.subscribe('feedbackonfeedback_reflection', feedbackid)
    return {userId: Meteor.userId(), feedback:Feedback.find().fetch()[0]}
}, FeedbackOnFeedback)