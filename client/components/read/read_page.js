import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import NavBar from '../navbar/navbar';
import TextRead from './text_read'
import { Arguments,Feedback} from '../../../imports/collections/data';

class ReadPage extends Component{
    render(){
        if(this.props.userId){
            if(this.props.argument[0]){
                if(this.props.argument[0]['published']){
                    return (<div>
                        <NavBar></NavBar>
                        <div id="wholeinterface" className="row" style={{'paddingTop': '60px'}}>
                            <TextRead argument={this.props.argument[0]} feedback={this.props.feedback}
                            userId={this.props.userId}></TextRead>
                        </div>
                        
                    </div>)
                }else{
                    return (<div>
                        <NavBar></NavBar>
                        <h5>Sorry, this page is not accessible.</h5>
                    </div>)
                }
                
            }else{
                return (<div></div>)
            }
        }else{
            return (<div>
                <IntroPage/>
            </div>)
        }
    }
}

export default createContainer((props) => {
    var textid = props.match.params.textid
    Meteor.subscribe('reader_publish_argument', textid)
    Meteor.subscribe('reader_publish_comment', textid)
    return {userId: Meteor.userId(), argument: Arguments.find().fetch(), feedback: Feedback.find().fetch(),}
}, ReadPage); 