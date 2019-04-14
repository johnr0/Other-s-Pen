import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';

class ReflectionAndComment extends Component{
    state = {
        prediction_num: 1,
    }

    returnReflection(feedbackid){
        console.log(this.refs.reflection1.value, this.refs.reflection2.value)
        Meteor.call('feedback.updatereflection', feedbackid, this.refs.reflection1.value, this.refs.reflection2.value)
    }

    renderFeedback(){
        console.log("try render", this.props.focused_feedback)
        return this.props.feedback.map((feedback,idx)=>{
            if (idx==this.props.focused_feedback){
                console.log("should have been rendered")
                return (<div key={'feedback'+idx.toString()} className="Comment" style={{maxHeight:this.predictionContainerHeight()}}>
                <div><b>Feedback by {feedback['useremail']}:</b></div>
                <div>
                    {feedback['comment']}
                </div>
                <div style={{'marginTop':'10px'}}><b>Try to reflect on this comment before you revise this part.</b></div>
                <ol>
                    <li>
                        <div>Is the feedback what you expected from the writer? Would it have been possible to preemptively be prepared for the issue brought by the feedback? How should you improve yourself from this feedback?</div>
                        <div className="input-field" style={{paddingTop:0}}>
                            <textarea id={'reflection1'} ref={'reflection1'}
                            className="materialize-textarea"></textarea>
                            <label htmlFor={'reflection1'}>Your answer here</label>
                        </div>
                    </li>
                    <li>
                        <div>You can also leave feedback on how other people left feedback, so that they can give people better feedback later!</div>
                            <div className="input-field" style={{paddingTop:0}}>
                                <textarea id={'reflection2'} ref={'reflection2'}
                                className="materialize-textarea"></textarea>
                                <label htmlFor={'reflection2'}>Your feedback here</label>
                        </div>
                    </li>   
                </ol>
                <div>
                    <span className="btn" style={{'float':'right'}} onClick={this.returnReflection.bind(this, feedback._id)}>End Reflection on Feedback</span>
                </div>
            </div>)
            }
            
        })
    }

    renderPredictionInput(){
        var arr = new Array(this.state.prediction_num).fill(0)
        console.log(arr)
        return arr.map((ele,idx)=>{
            return (
                <div className="input-field" style={{paddingTop:0}}>
                    <textarea id={'prediction'+(idx+1).toString()} ref={'prediction'+(idx+1).toString()}
                    className="materialize-textarea"></textarea>
                    <label htmlFor={'prediction'+(idx+1).toString()}>Prediction {idx+1}</label>
                </div>
            )
        })
    }

    addPrediction(){
        this.setState({prediction_num: this.state.prediction_num+1})
    }

    popPrediction(){
        if(this.state.prediction_num!=1){
            this.setState({prediction_num: this.state.prediction_num-1})
        }
        
    }

    predictionContainerHeight(){
        return (window.innerHeight/2-52).toString()+'px';
    }

    predictionHeight(){
        var prediction_prompt = document.getElementById('prediction_prompt')
        var prediction_explanation = document.getElementById('prediction_explanation')
        if(prediction_prompt==undefined || prediction_explanation==undefined){
            return ''
        }else{
            console.log(prediction_prompt.scrollHeight, prediction_explanation.scrollHeight)
            return (window.innerHeight-120-29-parseInt(prediction_prompt.scrollHeight)-parseInt(prediction_explanation.scrollHeight)).toString()+'px'
        }
    }

    submitPrediction(){
        // handle backend

        this.setState({prediction_num:1})
        if(confirm("Are you sure to publish the text? If you want to revise the argument, you do it before publishing it.")){
            var esti_inputs = []
            for(var i=0; i<this.state.prediction_num; i++){
                esti_inputs.push(this.refs['prediction'+(i+1).toString()].value)
            }
            Meteor.call('argumentestimations.updateestimation', this.props.textid, esti_inputs, (err,res)=>{
                Meteor.call('arguments.updatepublish', this.props.textid, (err, res)=>{
                    document.getElementById("publish_switch").checked = true;
                    
                })
            })
            
            
        }
        Meteor.call('arguments.endprediction', this.props.textid)
    }

    renderPredictionList(){
        return this.props.argument_estimation.map((estimation, idx)=>{
            return(<li key={'esti_'+estimation._id}>
                {estimation.estimation}
            </li>)
        })
    }

    renderPrediction(){
        if(this.props.prediction){
            return (<div>
                <p id="prediction_prompt"><b>Predict how other people will give feedback on your draft!</b></p>
                <p id="prediction_explanation">There can be various people who have similar or opposing ideas to your argumentation. Let's try to understand and predict what kinds of feedback they will leave on your draft.</p>
                <div className="PredictionBox" style={{maxHeight:this.predictionHeight()}}>
                    {this.renderPredictionInput()}
                    <div>
                        <i className="material-icons" onClick={this.addPrediction.bind(this)}>add_box</i> 
                        <i className="material-icons" onClick={this.popPrediction.bind(this)} style={{opacity:(this.state.prediction_num==1)?'0.5':'1'}}>indeterminate_check_box</i>
                        <span className="btn" style={{float:'right'}} onClick={this.submitPrediction.bind(this)}>Submit</span>
                    </div>
                </div>
            </div>)
        }else if(!this.props.published){
            return (<div>Instruction
                <ol>
                    <li>Select the topic by clicking "SELECT A TOPIC" button.</li>
                    <li>Write your own argument on the topic.</li>
                    <li>Click "Publish to people" button if your are done with writing the argument!</li>
                </ol>
            </div>)
        }else if(this.props.published){
            return (<div>
                <p><b>Below is a list of how you predicted other people would say.</b></p>
                <ol>{this.renderPredictionList()}</ol>
            </div>)
        }
    }

    render(){
        if(false){//this.props.published == undefined || this.props.published == false){

        }else{
            return (<div className='col s4 stickySide'>
                <div className="Prediction"  style={{maxHeight:this.predictionContainerHeight()}}>
                    {this.renderPrediction()}
                </div>
                {this.renderFeedback()}
                
            </div>)
        }
        
    }
}

export default ReflectionAndComment;