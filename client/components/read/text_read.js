import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class TextRead extends Component{
    state={
        commentMenuVisible:false,
        commentMenuX:0,
        commentMenuY:0,
        commentMenuYOrigin:0,
        currentSelectedStart: 0,
        currentSelectedEnd: 0,
        editComment: false,
        focused_feedback:-1,
    }

    componentDidMount(){
        var _this = this
        window.onclick = function(e){
            _this.setState({commentMenuVisible:false,})
            console.log(e.target.className)
            if(e.target.id!="commenting_button" && !e.target.className.includes("commenting_interface")){
                _this.setState({editComment:false,})
                _this.refs.commenting_input.value=""
                _this.refs.estimation_input.value=""
            }
            
        }
        window.onscroll = function(e){
            console.log(e)
            _this.setState({commentMenuY: _this.state.commentMenuYOrigin-window.scrollY})
        }
    }

    renderCommentsOnText(){
        return this.props.feedback.map((comment_content, idx)=>{
            // only render comment when it is resolved
            if (comment_content['resolved']==false){
                var start_index = comment_content['ontextposition']
                var end_index = start_index + comment_content['ontext'].length
                var color = '#aaaaaa';
                if (comment_content['userId']==this.props.userId && !(idx == this.state.focused_feedback) && (comment_content['resolved']==false)){
                    color= 'green'
                }else if(comment_content['userId']==this.props.userId && !(idx == this.state.focused_feedback) && (comment_content['resolved']==true)){
                    color= 'red'
                }else if(comment_content['userId']==this.props.userId && (idx == this.state.focused_feedback)){
                    color='yellow'
                }
                else if(idx == this.props.focused_feedback){
                    color='yellow'
                }
                var replaced = this.props.argument['argument'].substring(0, start_index)+"<span class='writemode_comment' style='background-color: "+color+"; opacity: 0.3'>"+comment_content['ontext']+'</span>'+this.props.argument['argument'].substring(end_index+1, this.props.argument.length)
                return (<div style={{margin: "0"}}
                className='with_draft card-panel writemode_comment_encloser' dangerouslySetInnerHTML={{__html:replaced}}>
                </div>)
            }
        })
    }

    commentMenu(e){
        console.log(window.getSelection().toString())
        var selObj = window.getSelection()
        if(selObj.toString()!=""){
            e.preventDefault();
            var end = Math.max(selObj.anchorOffset, selObj.focusOffset)
            var start = Math.min(selObj.anchorOffset, selObj.focusOffset)
            console.log(window.scrollY)
            console.log(e.pageY, e.screenY)
            console.log(this.props.argument['argument'].substring(start,end))
            this.setState({commentMenuVisible:true, commentMenuX: e.pageX, commentMenuY: e.pageY-window.scrollY, commentMenuYOrigin: e.pageY,
            currentSelectedEnd: end, currentSelectedStart: start});
        }    
    }

    addComment(){
        this.setState({editComment: true})
        console.log(this.props.argument['argument'].substring(this.state.currentSelectedStart,this.state.currentSelectedEnd));
    }

    submitComment(){
        console.log(this.props.argument['_id'], this.refs.commenting_input.value)
        Meteor.call('feedback.updatefeedback', this.props.argument['_id'], this.refs.commenting_input.value, this.state.currentSelectedStart, this.props.argument['argument'].substring(this.state.currentSelectedStart,this.state.currentSelectedEnd), this.refs.estimation_input.value, this.props.argument['argument'])
        this.refs.commenting_input.value=""
        this.refs.estimation_input.value=""
    }

    renderFeedback(){
        return this.props.feedback.map((feedback,idx)=>{
            if (idx==this.state.focused_feedback){
                console.log("should have been rendered")
                if (this.props.userId!=feedback['userId']){
                    return (<div key={'feedback'+idx.toString()} className="Comment">
                    <div><b>Feedback on this part of text:</b></div>
                    <div>
                        {feedback['comment']}
                    </div>
                    </div>)
                }else{
                    return (<div key={'feedback'+idx.toString()} className="Comment">
                    <div><b>Feedback on this part of text:</b></div>
                    <div>
                        {feedback['comment']}
                    </div>
                    <div><b>Your estimation on writer's reaction on this feedback:</b></div>
                    <div>
                        {feedback['estimation']}
                    </div>
                    </div>)
                }
            }
            
        })
    }

    selectComment(){
        var selObj = window.getSelection()

        var sel_end = Math.max(selObj.anchorOffset, selObj.focusOffset)
        var sel_start = Math.min(selObj.anchorOffset, selObj.focusOffset)
        console.log(this.props.argument['argument'].substring(sel_start,sel_end))
        //this.setState({commentMenuVisible:true, commentMenuX: e.pageX, commentMenuY: e.pageY,
        //currentSelectedEnd: end, currentSelectedStart: start}); 
        //var sel_start = document.getElementById("argument_draft").selectionStart
        //var sel_end = document.getElementById("argument_draft").selectionEnd
        var selected = -1;
        var selected_sim = 0;
        for(var i in this.props.feedback){
            var cur_comment = this.props.feedback[i]
            var cm_start = cur_comment['ontextposition']
            var cm_end = cm_start + cur_comment['ontext'].length
            console.log(sel_start, sel_end, cm_start, cm_end)
            if(sel_start>cm_end || sel_end<cm_start){
                continue
            }

            var sm_start = (sel_start<cm_start)? cm_start : sel_start;
            var sm_end = (sel_end > cm_end) ? cm_end : sel_end;

            var precision = (sm_end-sm_start+1)/(sel_end-sel_start+1)
            var recall = (sm_end-sm_start+1)/(cm_end-cm_start+1)
            console.log(precision, recall)
            if (precision + recall == 0){
                continue
            }else{
                var score = 2*precision*recall/(precision+recall)
                if (score>selected_sim){
                    selected_sim = score
                    selected = i
                }
            }
        }
        console.log(selected)
        this.setState({focused_feedback:selected})
        //this.props.focus_comment(selected)
    }

    render(){
        var color="#ffff44"
        var replaced = this.props.argument['argument'].substring(0, this.state.currentSelectedStart)
        +"<span class='writemode_comment' style='background-color: "+color+"; opacity: 0.3'>"
        +this.props.argument['argument'].substring(this.state.currentSelectedStart, this.state.currentSelectedEnd)
        +'</span>'+this.props.argument['argument'].substring(this.state.currentSelectedEnd, this.props.argument.length)
                

        return (
        <div>
        <div className='col s8'>
            <p><b>Argument by {this.props.argument['email']} on {this.props.argument['topic']}:</b></p>
            <div style={{'position':'relative'}}>
            <div style={{backgroundColor:(this.props.prediction)?'#eeeeee':'transparent', margin: "0"}}
            className="with_draft card-panel" onContextMenu={this.commentMenu.bind(this)}
            onMouseUp={this.selectComment.bind(this)}>{this.props.argument['argument']}</div> 
            {this.renderCommentsOnText()} 
            <div className='with_draft card-panel writemode_comment_encloser' dangerouslySetInnerHTML={{__html:replaced}}
            style={{display: (this.state.editComment)? "block":"none", marginTop:0}}>
            </div>
            <div id="commenting_button" className={"Comment_Box"} style={{"position":"fixed", "display":(this.state.commentMenuVisible)? "block":"none", 'top':this.state.commentMenuY, 'left': this.state.commentMenuX}}
            onClick={this.addComment.bind(this)}>Add Comment</div>
            
        </div>
        </div>
        <div className='col s4 stickySide'>
            <div>
                <div>
                    <p><b>You can leave a comment by selecting a certain part of the text and right-clicking the mouse.</b></p>
                </div>
                <div className="commenting_interface Comment_Box" style={{"display":(this.state.editComment)? "block":"none",}}>
                    <p>Input your feedback here.</p>
                    <div className="input-field commenting_interface" style={{paddingTop:0}}>
                        
                        <textarea id={'commenting_input'} ref={'commenting_input'}
                        className="materialize-textarea commenting_interface"></textarea>
                        <label className="commenting_interface" htmlFor={'commenting_input'}>Feedback</label>
                    </div>
                    <p>How would the writer react to your feedback? Let's estimate!</p>
                    <div className="input-field commenting_interface" style={{paddingTop:0}}>
                        <textarea id={'estimation_input'} ref={'estimation_input'}
                        className="materialize-textarea commenting_interface"></textarea>
                        <label className="commenting_interface" htmlFor={'estimation_input'}>Estimation</label>
                    </div>
                    <div className="btn" onClick={this.submitComment.bind(this)}>Submit</div>
                </div>
                <div>
                {this.renderFeedback()}
            </div>
            </div>
            
        </div>
        </div>)
    }
}

export default TextRead;