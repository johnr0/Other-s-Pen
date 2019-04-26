import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';

class FeedbackReflection extends Component{
    submitReflection(){
        Meteor.call('feedback.FonFReflection', this.props.feedback._id, this.refs.reflection.value);
        location.replace("/")
    }


    render(){
        var color="yellow"
        var start_index = this.props.feedback['ontextposition']
        var end_index = start_index + this.props.feedback['ontext'].length
        var replaced = this.props.feedback['texthistory'].substring(0, start_index)+"<span class='writemode_comment' style='background-color: "+color+"; opacity: 0.3'>"+this.props.feedback['ontext']+'</span>'+this.props.feedback['texthistory'].substring(end_index+1, this.props.feedback['texthistory'].length)
        return (
            <div className="row" style={{'paddingTop': '80px'}}>
                <div className='col s8'>
                    <div style={{'position':'relative'}}> 
                    <div style={{backgroundColor:'transparent', margin: "0"}}
                    className="with_draft card-panel">
                        {this.props.feedback['texthistory']}
                    </div> 
                    <div style={{margin: "0"}}
                    className='with_draft card-panel writemode_comment_encloser' dangerouslySetInnerHTML={{__html:replaced}}>
                    </div>
                    </div>
                    
                </div>
                <div className='col s4' style={{'position':'relative'}}>
                    <div className="stickSide">
                    <div className="commenting_interface Comment_Box">
                    <p>Below was your feedback</p>
                    <p>{this.props.feedback['comment']}</p>
                    <p>Below is how you estimated other's feedback.</p>
                    <p>{this.props.feedback['estimation']}</p>
                    <p>Below is the writer's feedback on your feedback.</p>
                    <p>{this.props.feedback['feedback_on_feedback']}</p>
                    <div>Is the feedback what you expected from the writer? Would it have been possible to preemptively be prepared for the issue brought by the feedback? How should you improve yourself from this feedback?</div>
                        <div className="input-field" style={{paddingTop:0}}>
                            <textarea id={'reflection'} ref={'reflection'}
                            className="materialize-textarea"></textarea>
                            <label htmlFor={'reflection'}>Your answer here</label>
                        </div>
                        <div className="btn" onClick={this.submitReflection.bind(this)}>Submit</div>
                    </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default FeedbackReflection;