import React, {Component} from 'react';
import {Feedback, Arguments} from '../../../imports/collections/data'
import {createContainer} from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class FeedbackOnFeedbackList extends Component{
    renderFeedbackOnFeedbackList(){
        return this.props.feedback.map((feedback, idx)=>{
            var comment = feedback['comment']
            if(comment.length > 7){
                comment = comment.substring(0,7)+"..."
            }
            if(feedback['userId']==this.props.userId){
                return (<li key={'argument'+idx.toString()} className="collection-item">
                A reaction on your feedback on an argument by {feedback['writeremail']}: <a href={"/feedbackonfeedback/"+feedback._id}>{feedback.comment}</a>.
                </li>)}
            }
        )
    }
    

    render(){
        if(this.props.feedback.length!=0){
            return (
                <div  style={{maxHeight: '30%'}}>
                    <h5>You received writer's reactions on your feedback!</h5>
                    <ul className="collection">
                        {this.renderFeedbackOnFeedbackList()}
                    </ul>
                </div>
            )
        }else{
            return (<div></div>)
        }
        
    }
}

export default createContainer((props)=> {
    Meteor.subscribe('feedbackonfeedback_publish')
    return {userId: Meteor.userId(), feedback:Feedback.find({}).fetch()}
}, FeedbackOnFeedbackList);