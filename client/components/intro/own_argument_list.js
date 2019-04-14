import React, {Component} from 'react';
import { Arguments } from '../../../imports/collections/data';
import { createContainer } from 'meteor/react-meteor-data';

class OwnArgumentList extends Component{
    renderOwnArgumentList(){
        return this.props.own_arguments.map((argument, idx)=>{
            if(argument['userId']==this.props.userId){
                if(argument.topic!=undefined){
                    return (<li key={'argument'+idx.toString()} className="collection-item">
                    An argument on <a href={"/write/"+argument._id}>{argument.topic}</a>.
                    ({(argument['published'])? 'Published':'Not published'})
                    </li>)
                }else{
                    return (<li key={'argument'+idx.toString()} className="collection-item">
                    An argument <a href={"/write/"+argument._id}>without a topic</a>.
                    ({(argument['published'])? 'Published':'Not published'})
                    </li>)
                }
                
            }
        })
    }

    render(){
        if(this.props.own_arguments.length!=0){
            return (<div style={{maxHeight: '30%'}}>
                <h5>Below is your own arguments.</h5>
                <ul className="collection">
                    {this.renderOwnArgumentList()}
                </ul>
                </div>)
        }else{
            return (<div></div>)
        }
        
    }
}
export default createContainer((props) => {
    Meteor.subscribe('own_arguments')
    return {userId: Meteor.userId(), own_arguments:Arguments.find({}).fetch()}
}, OwnArgumentList); 