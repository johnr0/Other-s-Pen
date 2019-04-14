import React, {Component} from 'react';
import { Arguments } from '../../../imports/collections/data';
import { createContainer } from 'meteor/react-meteor-data';

class ArgumentList extends Component{
    state={
        displayed_user_emails:[]
    }
    renderArgumentList(){
        return this.props.arguments.map((argument, idx)=>{
            if(argument['userId']!=this.props.userId){
                //console.log(this.props.pub_users.find({userId: argument['userId']}))
                    return (<li key={'argument'+idx.toString()} className="collection-item">
                    An argument on <a href={"/read/"+argument._id}>{argument.topic}</a> by {argument['email']}
                    </li>)
                
            }  
        })
    }

    render(){
        console.log(this.props.pub_users)
        return (<div>
            <h5>These arguments require your feedback!</h5>
            <ul className="collection">
                {this.renderArgumentList()}
            </ul>
        </div>)
    }
}
export default createContainer((props) => {
    Meteor.subscribe('published_arguments')
    return {userId: Meteor.userId(), arguments:Arguments.find({}).fetch()}
}, ArgumentList); 