import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import NavBar from '../navbar/navbar';
import IntroPage from '../intro/intro_page'
import TextInput from './text_input'
import ReflectionAndComment from './reflection_and_comment'
import { Arguments, ArgumentEstimations, Feedback } from '../../../imports/collections/data';

class WritePage extends Component{
    //argument="Write your an interesting argument here. Write your an interesting argument here. Write your an interesting argument here. Write your an interesting argument here.Let's see whether we can write over two lines. It would be an interesting experience."
    /*comments= [
        {
            ontextposition: 0,
            ontext: 'Write your an interesting argument here.',
            comment: 'comment 1 and comment is so short',
            resolved: false,
        },
        {
            ontextposition: 41,
            ontext: 'Write your an interesting argument here.',
            comment: 'comment2 and this should be longer one dued comment2 and this should be longer one dued comment2 and this should be longer one dued comment2 and this should be longer one dued',
            resolved: false,
        }
    ]*/
    feedback=[
        /*{
            ontextposition: 0,
            ontext: 'this',
            comment: 'comment2 and this should be longer one dued comment2 and this should be longer one dued comment2 and this should be longer one dued comment2 and this should be longer one dued',
            resolved: false,
        }*/
    ]

    state = {
        focused_comment: -1,
        published: false,

    }

    focus_comment(idx){
        this.setState({focused_comment:idx})
    }

    updateText(text){
        // function that update text when there is an input
        Meteor.call('arguments.updatetext', this.props.match.params.textid, text)
    }

    publish_argument(){
        console.log(this.props.argument[0]['published'])
        if(this.props.argument[0].topic==undefined || this.props.argument[0].topic==''){
            if(!this.props.argument[0]['published']){
                alert("Please fill in the topic first!")
                document.getElementById("publish_switch").checked = false;
            }
            return
        }
        if(!this.props.argument[0]['published']){
            if (this.props.argument_estimation.length==0){
                alert("It is your first time publishing your argumentation to public! If you can estimate what kinds of feedback people would give to you, you would better iterate on your writing. Let's try this!")
                this.estimation_begin()
                document.getElementById("publish_switch").checked = false;
            }else{
                if(confirm("Do you want to make the estimation on people's feedback again?")){
                    this.estimation_begin()
                    document.getElementById("publish_switch").checked = false;
                }else{
                    this.updatePublish();
                }
            }
            //this.updatePublish();
        }else{
            // update publish
            this.updatePublish();
        }
        
        
        
    }

    updatePublish(){
        Meteor.call('arguments.updatepublish', this.props.match.params.textid)
    }


    estimation_begin(){
        Meteor.call('arguments.beginprediction', this.props.match.params.textid)
    }

    render(){
        console.log(this.props.feedback)
        if(this.props.userId){
            console.log(this.props.argument)
            if(this.props.argument[0]){
                console.log(this.props.argument[0].publish)
                if(this.props.argument[0]['userId']==this.props.userId){
                    return (<div>
                        <NavBar></NavBar>
                        <div className="row" style={{'paddingTop': '70px'}}>
                            <TextInput textid={this.props.match.params.textid}
                            publish_argument={this.publish_argument.bind(this)} 
                            published={this.props.argument[0]['published']} prediction={this.props.argument[0]['prediction']}
                            topic={this.props.argument[0]['topic']} argument={this.props.argument[0]['argument']} 
                            feedback={this.props.feedback} focus_comment={this.focus_comment.bind(this)} 
                            focused_comment={this.state.focused_comment} updateText={this.updateText.bind(this)}></TextInput>
                            <ReflectionAndComment published={this.props.argument[0].published} argument_estimation={this.props.argument_estimation}
                            prediction={this.props.argument[0].prediction} textid={this.props.match.params.textid}
                            argument={this.props.argument[0]} feedback={this.props.feedback} focused_feedback={this.state.focused_comment}/>
                        </div>   
                    </div>)
                }else{
                    return (<div></div>)
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
    var argumentId = props.match.params.textid
    console.log(argumentId)
    Meteor.subscribe('writer_publish_argument', argumentId)
    Meteor.subscribe('writer_publish_estimation', argumentId)
    Meteor.subscribe('feedback_for_argument', argumentId)
    return {userId: Meteor.userId(), argument: Arguments.find().fetch(), argument_estimation: ArgumentEstimations.find().fetch(), feedback: Feedback.find().fetch()}
}, WritePage); 